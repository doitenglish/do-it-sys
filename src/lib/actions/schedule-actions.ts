"use server";

import { z } from "zod";
import { FormState } from "@/definitions/common-types";
import {
  createSchedule as FBcreateSchedule,
  updateSchedule as FBupdateSchedule,
  deleteSchedule as FBdeleteSchedule,
  addAttendees as FBaddAttendees,
  removeAttendees as FBremoveAttendees,
  saveOnAir as FBsaveOnAir,
} from "@/lib/firebase/services/schedule-service";
import { FrontendClass } from "@/definitions/class-types";
import { revalidatePath } from "next/cache";
import {
  ADMIN_CLASS_BASE_PATH,
  ADMIN_SCHEDULES_BASE_PATH,
  CLASS_BASE_PATH,
  SCHEDULES_BASE_PATH,
} from "../constants";
import { redirect } from "next/navigation";
import { formatTimeToNumber } from "../utils";
import { onAirAttendee } from "@/definitions/student-types";
import { getCurrentUser } from "../auth";

const FormSchema = {
  dayOfWeek: z.coerce.number().gt(0).lt(6),
  period: z.coerce.number().gt(0).lt(6),
  startTime: z.coerce.number().gte(540).lte(1380),
  endTime: z.coerce.number().gte(540).lte(1380),
};

const CreateSchedule = z.object({
  ...FormSchema,
});

export async function createSchedule(
  forAdmin: boolean,
  _class: FrontendClass,
  _: FormState,
  formData: FormData
) {
  const validatedFields = CreateSchedule.safeParse({
    dayOfWeek: Number(formData.get("dayOfWeek")),
    period: Number(formData.get("period")),
    startTime: formatTimeToNumber(formData.get("start")?.toString()),
    endTime: formatTimeToNumber(formData.get("end")?.toString()),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to create schedule.",
    };
  }
  try {
    const result = await FBcreateSchedule({
      dayOfWeek: validatedFields.data.dayOfWeek,
      period: validatedFields.data.period,
      startTime: validatedFields.data.startTime,
      endTime: validatedFields.data.endTime,
      _class,
    });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Create Schedule.",
    };
  }

  const path = `${forAdmin ? ADMIN_CLASS_BASE_PATH : CLASS_BASE_PATH}/${
    _class.id
  }/schedules`;

  revalidatePath(path);
  redirect(path);
}

const UpdateSchedule = z.object({
  ...FormSchema,
  teacher: z.string(),
});

export async function updateSchedule(
  id: string,
  teacherName: string,
  _: FormState,
  formData: FormData
) {
  const validatedFields = UpdateSchedule.safeParse({
    dayOfWeek: Number(formData.get("dayOfWeek")),
    period: Number(formData.get("period")),
    startTime: formatTimeToNumber(formData.get("start")?.toString()),
    endTime: formatTimeToNumber(formData.get("end")?.toString()),
    teacher: formData.get("teacher"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to update schedule.",
    };
  }
  try {
    const result = await FBupdateSchedule({
      id,
      dayOfWeek: validatedFields.data.dayOfWeek,
      period: validatedFields.data.period,
      startTime: validatedFields.data.startTime,
      endTime: validatedFields.data.endTime,
      teacher: validatedFields.data.teacher,
      teacherName,
    });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Update Schedule.",
    };
  }

  const path = ADMIN_SCHEDULES_BASE_PATH;

  revalidatePath(path);
  redirect(path);
}

export async function deleteSchedule(
  _classId: string,
  id: string,
  attendees: string[]
) {
  try {
    const result = await FBdeleteSchedule({ _classId, id, attendees });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Delete Schedule.",
    };
  }

  const path = ADMIN_SCHEDULES_BASE_PATH;

  revalidatePath(path);
  redirect(path);
}

export async function addAttendees(
  forAdmin: boolean,
  _class: string,
  id: string,
  student: string
) {
  try {
    const result = await FBaddAttendees({ id, student });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }

    const path = forAdmin
      ? ADMIN_CLASS_BASE_PATH
      : CLASS_BASE_PATH + "/" + _class + "/schedules" + "/" + id + "/attendees";

    revalidatePath(path);
  } catch (error) {
    return {
      message: "Server Error: Failed to Add Attendees.",
    };
  }
}

export async function removeAttendees(
  forAdmin: boolean,
  _class: string,
  id: string,
  student: string
) {
  try {
    const result = await FBremoveAttendees({ id, student });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }

    const path = forAdmin
      ? ADMIN_CLASS_BASE_PATH
      : CLASS_BASE_PATH + "/" + _class + "/schedules" + "/" + id + "/attendees";

    revalidatePath(path);
  } catch (error) {
    return {
      message: "Server Error: Failed to Remove Attendees.",
    };
  }
}

export async function saveOnAir(
  id: string,
  attendees: onAirAttendee[],
  teacherName: string,
  className: string
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        message: "UnAuthenticated.",
      };
    }

    if (currentUser.role !== "teacher") {
      return {
        message: "UnAuthorized.",
      };
    }

    const result = await FBsaveOnAir({ id, attendees, teacherName, className });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Saved",
    };
  }
  const path = SCHEDULES_BASE_PATH;
  revalidatePath(path);
  redirect(path);
}

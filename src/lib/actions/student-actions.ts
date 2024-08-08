"use server";

import { z } from "zod";
import {
  createStudent as FBcreateStudent,
  updateStudent as FBupdateStudent,
  deleteStudent as FBdeleteStudent,
  resetPassword as FBresetPassword,
  updateStudentsLevel as FBupdateStudentsLevel,
} from "../firebase/services/student-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormState } from "@/definitions/common-types";
import { LEVELS_BASE_PATH, STUDENTS_BASE_PATH } from "../constants";
import { handleErrorMsg } from "../utils";

const path = STUDENTS_BASE_PATH;

const FormSchema = z.object({
  id: z.string(),
  nameKo: z.string().min(2),
  nameEn: z.string().min(2),
  signInID: z.string().min(2),
  level: z.string(),
  levelName: z.string(),
  division: z.string(),
  birth: z.string().min(10),
  phone: z.string().max(13),
});

const CreateStudent = FormSchema.omit({
  id: true,
});

export async function createStudent(
  levelName: string,
  _: FormState,
  formData: FormData
) {
  const division = formData.get("division") || "none";
  const validatedFields = CreateStudent.safeParse({
    nameKo: formData.get("nameKo"),
    nameEn: formData.get("nameEn"),
    signInID: formData.get("signInID"),
    level: formData.get("level"),
    levelName,
    division,
    birth: formData.get("birth"),
    phone: formData.get("phone"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to create student.",
    };
  }

  try {
    const result = await FBcreateStudent(validatedFields.data);

    if (!result.ok) {
      return { message: result.error };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to create student.",
    };
  }
  revalidatePath(path);
  redirect(path);
}

const UpdateStudent = FormSchema.omit({
  signInID: true,
});
export async function updateStudent(
  id: string,
  levelName: string,
  _: FormState,
  formData: FormData
) {
  const division = formData.get("division") || "none";
  const validatedFields = UpdateStudent.safeParse({
    id,
    nameKo: formData.get("nameKo"),
    nameEn: formData.get("nameEn"),
    birth: formData.get("birth"),
    phone: formData.get("phone"),
    level: formData.get("level"),
    levelName,
    division,
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to update student.",
    };
  }

  try {
    const result = await FBupdateStudent(validatedFields.data);

    if (!result.ok) {
      return { message: result.error };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to update student.",
    };
  }

  revalidatePath(path);
  redirect(path);
}

export async function deleteStudent(id: string) {
  try {
    const result = await FBdeleteStudent({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }
  } catch (error) {
    return {
      message: handleErrorMsg(error, "Server Error: Failed to delete student."),
    };
  }

  revalidatePath(path);
  redirect(path);
}

export async function resetPassword(id: string) {
  try {
    const result = await FBresetPassword({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }
  } catch (error) {
    return {
      message: handleErrorMsg(error, "Server Error: Failed to reset password."),
    };
  }
  redirect(path);
}

const UpdateStudentsLevel = FormSchema.pick({
  level: true,
  levelName: true,
  division: true,
});

export async function updateStudentsLevel(
  ids: string[],
  levelFrom: string,
  levelToName: string,
  _: FormState,
  formData: FormData
) {
  if (ids.length === 0) {
    return {
      ok: true,
    };
  }
  const division = formData.get("division") || "none";
  const validatedFields = UpdateStudentsLevel.safeParse({
    level: formData.get("levelTo"),
    levelName: levelToName,
    division,
  });

  if (!validatedFields.success) {
    return {
      ok: false,
      message: "Invalid Fields. Failed to update students level.",
    };
  }

  try {
    const result = await FBupdateStudentsLevel({
      ids,
      levelFrom,
      levelTo: validatedFields.data.level,
      levelToName: validatedFields.data.levelName,
      division: validatedFields.data.division,
    });

    if (!result.ok) {
      throw new Error(result.error);
    }

    revalidatePath(
      LEVELS_BASE_PATH + `/${validatedFields.data.level}/students`
    );
    return {
      ok: true,
      message: "Successfully updated students level.",
    };
  } catch (error) {
    return {
      ok: false,
      message: handleErrorMsg(
        error,
        "Server Error: Failed to update students level."
      ),
    };
  }
}

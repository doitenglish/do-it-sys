import "server-only";

import {
  BackendSchedule,
  CreateScheduleInput,
  CreateScheduleOutput,
  DeleteScheduleInput,
  DeleteScheduleOutput,
  FrontendSchedule,
  GetSchedulesByClassInput,
  GetSchedulesByClassOutput,
  UpdateScheduleInput,
  UpdateScheduleOutput,
  GetScheduleByIdInput,
  GetScheduleByIdOutput,
  GetSchedulesByFiltersInput,
  GetSchedulesByFiltersOutput,
  HandleAttendeesInput,
  HandleAttendeesOutput,
  GetTodoInput,
  GetTodoOutput,
  SaveOnAirInput,
  SaveOnAirOutput,
} from "@/definitions/schedule-types";
import { getStudentsForSelect } from "./student-service";
import { adminDB } from "../firebase-admin";
import updateCountable from "./common/updateCountable";
import { FieldValue, Query, Timestamp } from "firebase-admin/firestore";
import { getPaginateAndCount } from "../firestore-utils";
import { formatDate, getToday } from "@/lib/utils";
import { mutateBalanceById } from "./do-service";

export async function createSchedule(
  createScheduleInput: CreateScheduleInput
): Promise<CreateScheduleOutput> {
  const { dayOfWeek, period, startTime, endTime, _class } = createScheduleInput;
  try {
    if (dayOfWeek < 1 || dayOfWeek > 5) {
      return {
        ok: false,
        error: "Invalid day of week",
      };
    }

    if (startTime < 540 || startTime > 1320) {
      return {
        ok: false,
        error: "Time out of range.",
      };
    }

    if (startTime >= endTime) {
      return {
        ok: false,
        error: "Start time must be before end time",
      };
    }

    const {
      id,
      name,
      textbook,
      level,
      levelName,
      division,
      teacher,
      teacherName,
    } = _class;

    const result = await getStudentsForSelect({
      level,
      division,
    });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const studentCollection = adminDB.collection("students");
    const classRef = adminDB.collection("classes").doc(id);
    const scheduleRef = adminDB.collection("schedules").doc();

    const students: string[] = [];

    await adminDB.runTransaction(async (transaction) => {
      for (const student of result.data) {
        updateCountable({
          docRef: studentCollection.doc(student.id),
          countable: "totalSchedules",
          transaction,
          amount: 1,
        });

        students.push(student.id);
      }

      updateCountable({
        docRef: classRef,
        countable: "totalSchedules",
        transaction,
        amount: 1,
      });

      const data: BackendSchedule = {
        _class: id,
        _className: name,
        textbook,
        level,
        levelName,
        division,
        defaultTeacher: teacher,
        teacher,
        teacherName,
        dayOfWeek,
        period,
        startTime,
        endTime,
        attendees: students,
        lastClassAt: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      transaction.set(scheduleRef, data);
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot create schedule.",
    };
  }
}

export async function getSchedulesByClass(
  getSchedulesByClassInput: GetSchedulesByClassInput
): Promise<GetSchedulesByClassOutput> {
  const { id, currentPage } = getSchedulesByClassInput;

  const schedulesRef = adminDB
    .collection("schedules")
    .where("_class", "==", id);
  try {
    const result = await getPaginateAndCount(schedulesRef, { currentPage });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const schedules: FrontendSchedule[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data() as BackendSchedule;

      const schedule: FrontendSchedule = {
        ...data,
        id: doc.id,
        lastClassAt: data.lastClassAt?.toDate() ?? null,
        updatedAt: data.updatedAt.toDate(),
        createdAt: data.createdAt.toDate(),
      };

      schedules.push(schedule);
    }

    return {
      ok: true,
      data: schedules,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot fetch schedules.",
    };
  }
}

export async function getScheduleByFilters(
  getSchedulesByFiltersInput: GetSchedulesByFiltersInput
): Promise<GetSchedulesByFiltersOutput> {
  const { dayOfWeek, period, currentPage } = getSchedulesByFiltersInput;
  if (dayOfWeek < 1 || dayOfWeek > 5) {
    return {
      ok: false,
      error: "Invalid day of week",
    };
  }

  try {
    let schedulesRef: Query = adminDB
      .collection("schedules")
      .where("dayOfWeek", "==", dayOfWeek);

    if (period > 0) {
      schedulesRef = schedulesRef.where("period", "==", period);
    }
    schedulesRef = schedulesRef.orderBy("startTime", "asc");

    const result = await getPaginateAndCount(schedulesRef, {
      currentPage,
      itemsPerPage: 6,
    });

    if (!result.ok) {
      throw new Error(result.error);
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const schedules: FrontendSchedule[] = snapshot.docs.map((doc) => {
      const data = doc.data() as BackendSchedule;
      return {
        ...data,
        id: doc.id,
        lastClassAt: data.lastClassAt?.toDate() ?? null,
        updatedAt: data.updatedAt.toDate(),
        createdAt: data.createdAt.toDate(),
      };
    });

    return {
      ok: true,
      data: schedules,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot fetch schedules.",
    };
  }
}

export async function getTodo(
  getTodoInput: GetTodoInput
): Promise<GetTodoOutput> {
  const { id, currentPage } = getTodoInput;
  const today = getToday();
  const todosRef = adminDB
    .collection("schedules")
    .where("teacher", "==", id)
    .where("dayOfWeek", "==", today.getDay());

  try {
    const todosSnapshot = await todosRef.get();

    const todos: FrontendSchedule[] = [];

    for (const doc of todosSnapshot.docs) {
      const data = doc.data() as BackendSchedule;

      if (
        data.lastClassAt &&
        formatDate(data.lastClassAt.toDate()) == formatDate(today)
      ) {
        continue;
      }

      const todo: FrontendSchedule = {
        ...data,
        id: doc.id,
        lastClassAt: data.lastClassAt?.toDate() ?? null,
        updatedAt: data.updatedAt.toDate(),
        createdAt: data.createdAt.toDate(),
      };

      todos.push(todo);
    }

    todos.sort((a, b) => {
      if (a.startTime < b.startTime) {
        return -1;
      }
      if (a.startTime > b.startTime) {
        return 1;
      }
      return 0;
    });

    const offset = (currentPage - 1) * 5;
    const totalPages = Math.ceil(todos.length / 5);

    return {
      ok: true,
      data: todos.slice(offset, offset + 5),
      totalCounts: todos.length,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot fetch todos.",
    };
  }
}

export async function saveOnAir(
  saveOnAirInput: SaveOnAirInput
): Promise<SaveOnAirOutput> {
  const { id, attendees, teacherName, className } = saveOnAirInput;
  try {
    const today = new Date();

    const scheduleRef = adminDB.collection("schedules").doc(id);
    const doCollection = adminDB.collection("do");
    const attendanceRef = adminDB
      .collection("attendance")
      .doc(formatDate(today));

    const attendanceDoc = await attendanceRef.get();

    if (!attendanceDoc.exists) {
      // If the document doesn't exist, initialize it with empty arrays
      await attendanceRef.set({
        date: formatDate(today),
        dateForOrder: Timestamp.now(),
        dayOfWeek: today.getDay(),
        absents: [],
      });
    }

    await adminDB.runTransaction(async (transaction) => {
      const absentsToUpdate = [];

      for (const attendee of attendees) {
        if (attendee.absent !== 0) {
          absentsToUpdate.push(attendee.id);
          continue;
        }

        const amount = attendee.history.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );

        if(amount > 0) {
          mutateBalanceById({
          id: attendee.id,
          transaction,
          amount,
          detail: className,
          type: "class",
          createdBy: teacherName,
        });
        }
      }

      //save attendance
      if (absentsToUpdate.length > 0) {
        transaction.update(attendanceRef, {
          absents: FieldValue.arrayUnion(...absentsToUpdate),
        });
      }

      transaction.update(scheduleRef, {
        lastClassAt: Timestamp.now(),
      });
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot save on air.",
    };
  }
}

export async function updateSchedule(
  updateClassInput: UpdateScheduleInput
): Promise<UpdateScheduleOutput> {
  const { id, dayOfWeek, period, startTime, endTime, teacher, teacherName } =
    updateClassInput;

  const scheduleRef = adminDB.collection("schedules").doc(id);
  try {
    scheduleRef.update({
      dayOfWeek,
      period,
      startTime,
      endTime,
      teacher,
      teacherName,
      updatedAt: Timestamp.now(),
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot update schedule.",
    };
  }
}

export async function deleteSchedule(
  deleteScheduleInput: DeleteScheduleInput
): Promise<DeleteScheduleOutput> {
  const { id, _classId, attendees } = deleteScheduleInput;

  const studentCollection = adminDB.collection("students");
  const classRef = adminDB.collection("classes").doc(_classId);
  const scheduleRef = adminDB.collection("schedules").doc(id);

  try {
    await adminDB.runTransaction(async (transaction) => {
      for (const student of attendees) {
        updateCountable({
          docRef: studentCollection.doc(student),
          countable: "totalSchedules",
          transaction,
          amount: -1,
        });
      }

      updateCountable({
        docRef: classRef,
        countable: "totalSchedules",
        transaction,
        amount: -1,
      });

      transaction.delete(scheduleRef);
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot delete schedule.",
    };
  }
}

export async function getScheduleById(
  getScheduleByIdInput: GetScheduleByIdInput
): Promise<GetScheduleByIdOutput> {
  const { id } = getScheduleByIdInput;

  const scheduleRef = adminDB.collection("schedules").doc(id);

  try {
    const scheduleSnapshot = await scheduleRef.get();

    if (!scheduleSnapshot.exists) {
      return {
        ok: false,
        error: "Schedule not found.",
      };
    }

    const data = scheduleSnapshot.data() as BackendSchedule;

    const schedule: FrontendSchedule = {
      ...data,
      id: scheduleSnapshot.id,
      lastClassAt: data.lastClassAt?.toDate() ?? null,
      updatedAt: data.updatedAt.toDate(),
      createdAt: data.createdAt.toDate(),
    };

    return {
      ok: true,
      data: schedule,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot fetch schedule.",
    };
  }
}

export async function addAttendees(
  addAttendeesInput: HandleAttendeesInput
): Promise<HandleAttendeesOutput> {
  const { id, student } = addAttendeesInput;

  const studentCollection = adminDB.collection("students");
  const scheduleRef = adminDB.collection("schedules").doc(id);

  try {
    await adminDB.runTransaction(async (transaction) => {
      updateCountable({
        docRef: studentCollection.doc(student),
        countable: "totalSchedules",
        transaction,
        amount: 1,
      });

      const scheduleSnapshot = await scheduleRef.get();

      const schedule = scheduleSnapshot.data() as BackendSchedule;
      if (schedule.attendees.includes(student)) {
        return {
          ok: true,
        };
      }

      transaction.update(scheduleRef, {
        attendees: FieldValue.arrayUnion(student),
        updatedAt: Timestamp.now(),
      });
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot add attendees.",
    };
  }
}

export async function removeAttendees(
  removeAttendeesInput: HandleAttendeesInput
): Promise<HandleAttendeesOutput> {
  const { id, student } = removeAttendeesInput;

  const studentCollection = adminDB.collection("students");
  const scheduleRef = adminDB.collection("schedules").doc(id);

  try {
    await adminDB.runTransaction(async (transaction) => {
      updateCountable({
        docRef: studentCollection.doc(student),
        countable: "totalSchedules",
        transaction,
        amount: -1,
      });

      transaction.update(scheduleRef, {
        attendees: FieldValue.arrayRemove(student),
        updatedAt: Timestamp.now(),
      });
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot remove attendees.",
    };
  }
}

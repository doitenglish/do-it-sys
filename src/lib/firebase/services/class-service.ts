import {
  BackendClass,
  CreateClassInput,
  CreateClassOutput,
  DeleteClassInput,
  DeleteClassOutput,
  FrontendClass,
  GetClassByIdInput,
  GetClassByIdOutput,
  GetClassesByTeacherInput,
  GetClassesByTeacherOutput,
  GetClassesInput,
  GetClassesOutput,
  UpdateClassInput,
  UpdateClassOutput,
} from "@/definitions/class-types";
import "server-only";
import { adminDB } from "../firebase-admin";
import {
  filterByLevel,
  getPaginateAndCount,
  searchByTag,
} from "../firestore-utils";
import { Query, Timestamp } from "firebase-admin/firestore";
import updateCountable from "./common/updateCountable";
import { BackendSchedule } from "@/definitions/schedule-types";

export async function getClasses(
  getClassesInput: GetClassesInput
): Promise<GetClassesOutput> {
  const { query, level, division, currentPage } = getClassesInput;
  try {
    let classesRef: Query = adminDB.collection("classes");

    classesRef = filterByLevel(classesRef, {
      level,
      division,
    });

    classesRef = searchByTag(classesRef, {
      query,
    });

    const result = await getPaginateAndCount(classesRef, { currentPage });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const classes = [] as FrontendClass[];

    for (const doc of snapshot.docs) {
      const data = doc.data() as BackendClass;

      const _class: FrontendClass = {
        id: doc.id,
        ...data,
        updatedAt: data.updatedAt.toDate(),
        createdAt: data.createdAt.toDate(),
      };

      classes.push(_class);
    }
    return {
      ok: true,
      data: classes,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get classes",
    };
  }
}

export async function getClassesByTeacher(
  getClassesByTeacherInput: GetClassesByTeacherInput
): Promise<GetClassesByTeacherOutput> {
  const { id, currentPage, level, division } = getClassesByTeacherInput;
  try {
    let classesRef = adminDB.collection("classes").where("teacher", "==", id);

    classesRef = filterByLevel(classesRef, {
      level,
      division,
    });

    const result = await getPaginateAndCount(classesRef, { currentPage });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const classes = [] as FrontendClass[];

    for (const doc of snapshot.docs) {
      const data = doc.data() as BackendClass;

      const _class: FrontendClass = {
        ...data,
        id: doc.id,
        updatedAt: data.updatedAt.toDate(),
        createdAt: data.createdAt.toDate(),
      };

      classes.push(_class);
    }

    return {
      ok: true,
      data: classes,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot fetch classes",
    };
  }
}

export async function createClass(
  createClassInput: CreateClassInput
): Promise<CreateClassOutput> {
  const { name, textbook, level, teacher } = createClassInput;

  const classRef = adminDB.collection("classes").doc();
  const levelRef = adminDB.collection("levels").doc(level);
  const teacherRef = adminDB.collection("teachers").doc(teacher);

  const tags = name.split(" ");
  tags.push(textbook);

  try {
    await adminDB.runTransaction(async (transaction) => {
      const data: BackendClass = {
        ...createClassInput,
        tags,
        totalSchedules: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      //id !== teacher block
      updateCountable({
        docRef: teacherRef,
        countable: "totalClasses",
        transaction,
        amount: 1,
      });

      transaction.set(classRef, data);

      updateCountable({
        docRef: levelRef,
        countable: "totalClasses",
        transaction,
        amount: 1,
      });
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot create class",
    };
  }
}

export async function getClassById(
  getClassesByIdInput: GetClassByIdInput
): Promise<GetClassByIdOutput> {
  const { id } = getClassesByIdInput;

  const classRef = adminDB.collection("classes").doc(id);
  try {
    const classSnapshot = await classRef.get();
    if (!classSnapshot.exists) {
      return {
        ok: false,
        error: "Class not found",
      };
    }
    const data = classSnapshot.data() as BackendClass;

    const _class: FrontendClass = {
      id: classSnapshot.id,
      ...data,
      updatedAt: data.updatedAt.toDate(),
      createdAt: data.createdAt.toDate(),
    };

    return {
      ok: true,
      data: _class,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot fetch class",
    };
  }
}

export async function updateClass(
  updateClassInput: UpdateClassInput
): Promise<UpdateClassOutput> {
  const { id, teacher, teacherName } = updateClassInput;

  const classRef = adminDB.collection("classes").doc(id);

  try {
    const classSnapshot = await classRef.get();

    if (!classSnapshot.exists) {
      return {
        ok: false,
        error: "Class not found",
      };
    }
    const _class = classSnapshot.data() as BackendClass;

    await adminDB.runTransaction(async (transaction) => {
      // if teacher is changed
      if (teacher !== _class.teacher) {
        // class.teacher.totalClasses -= 1
        const teacherFromRef = adminDB
          .collection("teachers")
          .doc(_class.teacher);
        updateCountable({
          docRef: teacherFromRef,
          countable: "totalClasses",
          transaction,
          amount: -1,
        });

        // teacher.totalClasses += 1
        const teacherToRef = adminDB.collection("teachers").doc(teacher);
        updateCountable({
          docRef: teacherToRef,
          countable: "totalClasses",
          transaction,
          amount: 1,
        });

        const schedules = await adminDB
          .collection("schedules")
          .where("teacher", "==", _class.teacher)
          .get();

        for (const schedule of schedules.docs) {
          const scheduleData = schedule.data() as BackendSchedule;
          const scheduleRef = adminDB.collection("schedules").doc(schedule.id);

          const newScheduleData = {
            ...scheduleData,
            defaultTeacher: teacher,
            teacher,
            teacherName,
            updatedAt: Timestamp.now(),
          };

          transaction.update(scheduleRef, newScheduleData);
        }
      }

      transaction.update(classRef, {
        ...updateClassInput,
        updatedAt: Timestamp.now(),
      });
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot update class",
    };
  }
}

export async function deleteClass(
  deleteClassInput: DeleteClassInput
): Promise<DeleteClassOutput> {
  const { id } = deleteClassInput;

  const classRef = adminDB.collection("classes").doc(id);
  try {
    const classSnapshot = await classRef.get();

    if (!classSnapshot.exists) {
      return {
        ok: false,
        error: "Class not found",
      };
    }

    const _class = classSnapshot.data() as BackendClass;

    if (_class.totalSchedules > 0) {
      return {
        ok: false,
        error: "Cannot delete class with schedules",
      };
    }

    const levelRef = adminDB.collection("levels").doc(_class.level);
    const teacherRef = adminDB.collection("teachers").doc(_class.teacher);
    await adminDB.runTransaction(async (transaction) => {
      updateCountable({
        docRef: levelRef,
        countable: "totalClasses",
        transaction,
        amount: -1,
      });

      updateCountable({
        docRef: teacherRef,
        countable: "totalClasses",
        transaction,
        amount: -1,
      });

      transaction.delete(classRef);
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot delete class",
    };
  }
}

import "server-only";

import { adminAuth, adminDB } from "../firebase-admin";
import { Query, Timestamp } from "firebase-admin/firestore";
import {
  BackendStudent,
  CreateStudentInput,
  CreateStudentOutput,
  GetStudentByIdInput,
  GetStudentByIdOutput,
  UpdateStudentInput,
  UpdateStudentOutput,
  FrontendStudent,
  DeleteStudentInput,
  DeleteStudentOutput,
  GetStudentsInput,
  GetStudentsOutput,
  GetStudentsForSelectInput,
  GetStudentsForSelectOutput,
  StudentForSelect,
  UpdateStudentsLevelInput,
  ResetPasswordInput,
  ResetPasswordOutput,
  GetAttendeesInput,
  GetAttendeesOutput,
  Attendee,
} from "@/definitions/student-types";
import { BackendLevel } from "@/definitions/level-types";
import { UserRecord } from "firebase-admin/auth";
import { updateLevelCountable } from "./level-service";
import {
  filterByLevel,
  searchByTag,
  getPaginateAndCount,
} from "../firestore-utils";
import updateCountable from "./common/updateCountable";
import { firestore } from "firebase-admin";

const DEFAULT_PASSWORD = "123456";

export async function createStudent(
  createStudentInput: CreateStudentInput
): Promise<CreateStudentOutput> {
  const { nameKo, nameEn, signInID, level } = createStudentInput;
  const email = signInID + "@do-it.student";
  let userRecord: UserRecord | undefined;

  try {
    userRecord = await adminAuth.createUser({
      email,
      emailVerified: false,
      password: DEFAULT_PASSWORD,
      disabled: false,
    });

    await adminDB.runTransaction(async (transaction) => {
      if (!userRecord) {
        throw new Error();
      }

      const levelRef = adminDB.collection("levels").doc(level);

      //tags for searching students
      const tags = [];
      tags.push(nameKo.slice(0, 1));
      tags.push(nameKo.slice(0, 2));
      tags.push(nameKo.slice(nameKo.length - 2, nameKo.length));
      tags.push(nameKo);

      const userRef = adminDB.collection("students").doc(userRecord.uid);
      const doAccountRef = adminDB.collection("do").doc(userRecord.uid);

      transaction.set(userRef, {
        ...createStudentInput,
        tags,
        totalSchedules: 0,
        updatedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
      });

      transaction.set(doAccountRef, {
        nameKo,
        nameEn,
        balance: 0,
      });

      updateCountable({
        docRef: levelRef,
        countable: "totalStudents",
        transaction,
        amount: 1,
      });
    });

    return {
      ok: true,
    };
  } catch (error: any) {
    if (userRecord && userRecord.uid) {
      // If the transaction fails but the user was created, delete the user
      await adminAuth.deleteUser(userRecord.uid);
    }

    const errorCode = error.errorInfo?.code;
    const errorMessage =
      errorCode === "auth/email-already-exists"
        ? "The ID is already in use by another account."
        : "Cannot create student.";

    return {
      ok: false,
      error: errorMessage,
    };
  }
}

/*Todo: try-catch inside of transaction*/
export async function updateStudent(
  updateStudentInput: UpdateStudentInput
): Promise<UpdateStudentOutput> {
  const { id, nameKo, nameEn, phone, birth, level, division } =
    updateStudentInput;

  try {
    const studentRef = adminDB.collection("students").doc(id);
    const doAccountRef = adminDB.collection("do").doc(id);

    const studentSnapshot = await studentRef.get();

    if (!studentSnapshot.exists) {
      return {
        ok: false,
        error: ": Student does not exist",
      };
    }

    const student = studentSnapshot.data() as BackendStudent;

    let levelName = student.levelName;
    await adminDB.runTransaction(async (transaction) => {
      // if level changes
      if (level !== student.level) {
        //student.level.totalStudents -= 1
        const levelFromRef = adminDB.collection("levels").doc(student.level);
        let result = await updateLevelCountable({
          levelRef: levelFromRef,
          countable: "totalStudents",
          transaction,
          amount: -1,
        });
        if (!result.ok) {
          throw new Error();
        }

        //level.totalStudents += 1
        const levelToRef = adminDB.collection("levels").doc(level);

        result = await updateLevelCountable({
          levelRef: levelToRef,
          countable: "totalStudents",
          transaction,
          amount: 1,
        });

        if (!result.ok) {
          throw new Error();
        }

        const levelTo = (await levelToRef.get()).data() as BackendLevel;
        levelName = levelTo.name;
      }
      //if name changes
      if (nameKo !== student.nameKo || nameEn !== student.nameEn) {
        transaction.update(doAccountRef, {
          nameKo,
          nameEn,
        });
      }
      // update student info
      transaction.update(studentRef, {
        nameKo,
        nameEn,
        phone,
        level,
        birth,
        levelName,
        division,
        updatedAt: Timestamp.now(),
      });
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: ": Cannot update student",
    };
  }
}

export async function deleteStudent(
  deleteStudentInput: DeleteStudentInput
): Promise<DeleteStudentOutput> {
  const { id } = deleteStudentInput;
  try {
    const studentRef = adminDB.collection("students").doc(id);

    await adminDB.runTransaction(async (transaction) => {
      const studentSnapshot = await transaction.get(studentRef);

      if (!studentSnapshot.exists) {
        return {
          ok: false,
          error: ": Student does not exist",
        };
      }

      const student = studentSnapshot.data() as BackendStudent;
      const doAccountRef = adminDB.collection("do").doc(id);

      if (student.totalSchedules > 0) {
        throw new Error();
      }

      const levelRef = adminDB.collection("levels").doc(student.level);
      const result = await updateLevelCountable({
        levelRef: levelRef,
        countable: "totalStudents",
        transaction: transaction,
        amount: -1,
      });
      if (!result.ok) {
        throw new Error();
      }

      transaction.delete(studentRef);
      transaction.delete(doAccountRef);
      await adminAuth.deleteUser(id);
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: ": Cannot delete student",
    };
  }
}

export async function getStudents(
  getStudentsInput: GetStudentsInput
): Promise<GetStudentsOutput> {
  const { currentPage, query, level, division } = getStudentsInput;

  try {
    let studentsRef: Query = adminDB.collection("students");

    studentsRef = filterByLevel(studentsRef, { level, division });

    studentsRef = searchByTag(studentsRef, {
      query,
    });

    //studentsRef = studentsRef.orderBy("createdAt", "desc");

    const result = await getPaginateAndCount(studentsRef, { currentPage });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const students = [] as FrontendStudent[];

    for (const doc of snapshot.docs) {
      const data = doc.data() as BackendStudent;

      const student: FrontendStudent = {
        ...data,
        id: doc.id,
        updatedAt: data.updatedAt.toDate(),
        createdAt: data.createdAt.toDate(),
      };

      students.push(student);
    }

    return {
      ok: true,
      data: students,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: ": Cannot get students",
    };
  }
}

export async function getStudentById(
  getStudentByIdInput: GetStudentByIdInput
): Promise<GetStudentByIdOutput> {
  const { id } = getStudentByIdInput;

  const studentRef = adminDB.collection("students").doc(id);
  try {
    const studentSnapshot = await studentRef.get();

    if (!studentSnapshot.exists) {
      return {
        ok: false,
        error: "Error02: Student does not exist.",
      };
    }

    const data = studentSnapshot.data() as BackendStudent;

    const student: FrontendStudent = {
      id,
      ...data,
      updatedAt: data.updatedAt.toDate(),
      createdAt: data.createdAt.toDate(),
    };

    return {
      ok: true,
      data: student,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Error02: Cannot get student.",
    };
  }
}

export async function getAttendees(
  getAttendeesInput: GetAttendeesInput
): Promise<GetAttendeesOutput> {
  const { ids } = getAttendeesInput;

  if (ids.length === 0) {
    return {
      ok: true,
      data: [], // No IDs to query
    };
  }

  const studentsCollection = adminDB.collection("students");

  const chunkSize = 10;
  let attendees: Attendee[] = [];

  try {
    for (let i = 0; i < ids.length; i += chunkSize) {
      const chunk = ids.slice(i, i + chunkSize);
      const snapshot = await studentsCollection
        .where(firestore.FieldPath.documentId(), "in", chunk)
        .get();

      attendees = attendees.concat(
        snapshot.docs.map((doc) => {
          const data = doc.data() as BackendStudent;
          const attendee: Attendee = {
            id: doc.id,
            nameKo: data.nameKo,
            nameEn: data.nameEn,
            phone: data.phone,
          };
          return attendee;
        })
      );
    }

    return {
      ok: true,
      data: attendees,
    };
  } catch (error) {
    return {
      ok: false,
      error: ": Cannot get attendees",
    };
  }
}

export async function getStudentsForSelect(
  getStudentsForSelectInput: GetStudentsForSelectInput
): Promise<GetStudentsForSelectOutput> {
  try {
    const { level, division } = getStudentsForSelectInput;

    let studentsRef: Query = adminDB.collection("students");

    studentsRef = filterByLevel(studentsRef, {
      level,
      division,
    });

    const snapshot = await studentsRef.get();

    const students = [] as StudentForSelect[];

    for (const doc of snapshot.docs) {
      const data = doc.data() as BackendStudent;

      const student: StudentForSelect = {
        id: doc.id,
        nameKo: data.nameKo,
        nameEn: data.nameEn,
        birth: data.birth,
        division: data.division,
      };

      students.push(student);
    }

    return {
      ok: true,
      data: students,
      totalCounts: students.length,
      totalPages: 1,
    };
  } catch (error) {
    return {
      ok: false,
      error: "can not get students.",
    };
  }
}

export async function updateStudentsLevel(
  updateStudentsLevelInput: UpdateStudentsLevelInput
) {
  const { ids, levelFrom, levelTo, levelToName, division } =
    updateStudentsLevelInput;
  const baseRef = adminDB.collection("levels");
  const levelFromRef = baseRef.doc(levelFrom);
  const levelToRef = baseRef.doc(levelTo);
  try {
    await adminDB.runTransaction(async (transaction) => {
      const amount = ids.length;
      try {
        updateCountable({
          docRef: levelFromRef,
          countable: "totalStudents",
          transaction,
          amount: -amount,
        });

        updateCountable({
          docRef: levelToRef,
          countable: "totalStudents",
          transaction,
          amount,
        });

        for (const id of ids) {
          transaction.update(adminDB.collection("students").doc(id), {
            level: levelTo,
            levelName: levelToName,
            division,
            updatedAt: Timestamp.now(),
          });
        }
      } catch (error) {
        throw new Error();
      }
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot update students level",
    };
  }
}

export async function resetPassword(
  resetPasswordInput: ResetPasswordInput
): Promise<ResetPasswordOutput> {
  const { id } = resetPasswordInput;
  try {
    await adminAuth.updateUser(id, {
      password: DEFAULT_PASSWORD,
    });

    const studentRef = adminDB.collection("students").doc(id);

    studentRef.update({
      updatedAt: Timestamp.now(),
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot reset password.",
    };
  }
}

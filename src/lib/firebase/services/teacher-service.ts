import "server-only";

import { adminAuth, adminDB } from "../firebase-admin";
import {
  BackendTeacher,
  ChangePasswordInput,
  ChangePasswordOutput,
  CreateTeacherInput,
  CreateTeacherOutput,
  DeleteTeacherInput,
  DeleteTeacherOutput,
  FrontendTeacher,
  GetTeacherByIdInput,
  GetTeachersForSelectOutput,
  GetTeachersInput,
  GetTeachersOutput,
  GetTeahcerByIdOutput,
} from "@/definitions/teacher-types";
import { Timestamp } from "firebase-admin/firestore";
import { getPaginateAndCount } from "../firestore-utils";
import {
  ResetPasswordInput,
  ResetPasswordOutput,
} from "@/definitions/student-types";

const DEFAULT_PASSWORD = "teacher123";

export async function createTeacher(
  createTeacherInput: CreateTeacherInput
): Promise<CreateTeacherOutput> {
  const { signInID, name } = createTeacherInput;
  try {
    const email = signInID + "@do-it.teacher";

    const userRecord = await adminAuth.createUser({
      email,
      emailVerified: false,
      password: DEFAULT_PASSWORD,
      disabled: false,
    });

    const customClaims = {
      role: "teacher", // Example custom claim
      // Add other custom claims as needed
    };

    // Set custom user claims
    await adminAuth.setCustomUserClaims(userRecord.uid, customClaims);

    await adminDB.collection("teachers").doc(userRecord.uid).set({
      name,
      signInID,
      totalClasses: 0,
      role: "teacher",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Firebase: Cannot create teacher",
    };
  }
}

export async function deleteTeacher(
  deleteTeacherInput: DeleteTeacherInput
): Promise<DeleteTeacherOutput> {
  const { id } = deleteTeacherInput;
  try {
    const teacherRef = adminDB.collection("teachers").doc(id);

    await adminDB.runTransaction(async (transaction) => {
      const teacherSnapshot = await transaction.get(teacherRef);

      if (!teacherSnapshot.exists) {
        return { ok: false, error: "Teacher does not exist" };
      }

      const teacher = teacherSnapshot.data() as BackendTeacher;

      if (teacher.totalClasses > 0) {
        return {
          ok: false,
          error: "Cannot delete teacher with classes",
        };
      }

      transaction.delete(teacherRef);
      await adminAuth.deleteUser(id);
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot delete teacher",
    };
  }
}

export async function getTeachers(
  getTeachersInput: GetTeachersInput
): Promise<GetTeachersOutput> {
  const { currentPage } = getTeachersInput;

  try {
    let teachersRef = adminDB
      .collection("teachers")
      .where("role", "==", "teacher");

    const result = await getPaginateAndCount(teachersRef, { currentPage });

    if (!result.ok) {
      throw new Error();
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const teachers = [] as FrontendTeacher[];

    for (const doc of snapshot!.docs) {
      const data = doc.data() as BackendTeacher;

      const teacher: FrontendTeacher = {
        ...data,
        id: doc.id,
        updatedAt: data.updatedAt.toDate(),
        createdAt: data.createdAt.toDate(),
      };

      teachers.push(teacher);
    }

    return {
      ok: true,
      data: teachers,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Firebase: Cannot get teachers",
    };
  }
}

export async function getTeacherById(
  getTeacherByIdInput: GetTeacherByIdInput
): Promise<GetTeahcerByIdOutput> {
  const { id } = getTeacherByIdInput;

  try {
    const teacherRef = adminDB.collection("teachers").doc(id);
    const teacherSnapshot = await teacherRef.get();

    if (!teacherSnapshot.exists) {
      return {
        ok: false,
        error: "Not found",
      };
    }

    const data = teacherSnapshot.data() as BackendTeacher;

    const teacher: FrontendTeacher = {
      id,
      ...data,
      updatedAt: data.updatedAt.toDate(),
      createdAt: data.createdAt.toDate(),
    };

    return {
      ok: true,
      data: teacher,
    };
  } catch (error) {
    return {
      ok: false,
      error: `Cannot get Teacher with id: ${id}`,
    };
  }
}

export async function getTeachersForSelect(): Promise<GetTeachersForSelectOutput> {
  try {
    const teachersRef = adminDB
      .collection("teachers")
      .where("role", "==", "teacher");

    const teacherSnapshot = await teachersRef.get();

    const teachers = [] as FrontendTeacher[];

    for (const doc of teacherSnapshot.docs) {
      const data = doc.data() as BackendTeacher;

      const teacher: FrontendTeacher = {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };

      teachers.push(teacher);
    }

    return {
      ok: true,
      data: teachers,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Firebase: Cannot get teachers",
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

    const teacherRef = adminDB.collection("teachers").doc(id);

    await teacherRef.update({
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

export async function changePassword(
  changePasswordInput: ChangePasswordInput
): Promise<ChangePasswordOutput> {
  const { id, newPassword } = changePasswordInput;
  try {
    await adminAuth.updateUser(id, {
      password: newPassword,
    });

    const teacherRef = adminDB.collection("teachers").doc(id);

    await teacherRef.update({
      updatedAt: Timestamp.now(),
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot change password.",
    };
  }
}

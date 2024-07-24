import {
  AttendanceBase,
  DeleteAttendanceInput,
  DeleteAttendanceOutput,
  GetAttendanceByIdInput,
  GetAttendanceByIdOutput,
  GetAttendancesInput,
  GetAttendancesOutput,
} from "@/definitions/attendance-types";
import { adminDB } from "../firebase-admin";
import { getPaginateAndCount } from "../firestore-utils";

export async function getAttendances(
  getAttendancesInput: GetAttendancesInput
): Promise<GetAttendancesOutput> {
  const { currentPage } = getAttendancesInput;

  const attendanceCollection = adminDB
    .collection("attendance")
    .orderBy("dateForOrder", "desc");

  try {
    const result = await getPaginateAndCount(attendanceCollection, {
      currentPage,
    });

    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const attendances = [] as AttendanceBase[];

    for (const doc of snapshot.docs) {
      attendances.push(doc.data() as AttendanceBase);
    }

    return {
      ok: true,
      data: attendances,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get attendances.",
    };
  }
}

export async function getAttendanceById(
  getAttendanceByIdInput: GetAttendanceByIdInput
): Promise<GetAttendanceByIdOutput> {
  const { id } = getAttendanceByIdInput;

  const attendanceRef = adminDB.collection("attendance").doc(id);
  try {
    const attendanceSnapshot = await attendanceRef.get();

    if (!attendanceSnapshot.exists) {
      return {
        ok: false,
        error: `Cannot get attendance with id: ${id}`,
      };
    }

    return {
      ok: true,
      data: attendanceSnapshot.data() as AttendanceBase,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get attendance.",
    };
  }
}

export async function deleteAttendance(
  deleteAttendanceInput: DeleteAttendanceInput
): Promise<DeleteAttendanceOutput> {
  const { id } = deleteAttendanceInput;

  const attendanceRef = adminDB.collection("attendance").doc(id);
  try {
    await attendanceRef.delete();

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot delete attendance.",
    };
  }
}

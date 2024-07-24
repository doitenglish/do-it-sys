"use server";

import {
  getAttendances as FBgetAttendances,
  getAttendanceById as FBgetAttendanceById,
} from "@/lib/firebase/services/attendance-service";

export async function getAttendances(currentPage: number) {
  try {
    const result = await FBgetAttendances({
      currentPage,
    });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return {
      data: result.data,
      totalCounts: result.totalCounts,
      totalPages: result.totalPages,
    };
  } catch (error) {
    throw new Error();
  }
}

export async function getAttendanceById(id: string) {
  try {
    const result = await FBgetAttendanceById({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    console.error(error);
    throw new Error();
  }
}

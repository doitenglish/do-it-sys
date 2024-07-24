"use server";

import {
  getStudentById as FBgetStudentById,
  getStudents as FBgetStudents,
  getStudentsForSelect as FBgetStudentsForSelect,
  getAttendees as FBgetAttendees,
} from "../firebase/services/student-service";
import { handleErrorMsg } from "../utils";

export async function getStudents(
  query: string,
  level: string,
  division: string,
  currentPage: number
) {
  try {
    const result = await FBgetStudents({
      currentPage,
      level,
      query,
      division,
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
    throw new Error(handleErrorMsg(error, "Failed to fetch students"));
  }
}

export async function getStudentById(id: string) {
  try {
    const result = await FBgetStudentById({
      id,
    });
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  } catch (error) {
    throw new Error(
      handleErrorMsg(error, "Failed to fetch student with id: " + id)
    );
  }
}

export async function getStudentsForSelect(level: string, division: string) {
  try {
    const result = await FBgetStudentsForSelect({
      level,
      division,
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
    throw new Error(handleErrorMsg(error, "Failed to fetch students"));
  }
}

export async function getAttendees(students: string[]) {
  try {
    const result = await FBgetAttendees({
      ids: students,
    });
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  } catch (error) {
    throw new Error(handleErrorMsg(error, "Failed to fetch attendees"));
  }
}

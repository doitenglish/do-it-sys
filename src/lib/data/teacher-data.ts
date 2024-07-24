import {
  getTeachers as FBgetTeachers,
  getTeachersForSelect as FBgetTeachersForSelect,
  getTeacherById as FBgetTeacherById,
} from "../firebase/services/teacher-service";

export async function getTeachers(currentPage: number) {
  try {
    const result = await FBgetTeachers({
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
    throw new Error("Failed to fetch teachers");
  }
}

export async function getTeachersForSelect() {
  try {
    const result = await FBgetTeachersForSelect();

    if (!result.ok) {
      throw new Error();
    }

    return result.data;
  } catch (error) {
    throw new Error("Failed to fetch teachers");
  }
}

export async function getTeacherById(id: string) {
  try {
    const result = await FBgetTeacherById({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error("Failed to fetch teacher by id: " + id);
  }
}

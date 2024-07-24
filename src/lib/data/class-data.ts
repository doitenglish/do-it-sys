import {
  getClassesByTeacher as FBgetClassesByTeacher,
  getClasses as FBgetClasses,
  getClassById as FBgetClassById,
} from "@/lib/firebase/services/class-service";
import { hasAccess } from "../firebase/services/common/hasAccess";

export async function getClassesByTeacher(
  id: string,
  level: string,
  division: string,
  currentPage: number
) {
  try {
    const canAccess = await hasAccess(id, ["teacher", "admin"]);

    if (!canAccess.ok) {
      throw new Error("Access denied");
    }

    const result = await FBgetClassesByTeacher({
      id,
      level,
      division,
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
    throw new Error("Failed to fetch classes");
  }
}

export async function getClasses(
  query: string,
  level: string,
  division: string,
  currentPage: number
) {
  try {
    const result = await FBgetClasses({
      currentPage,
      query,
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
    throw new Error("Failed to fetch classes");
  }
}

export async function getClassById(id: string) {
  try {
    const result = await FBgetClassById({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error("Failed to fetch class with id: " + id);
  }
}

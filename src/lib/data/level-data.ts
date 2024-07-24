"use server";

import {
  getLevels as FBgetLevels,
  getLevelsForSelect as FBgetLevelsForSelect,
  getLevelById as FBgetLevelById,
} from "../firebase/services/level-service";
import { handleErrorMsg } from "../utils";

export async function getLevelsForSelect() {
  try {
    const result = await FBgetLevelsForSelect();

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error(handleErrorMsg(error, "Failed to fetch levels"));
  }
}

export async function getLevels(currentPage: number) {
  try {
    const result = await FBgetLevels({
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
    throw new Error(handleErrorMsg(error, "Failed to fetch levels"));
  }
}

export async function getLevelById({ id }: { id: string }) {
  try {
    const result = await FBgetLevelById({
      id,
    });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error(
      handleErrorMsg(error, "Failed to fetch level with id: " + id)
    );
  }
}

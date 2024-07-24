"use server";
import { getRankings as FBgetRankings } from "../firebase/services/ranking-service";
import { handleErrorMsg } from "../utils";

export async function getRankings(currentPage: number) {
  try {
    // Simulate network delay
    const result = await FBgetRankings({ currentPage });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return {
      data: result.data,
      totalCounts: result.totalCounts,
      totalPages: result.totalPages,
    };
  } catch (error) {
    throw new Error(handleErrorMsg(error, "Failed to fetch rankings"));
  }
}

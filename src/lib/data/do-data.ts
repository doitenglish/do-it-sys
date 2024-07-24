"use server";

import { unstable_noStore as noStore } from "next/cache";
import {
  getBalanceById as FBgetBalanceById,
  getRecordsById as FBgetRecordsById,
  getTotalBalanceAndStudentsCount as FBgetTotalCounts,
} from "@/lib/firebase/services/do-service";

export async function getBalanceById(id: string) {
  noStore();
  try {
    const result = await FBgetBalanceById({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error("Failed to fetch balance with id: " + id);
  }
}

export async function getRecordsById(id: string, currentPage: number) {
  noStore();
  try {
    const result = await FBgetRecordsById({
      id,
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
    throw new Error("Failed to fetch records with id: " + id);
  }
}

export async function getTotalBalanceAndStudentsCount() {
  noStore();
  try {
    const result = await FBgetTotalCounts();

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error("Failed to fetch total balance and students count");
  }
}

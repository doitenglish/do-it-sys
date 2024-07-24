"use server";

import { revalidatePath } from "next/cache";
import {
  updateRanking as FBupdateRanking,
  deleteRanking as FBdeleteRanking,
} from "../firebase/services/ranking-service";
import { RANKING_BASE_PATH } from "../constants";
import { redirect } from "next/navigation";

export async function updateRanking() {
  try {
    const result = await FBupdateRanking();

    if (!result.ok) {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Failed to update ranking:", error);
  }
  revalidatePath(RANKING_BASE_PATH);
  redirect(RANKING_BASE_PATH);
}

export async function deleteRanking(id: string) {
  try {
    const result = await FBdeleteRanking({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Failed to delete ranking with id:", id);
  }

  revalidatePath(RANKING_BASE_PATH);
  redirect(RANKING_BASE_PATH);
}

"use server";

import { deleteAttendance as FBdeleteAttendance } from "@/lib/firebase/services/attendance-service";
import { ATTENDANCE_BASE_PATH } from "../constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteAttendance(id: string) {
  try {
    const result = await FBdeleteAttendance({
      id,
    });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Delete Attendance.",
    };
  }

  const path = ATTENDANCE_BASE_PATH;

  revalidatePath(path);
  redirect(path);
}

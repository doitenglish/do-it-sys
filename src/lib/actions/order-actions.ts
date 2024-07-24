"use server";

import { revalidatePath } from "next/cache";
import {
  updateOrderStatus as FBupdateOrderStatus,
  cancelOrder as FBcancelOrder,
} from "../firebase/services/order-service";
import { ORDER_BASE_PATH } from "../constants";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";

export async function updateOrderStatus(
  id: string,
  type: number,
  status_from: number
) {
  try {
    const result = await FBupdateOrderStatus({ id, type, status_from });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Update Order Status.",
    };
  }

  revalidatePath(ORDER_BASE_PATH);
  redirect(ORDER_BASE_PATH);
}

export async function cancelOrder(id: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        message: "Unauthenticated.",
      };
    }
    if (currentUser.role !== "admin") {
      return {
        messaging: "Unauthorized.",
      };
    }

    const result = await FBcancelOrder({ id });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Cancel Order.",
    };
  }

  revalidatePath(ORDER_BASE_PATH);
  redirect(ORDER_BASE_PATH);
}

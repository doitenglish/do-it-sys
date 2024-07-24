"use server";

import { unstable_noStore as noStore } from "next/cache";
import {
  getOrders as FBgetOrders,
  getStudentOrders as FBgetStudentOrders,
  getOrderById as FBgetOrderById,
} from "../firebase/services/order-service";
import { handleErrorMsg } from "../utils";

export async function getOrders(status: number, currentPage: number) {
  noStore();
  try {
    const result = await FBgetOrders({ status, currentPage });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return {
      data: result.data,
      totalCounts: result.totalCounts,
      totalPages: result.totalPages,
    };
  } catch (error) {
    throw new Error(handleErrorMsg(error, "Failed to fetch orders"));
  }
}

export async function getStudentOrders(id: string, currentPage: number) {
  noStore();
  try {
    const result = await FBgetStudentOrders({ id, currentPage });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return {
      data: result.data,
      totalCounts: result.totalCounts,
      totalPages: result.totalPages,
    };
  } catch (error) {
    throw new Error(handleErrorMsg(error, "Failed to fetch student orders"));
  }
}

export async function getOrderById(id: string) {
  try {
    const result = await FBgetOrderById({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error(handleErrorMsg(error, "Failed to fetch order by id"));
  }
}

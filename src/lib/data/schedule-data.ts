"use server";

import { unstable_noStore as noStore } from "next/cache";
import {
  getSchedulesByClass as FBgetSchedulesByClass,
  getScheduleById as FBgetScheduleById,
  getScheduleByFilters as FBgetSchedulesByFilters,
  getTodo as FBgetTodo,
} from "@/lib/firebase/services/schedule-service";

//admin and teacher of class
export async function getSchedulesByClass(id: string, currentPage: number) {
  noStore();
  try {
    const result = await FBgetSchedulesByClass({ id, currentPage });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return {
      data: result.data,
      totalCounts: result.totalCounts,
      totalPages: result.totalPages,
    };
  } catch (error) {
    throw new Error();
  }
}

//Todo: refactor authorize logic
//admin and teacher of schedule
export async function getScheduleById(id: string) {
  try {
    const result = await FBgetScheduleById({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    throw new Error();
  }
}

export async function getSchedulesByFilters(
  currentPage: number,
  filters: {
    dayOfWeek: number;
    period: number;
  }
) {
  noStore();
  try {
    const result = await FBgetSchedulesByFilters({
      currentPage,
      dayOfWeek: filters.dayOfWeek,
      period: filters.period,
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
    throw new Error();
  }
}

export async function getTodo(id: string, currentPage: number) {
  noStore();
  try {
    const result = await FBgetTodo({ id, currentPage });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return {
      data: result.data,
      totalCounts: result.totalCounts,
      totalPages: result.totalPages,
    };
  } catch (error) {
    throw new Error();
  }
}

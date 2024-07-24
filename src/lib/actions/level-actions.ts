"use server";

import { z } from "zod";

import {
  createLevel as FBcreateLevel,
  updateLevel as FBupdateLevel,
  deleteLevel as FBdeleteLevel,
} from "../firebase/services/level-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormState } from "@/definitions/common-types";
import { LEVELS_BASE_PATH } from "../constants";
import { handleErrorMsg } from "../utils";

const LevelFields = {
  name: z.string().min(1),
  amount: z.coerce.number().int().lte(5),
};

const CreateLevel = z.object({
  ...LevelFields,
});

const UpdateLevel = z
  .object({
    ...LevelFields,
  })
  .omit({
    name: true,
  });

export async function createLevel(_: FormState, formData: FormData) {
  const validatedFields = CreateLevel.safeParse({
    name: formData.get("name"),
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to create level.",
    };
  }

  try {
    const result = await FBcreateLevel(validatedFields.data);

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to create level.",
    };
  }

  revalidatePath(LEVELS_BASE_PATH);
  redirect(LEVELS_BASE_PATH);
}

export async function updateLevel(
  id: string,
  _: FormState,
  formData: FormData
) {
  const validatedFields = UpdateLevel.safeParse({
    amount: formData.get("amount"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to edit level.",
    };
  }
  try {
    const result = await FBupdateLevel({ id, ...validatedFields.data });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to edit level.",
    };
  }

  revalidatePath(LEVELS_BASE_PATH);
  redirect(LEVELS_BASE_PATH);
}

export async function deleteLevel(id: string) {
  try {
    const result = await FBdeleteLevel({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }
  } catch (error) {
    return {
      message: handleErrorMsg(error, "Server Error: Failed to delete level."),
    };
  }

  revalidatePath(LEVELS_BASE_PATH);
  redirect(LEVELS_BASE_PATH);
}

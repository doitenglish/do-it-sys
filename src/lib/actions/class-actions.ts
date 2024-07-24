"use server";

import { z } from "zod";
import { FormState } from "@/definitions/common-types";
import {
  createClass as FBcreateClass,
  updateClass as FBupdateClass,
  deleteClass as FBdeleteClass,
} from "@/lib/firebase/services/class-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_CLASS_BASE_PATH, CLASS_BASE_PATH } from "../constants";

const FormSchema = z.object({
  name: z.string().min(3),
  textbook: z.string().min(3),
  teacher: z.string(),
  level: z.string(),
  division: z.string(),
});

const CreateClass = FormSchema;

export async function createClass(
  forAdmin: boolean,
  levelName: string,
  teacherName: string,
  _: FormState,
  formData: FormData
) {
  const division = formData.get("division") || "none";

  const validatedFields = CreateClass.safeParse({
    name: formData.get("name"),
    textbook: formData.get("textbook"),
    teacher: formData.get("teacher"),
    level: formData.get("level"),
    division,
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to create class.",
    };
  }
  try {
    const result = await FBcreateClass({
      ...validatedFields.data,
      levelName,
      teacherName,
    });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Create Level.",
    };
  }

  const path = forAdmin ? ADMIN_CLASS_BASE_PATH : CLASS_BASE_PATH;
  revalidatePath(path);
  redirect(path);
}

const UpdateClass = FormSchema.pick({
  teacher: true,
});

export async function updateClass(
  id: string,
  teacherName: string,
  _: FormState,
  formData: FormData
) {
  const validatedFields = UpdateClass.safeParse({
    teacher: formData.get("teacher"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to create class.",
    };
  }
  try {
    const result = await FBupdateClass({
      id,
      ...validatedFields.data,
      teacherName,
    });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Update Level.",
    };
  }

  const path = ADMIN_CLASS_BASE_PATH;
  revalidatePath(path);
  redirect(path);
}

export async function deleteClass(id: string) {
  try {
    const result = await FBdeleteClass({ id });

    if (!result.ok) {
      throw new Error();
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Delete Level.",
    };
  }

  revalidatePath(ADMIN_CLASS_BASE_PATH);
  redirect(ADMIN_CLASS_BASE_PATH);
}

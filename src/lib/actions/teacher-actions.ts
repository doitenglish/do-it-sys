"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createTeacher as FBcreateTeacher,
  deleteTeacher as FBdeleteTeacher,
  resetPassword as FBresetPassword,
  changePassword as FBchangePassword,
} from "../firebase/services/teacher-service";
import { FormState } from "@/definitions/common-types";
import { TEACHER_BASE_PATH } from "../constants";
import { getCurrentUser } from "../auth";

const path = TEACHER_BASE_PATH;

const FormSchema = z.object({
  id: z.string(),
  signInID: z.string().min(2),
  name: z.string().min(2),
});

const CreateTeacher = FormSchema.omit({
  id: true,
});

export async function createTeacher(_: FormState, formData: FormData) {
  const validatedFields = CreateTeacher.safeParse({
    signInID: formData.get("signInID"),
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to create teacher.",
    };
  }

  try {
    const result = await FBcreateTeacher(validatedFields.data);

    if (!result.ok) {
      return { message: result.error };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Create teacher.",
    };
  }

  revalidatePath(path);
  redirect(path);
}

export async function deleteTeacher(id: string) {
  try {
    const result = await FBdeleteTeacher({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Delete Teacher.",
    };
  }

  revalidatePath(path);
  redirect(path);
}

export async function resetPassword(id: string) {
  try {
    const result = await FBresetPassword({ id });

    if (!result.ok) {
      throw new Error(result.error);
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to Reset Password.",
    };
  }

  revalidatePath(path);
  redirect(path);
}

const ChangePassword = z.object({
  new: z.string().min(6),
  confirm: z.string().min(6),
});
export async function changePassword(
  forAdmin: boolean,
  _: FormState,
  formData: FormData
) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        message: "Unauthenticated. Failed to change password.",
      };
    }

    const validatedFields = ChangePassword.safeParse({
      new: formData.get("new"),
      confirm: formData.get("confirm"),
    });

    if (!validatedFields.success) {
      return {
        message: "Invalid Password. Try another one.",
      };
    }

    const { new: newPassword, confirm: confirmPassword } = validatedFields.data;

    if (newPassword !== confirmPassword) {
      return {
        message: "Passwords do not match. Try again.",
      };
    }

    const result = await FBchangePassword({
      id: currentUser.uid,
      newPassword,
    });

    if (!result.ok) {
      throw new Error(result.error);
    }

    return {
      ok: true,
      message: "Password successfully password.",
    };
  } catch (error) {
    return {
      ok: false,
      message: "Server Error: Failed to Change Password.",
    };
  }
}

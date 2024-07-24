"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth";
import { adminMutateBalanceById as FBadminMutateBalanceById } from "../firebase/services/do-service";
import { STUDENTS_BASE_PATH } from "../constants";
import { handleErrorMsg } from "../utils";
import { FormState } from "@/definitions/common-types";
import { z } from "zod";

const FormSchema = z.object({
  sign: z.coerce.number(),
});

export async function adminMutateBalanceById(
  id: string,
  weight: number,
  _: FormState,
  formData: FormData
) {
  try {
    if (weight <= 0) {
      throw new Error();
    }
    const validatedFields = FormSchema.safeParse({
      sign: Number(formData.get("sign")),
    });

    if (!validatedFields.success) {
      throw new Error("Invalid sign");
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("UnAuthroized.");
    }

    if (currentUser.role !== "admin") {
      throw new Error("UnAuthroized.");
    }
    const { sign } = validatedFields.data;
    if (sign !== 1 && sign !== -1) {
      throw new Error("Invalid sign weight.");
    }
    const amount = weight * sign;

    await FBadminMutateBalanceById({
      id,
      amount,
      createdBy: currentUser.name,
    });
    revalidatePath(STUDENTS_BASE_PATH + `/${id}/do`);
    return { ok: true, message: "Balance successfully updated." };
  } catch (error: any) {
    return {
      ok: false,
      message: handleErrorMsg(error, "Failed to update balance."),
    };
  }
}

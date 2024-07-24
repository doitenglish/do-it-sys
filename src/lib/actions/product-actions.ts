"use server";

import { z } from "zod";
import {
  createProduct as FBcreateProduct,
  getUploadId as FBgetUploadId,
  updateProduct as FBupdateProduct,
  deleteProduct as FBdeleteProduct,
} from "../firebase/services/product-service";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PRODUCT_BASE_PATH } from "../constants";

const FormSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(12),
  type: z.coerce.number(),
  price: z.coerce.number().positive(),
  tag: z.string(),
  product_url: z.string(),
  img_url: z.string(),
});

export async function createProduct(_: any, formData: FormData) {
  const product_url = formData.get("product_url") || "";
  const validatedFields = FormSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    type: Number(formData.get("type")),
    price: Number(formData.get("price")),
    tag: formData.get("tag"),
    product_url,
    img_url: formData.get("photo"),
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to create product.",
    };
  }

  try {
    const result = await FBcreateProduct(validatedFields.data);

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to create product.",
    };
  }

  revalidatePath(PRODUCT_BASE_PATH);
  redirect(PRODUCT_BASE_PATH);
}

export async function getUploadId() {
  const data = await FBgetUploadId();
  return data;
}

const UpdateProduct = FormSchema.pick({
  type: true,
  price: true,
  product_url: true,
});

export async function updateProduct(id: string, _: any, formData: FormData) {
  const product_url = formData.get("product_url") || "";
  const validatedFields = UpdateProduct.safeParse({
    type: Number(formData.get("type")),
    price: Number(formData.get("price")),
    product_url,
  });

  if (!validatedFields.success) {
    return {
      message: "Invalid Fields. Failed to update product.",
    };
  }

  try {
    const result = await FBupdateProduct({ id, ...validatedFields.data });

    if (!result.ok) {
      return {
        message: result.error,
      };
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to update product.",
    };
  }

  revalidatePath(PRODUCT_BASE_PATH);
  redirect(PRODUCT_BASE_PATH);
}

export async function deleteProduct(id: string) {
  try {
    const result = await FBdeleteProduct({ id });

    if (!result.ok) {
      throw new Error();
    }
  } catch (error) {
    return {
      message: "Server Error: Failed to delete product.",
    };
  }

  revalidatePath(PRODUCT_BASE_PATH);
  redirect(PRODUCT_BASE_PATH);
}

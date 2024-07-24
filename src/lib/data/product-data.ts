"use server";
import {
  getProducts as FBgetProducts,
  getProductById as FBgetProductById,
  getProductsBySearch as FBgetProductsBySearch,
} from "../firebase/services/product-service";
import { handleErrorMsg } from "../utils";
export async function getProducts(
  product_type: number = 1,
  order_type: number = 1,
  currentPage: number
) {
  try {
    const result = await FBgetProducts({
      currentPage,
      product_type,
      order_type,
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
    throw new Error(handleErrorMsg(error, "Failed to fetch products"));
  }
}

export async function getProductById(id: string) {
  try {
    const result = await FBgetProductById({ id });
    if (!result.ok) {
      throw new Error(result.error);
    }
    return result.data;
  } catch (error) {
    throw new Error(
      handleErrorMsg(error, "Failed to fetch product with id: " + id)
    );
  }
}

export async function getProductsBySearch(
  query: string,
  product_type: number = 1,
  currentPage: number
) {
  try {
    const result = await FBgetProductsBySearch({
      query,
      currentPage,
      product_type,
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
    throw new Error(handleErrorMsg(error, "Failed to fetch products"));
  }
}

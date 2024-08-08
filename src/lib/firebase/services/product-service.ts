import "server-only";

import {
  BackendProduct,
  CreateProductInput,
  CreateProductOutput,
  DeleteProductInput,
  DeleteProductOutput,
  FrontendProduct,
  GetProductByIdInput,
  GetProductByIdOutput,
  GetProductsBySearchInput,
  GetProductsBySearchOutput,
  GetProductsInput,
  GetProductsOutput,
  UpdateProductInput,
  UpdateProductOutput,
} from "@/definitions/product-types";
import { adminDB, adminStorage } from "../firebase-admin";
import { Query, Timestamp } from "firebase-admin/firestore";
import { getPaginateAndCount, searchByTag } from "../firestore-utils";
import { handleErrorMsg } from "@/lib/utils";

export async function getUploadId() {
  const productRef = adminDB.collection("products").doc();
  return productRef.id;
}

export async function createProduct(
  createProductInput: CreateProductInput
): Promise<CreateProductOutput> {
  const { id, type, name, price, img_url, tag, product_url } =
    createProductInput;

  try {
    const productRef = adminDB.collection("products").doc(id);

    //createTags
    const tags = name.split(" ");
    tags.push(name);
    tags.push(tag);

    const data: BackendProduct = {
      name,
      type,
      price,
      tags,
      product_url,
      img_url,
      totalOrders: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await productRef.set(data);

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot create product.",
    };
  }
}

export async function updateProduct(
  updateProductInput: UpdateProductInput
): Promise<UpdateProductOutput> {
  const { id, type, price, product_url } = updateProductInput;

  try {
    const productRef = adminDB.collection("products").doc(id);
    const productSnapshot = await productRef.get();

    if (!productSnapshot.exists) {
      return {
        ok: false,
        error: `firebase: Product with id: ${id} not exists.`,
      };
    }

    const product = productSnapshot.data() as BackendProduct;
    if (
      product.type === type &&
      product.price === price &&
      product.product_url === product_url
    ) {
      return {
        ok: true,
      };
    }

    await productRef.update({
      type,
      price,
      product_url,
      updatedAt: Timestamp.now(),
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot update product.",
    };
  }
}

export async function deleteProduct(
  deleteProductInput: DeleteProductInput
): Promise<DeleteProductOutput> {
  const { id } = deleteProductInput;

  try {
    const productRef = adminDB.collection("products").doc(id);
    const productSnapshot = await productRef.get();

    if (!productSnapshot.exists) {
      return {
        ok: false,
        error: `firebase: Product with id: ${id} not exists.`,
      };
    }

    const product = productSnapshot.data() as BackendProduct;
    const storageFileName = `products/${id}`;

    await productRef.delete();
    // Delete the associated storage file
    try {
      await adminStorage.file(storageFileName).delete();
    } catch (storageError: any) {
      // If the storage file does not exist, ignore the error
      if (storageError.code !== 404) {
        // Re-create the product document if storage file deletion fails
        await productRef.set(product);
        throw storageError;
      }
    }

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot delete product.",
    };
  }
}

const buildProductQuery = (input: GetProductsInput): Query => {
  const { product_type, order_type } = input;
  const orderType = order_type === 1 ? "totalOrders" : "price";
  //order_type == 3 -> 낮은 가격순 만 올림차순, 나머지는 내림차순
  const order = order_type === 3 ? "asc" : "desc";
  let productRef: Query = adminDB.collection("products");

  //if product_type is not All, filter by type
  if (product_type >= 0) {
    productRef = productRef.where("type", "==", product_type);
  }

  productRef = productRef.orderBy(orderType, order);

  return productRef;
};

export async function getProducts(
  getProductsInput: GetProductsInput
): Promise<GetProductsOutput> {
  try {
    const productRef = buildProductQuery(getProductsInput);

    const result = await getPaginateAndCount(productRef, {
      currentPage: getProductsInput.currentPage,
    });

    if (!result.ok) {
      throw new Error("Cannot get paginated data.");
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const products: FrontendProduct[] = snapshot.docs.map((doc) => {
      const data = doc.data() as BackendProduct;
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        price: data.price,
        product_url: data.product_url,
        img_url: data.img_url,
        totalOrders: data.totalOrders,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return {
      ok: true,
      data: products,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: handleErrorMsg(error, "firebase: Cannot get products."),
    };
  }
}

export async function getProductById(
  getProductByIdInput: GetProductByIdInput
): Promise<GetProductByIdOutput> {
  const { id } = getProductByIdInput;

  try {
    const productRef = adminDB.collection("products").doc(id);
    const productSnapshot = await productRef.get();

    if (!productSnapshot.exists) {
      return {
        ok: false,
        error: `firebase: Product with id: ${id} not exists.`,
      };
    }

    const data = productSnapshot.data() as BackendProduct;

    const product: FrontendProduct = {
      id: productSnapshot.id,
      name: data.name,
      type: data.type,
      price: data.price,
      product_url: data.product_url,
      img_url: data.img_url,
      totalOrders: data.totalOrders,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };

    return {
      ok: true,
      data: product,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot get product by id.",
    };
  }
}

export async function getProductsBySearch(
  getProductsBySearchInput: GetProductsBySearchInput
): Promise<GetProductsBySearchOutput> {
  const { currentPage, query, product_type } = getProductsBySearchInput;
  try {
    let productRef: Query = adminDB.collection("products");

    if (product_type >= 0) {
      productRef = productRef.where("type", "==", product_type);
    }

    productRef = searchByTag(productRef, { query });

    const result = await getPaginateAndCount(productRef, {
      currentPage,
    });

    if (!result.ok) {
      throw new Error("Cannot get paginated data.");
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const products: FrontendProduct[] = snapshot.docs.map((doc) => {
      const data = doc.data() as BackendProduct;
      return {
        id: doc.id,
        name: data.name,
        type: data.type,
        price: data.price,
        product_url: data.product_url,
        img_url: data.img_url,
        totalOrders: data.totalOrders,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return {
      ok: true,
      data: products,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: handleErrorMsg(error, "firebase: Cannot get products."),
    };
  }
}

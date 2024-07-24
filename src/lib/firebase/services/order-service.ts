import {
  BackendOrder,
  CancelOrderInput,
  CancelOrderOutput,
  FrontendOrder,
  GetOrderByIdInput,
  GetOrderByIdOutput,
  GetStudentOrdersInput,
  GetStudentOrdersOutput,
  UpdateOrderStatusInput,
  UpdateOrderStatusOutput,
} from "./../../../definitions/order-types";
import { GetOrdersInput, GetOrdersOutput } from "@/definitions/order-types";
import { adminDB } from "../firebase-admin";
import { getPaginateAndCount } from "../firestore-utils";
import { getNextOrderStatus, handleErrorMsg } from "@/lib/utils";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export async function getOrders(
  getOrdersInput: GetOrdersInput
): Promise<GetOrdersOutput> {
  const { status, currentPage } = getOrdersInput;

  try {
    const ordersRef = adminDB
      .collection("orders")
      .where("status", "==", status)
      .orderBy("createdAt", "asc");

    const result = await getPaginateAndCount(ordersRef, { currentPage });

    if (!result.ok) {
      throw new Error("Cannot get paginated data.");
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const orders: FrontendOrder[] = snapshot.docs.map((doc) => {
      const data = doc.data() as BackendOrder;
      return {
        id: doc.id,
        student_id: data.student_id,
        nameKo: data.nameKo,
        nameEn: data.nameEn,
        product_id: data.product_id,
        name: data.name,
        img_url: data.img_url,
        type: data.type,
        desc: data.desc,
        price: data.price,
        amount: data.amount,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return {
      ok: true,
      data: orders,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: handleErrorMsg(error, "firebase: Cannot get orders."),
    };
  }
}

export async function getStudentOrders(
  getStudentOrdersInput: GetStudentOrdersInput
): Promise<GetStudentOrdersOutput> {
  const { id: student_id, currentPage } = getStudentOrdersInput;
  try {
    const ordersRef = adminDB
      .collection("orders")
      .where("student_id", "==", student_id)
      .orderBy("createdAt", "desc");
    const result = await getPaginateAndCount(ordersRef, { currentPage });

    if (!result.ok) {
      throw new Error("Cannot get paginated data.");
    }

    const { data: snapshot, totalCounts, totalPages } = result;

    const orders: FrontendOrder[] = snapshot.docs.map((doc) => {
      const data = doc.data() as BackendOrder;
      return {
        id: doc.id,
        student_id: data.student_id,
        nameKo: data.nameKo,
        nameEn: data.nameEn,
        product_id: data.product_id,
        name: data.name,
        img_url: data.img_url,
        type: data.type,
        desc: data.desc,
        price: data.price,
        amount: data.amount,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return {
      ok: true,
      data: orders,
      totalCounts,
      totalPages,
    };
  } catch (error) {
    return {
      ok: false,
      error: handleErrorMsg(error, "firebase: Cannot get student orders."),
    };
  }
}

export async function getOrderById(
  getOrderByIdInput: GetOrderByIdInput
): Promise<GetOrderByIdOutput> {
  const { id } = getOrderByIdInput;

  const orderRef = adminDB.collection("orders").doc(id);
  try {
    const orderSnapshot = await orderRef.get();

    if (!orderSnapshot.exists) {
      throw new Error("Order not found.");
    }

    const data = orderSnapshot.data() as BackendOrder;

    const order: FrontendOrder = {
      id: orderSnapshot.id,
      student_id: data.student_id,
      nameKo: data.nameKo,
      nameEn: data.nameEn,
      product_id: data.product_id,
      name: data.name,
      img_url: data.img_url,
      type: data.type,
      desc: data.desc,
      price: data.price,
      amount: data.amount,
      status: data.status,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
    return {
      ok: true,
      data: order,
    };
  } catch (error) {
    return {
      ok: false,
      error: handleErrorMsg(error, "firebase: Cannot get order."),
    };
  }
}

export async function updateOrderStatus(
  updateOrderStatusInput: UpdateOrderStatusInput
): Promise<UpdateOrderStatusOutput> {
  const { id, status_from, type } = updateOrderStatusInput;

  const status_to = getNextOrderStatus(type, status_from);

  try {
    const orderRef = adminDB.collection("orders").doc(id);

    await orderRef.update({
      status: status_to,
      updatedAt: Timestamp.now(),
    });

    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: "firebase: Cannot update order status.",
    };
  }
}

export async function cancelOrder(
  cancelOrderInput: CancelOrderInput
): Promise<CancelOrderOutput> {
  const { id: product_id } = cancelOrderInput;
  try {
    const orderRef = adminDB.collection("orders").doc(product_id);
    const orderSnapshot = await orderRef.get();

    if (!orderSnapshot.exists) {
      throw new Error("Order not found.");
    }

    const {
      student_id,
      price,
      amount: order_amount,
      status,
    } = orderSnapshot.data() as BackendOrder;

    //status 업데이트 반영 안되었을때 block
    if (status === 5) {
      return {
        ok: true,
      };
    }

    const accountRef = adminDB.collection("do").doc(student_id);

    adminDB.runTransaction(async (transaction) => {
      transaction.update(orderRef, {
        status: 5,
      });

      transaction.update(accountRef, {
        balance: FieldValue.increment(price * order_amount),
      });

      transaction.set(accountRef.collection("record").doc(), {
        amount: price * order_amount,
        detail: "주문 취소",
        type: "do-store",
        createdBy: "admin",
        createdAt: Timestamp.now(),
      });
    });
    return {
      ok: true,
    };
  } catch (error) {
    return {
      ok: false,
      error: handleErrorMsg(error, "firebase: Cannot cancel order."),
    };
  }
}

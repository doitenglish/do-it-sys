import { FrontendOrder } from "@/definitions/order-types";
import { CancelButton } from "../buttons";
import { ORDER_BASE_PATH } from "@/lib/constants";
import {
  formatDate,
  formatOrderType,
  formatStatus,
  getNextOrderStatus,
} from "@/lib/utils";
import Link from "next/link";
import { cancelOrder, updateOrderStatus } from "@/lib/actions/order-actions";

function EditOrderForm({ id, order }: { id: string; order: FrontendOrder }) {
  return (
    <div className="grid grid-rows-7 grid-flow-col gap-4 mt-16">
      <CancelButton href={ORDER_BASE_PATH} />

      <section className="row-span-6 shadow-inner rounded-lg bg-gray-100 bg-opacity-70 flex flex-col w-full py-8 px-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-8 pb-4 border-b border-gray-600">
          Student Info
        </h3>
        <div className="flex w-full justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">NameKo</span>
          <span className="font-medium text-gray-700">{order.nameKo}</span>
        </div>
        <div className="flex w-full justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">NameEn</span>
          <span className="font-medium text-gray-700">{order.nameEn}</span>
        </div>
      </section>

      <section className="row-span-7 rounded-lg shadow-inner bg-gray-100 bg-opacity-70 flex flex-col w-full py-8 px-6  border border-gray-200">
        <h3 className="text-xl font-semibold mb-8 pb-4 border-b border-gray-600">
          Product Info
        </h3>
        <div className="flex w-full justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Type</span>
          <span className="font-bold text-gray-800 tracking-wide">
            {order.type === 1 && order.desc.length > 0 ? (
              <Link
                className="border-b-2 border-gray-800"
                href={order.desc}
                passHref
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatOrderType(order.type)}
              </Link>
            ) : (
              <p>{formatOrderType(order.type)}</p>
            )}
          </span>
        </div>
        <div className="flex w-full justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Name</span>
          <span className="font-medium text-gray-700">{order.name}</span>
        </div>
        <div className="flex w-full justify-between items-center mb-6 pb-6 border-b border-gray-600 border-dashed">
          <span className="text-lg font-semibold text-gray-800">Price</span>
          <span className="font-medium text-gray-700">{order.price}</span>
        </div>
        <div className="flex w-full justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Amount</span>
          <span className="font-medium text-gray-800">{order.amount}</span>
        </div>
        <div className="flex w-full justify-between items-center">
          <span className="text-lg font-semibold text-gray-800">
            Total Price
          </span>
          <span className="font-bold text-gray-800">
            {order.price * order.amount}
          </span>
        </div>
      </section>

      <section className="row-span-5 rounded-lg shadow-inner bg-gray-100 bg-opacity-70 flex flex-col w-full py-8 px-6  border border-gray-200">
        <h3 className="text-xl font-semibold mb-8 pb-4 border-b border-gray-600">
          Order Info
        </h3>
        <div className="flex w-full justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">Status</span>
          <span className="font-bold text-gray-800">
            {formatStatus(order.status)}
          </span>
        </div>
        <div className="flex w-full justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">CreatedAt</span>
          <span className=" text-gray-500">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex w-full justify-between items-center mb-6">
          <span className="text-lg font-semibold text-gray-800">UpdatedAt</span>
          <span className=" text-gray-500">{formatDate(order.updatedAt)}</span>
        </div>
      </section>

      <form
        action={async () => {
          "use server";
          await updateOrderStatus(id, order.type, order.status);
        }}
        className="row-span-1"
      >
        <button className="w-full py-3.5 bg-yellow-300 hover:bg-yellow-400 text-gray-800 text-sm ">
          {formatStatus(getNextOrderStatus(order.type, order.status))}
        </button>
      </form>
      <form
        action={async () => {
          "use server";

          await cancelOrder(id);
        }}
        className="row-span-1"
      >
        <button className="w-full py-3.5 bg-gray-800 hover:bg-gray-950 text-gray-100 text-sm ">
          주문 취소
        </button>
      </form>
    </div>
  );
}

export default EditOrderForm;

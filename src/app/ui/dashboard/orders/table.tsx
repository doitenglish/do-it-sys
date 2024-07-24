import Pagination from "../pagination";
import { EditButton } from "../buttons";
import { formatDate } from "@/lib/utils";
import { TableHeaderCell, TableCell } from "../table";
import TotalItems from "../total-items";
import { ORDER_BASE_PATH } from "@/lib/constants";
import { getOrders } from "@/lib/data/order-data";
import { FrontendOrder } from "@/definitions/order-types";

function OrderTableRow({ order }: { order: FrontendOrder }) {
  const type = order.type === 1 ? "ONLINE" : "OFFLINE";

  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10">
        {order.name}
      </TableCell>
      <TableCell className="font-medium">{type}</TableCell>
      <TableCell>{order.amount}</TableCell>
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700">
        {order.nameEn}
      </TableCell>
      <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
      <TableCell className="text-sm">{formatDate(order.updatedAt)}</TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <EditButton href={`${ORDER_BASE_PATH}/${order.id}/detail`} />
        </div>
      </TableCell>
    </tr>
  );
}

async function OrderTable({
  status,
  currentPage,
}: {
  status: number;
  currentPage: number;
}) {
  const { data, totalCounts, totalPages } = await getOrders(
    status,
    currentPage
  );

  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm">
              <tr>
                <TableHeaderCell className="pl-10 ">
                  Product Name
                </TableHeaderCell>
                <TableHeaderCell className="">Type</TableHeaderCell>
                <TableHeaderCell className="">Amount</TableHeaderCell>
                <TableHeaderCell className="">NameEn</TableHeaderCell>
                <TableHeaderCell className="">CreatedAt</TableHeaderCell>
                <TableHeaderCell className="">UpdatedAt</TableHeaderCell>
                <TableHeaderCell className=" pl-6 pr-4">
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((order: FrontendOrder) => (
                <OrderTableRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex justify-between items-center">
        <Pagination totalPages={totalPages} />
        <TotalItems label="products" counts={totalCounts} />
      </div>
    </>
  );
}

export default OrderTable;

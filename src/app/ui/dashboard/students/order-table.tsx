import Pagination from "../pagination";
import { formatDate, formatStatus } from "@/lib/utils";
import { TableHeaderCell, TableCell } from "../table";
import TotalItems from "../total-items";
import { getStudentOrders } from "@/lib/data/order-data";
import { FrontendOrder } from "@/definitions/order-types";
import clsx from "clsx";
import { CancelButton } from "../buttons";
import { STUDENTS_BASE_PATH } from "@/lib/constants";

function OrderTableRow({ order }: { order: FrontendOrder }) {
  const type = order.type === 1 ? "ONLINE" : "OFFLINE";

  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10">
        {order.name}
      </TableCell>
      <TableCell className="font-medium">{type}</TableCell>
      <TableCell>{order.amount}</TableCell>
      <TableCell
        className={clsx("font-normal text-green-500 tracking-wide ", {
          "text-red-500": order.status === 5,
        })}
      >
        {formatStatus(order.status)}
      </TableCell>
      <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
      <TableCell className="text-sm">{formatDate(order.updatedAt)}</TableCell>
    </tr>
  );
}

async function StudentOrderTable({
  id,
  currentPage,
}: {
  id: string;
  currentPage: number;
}) {
  const { data, totalCounts, totalPages } = await getStudentOrders(
    id,
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
                <TableHeaderCell className="">Status</TableHeaderCell>
                <TableHeaderCell className="">CreatedAt</TableHeaderCell>
                <TableHeaderCell className="">UpdatedAt</TableHeaderCell>
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
      <div className="flex w-full justify-between mt-8">
        <CancelButton href={`${STUDENTS_BASE_PATH}`} />
      </div>
    </>
  );
}

export default StudentOrderTable;

import Pagination from "../pagination";
import { TableCell, TableHeaderCell } from "../table";
import { formatDate } from "@/lib/utils";
import { getRecordsById } from "@/lib/data/do-data";
import { FrontendDoRecord } from "@/definitions/do-types";
import clsx from "clsx";

function DoRecordTableRow({ record }: { record: FrontendDoRecord }) {
  const amount = record.amount > 0 ? `+${record.amount}` : record.amount;
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="pl-10 text-sm text-neutral-500">
        {formatDate(record.createdAt)}
      </TableCell>
      <TableCell>{record.type}</TableCell>
      <TableCell className="text-lg font-normal text-neutral-800">
        {record.createdBy}
      </TableCell>

      <TableCell>{record.detail}</TableCell>
      <TableCell
        className={clsx("flex items-center gap-x-1", {
          "text-green-500": record.amount > 0,
          "text-red-500": record.amount < 0,
        })}
      >
        {amount}{" "}
      </TableCell>
    </tr>
  );
}

async function DoRecordTable({
  id,
  currentPage,
}: {
  id: string;
  currentPage: number;
}) {
  const { data, totalPages } = await getRecordsById(id, currentPage);

  return (
    <div className="flex flex-col">
      <div className="mt-7 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm ">
              <tr>
                <TableHeaderCell className="pl-10 ">Date</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>CreatedBy</TableHeaderCell>
                <TableHeaderCell>Detail</TableHeaderCell>
                <TableHeaderCell className="">Amount</TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((record: FrontendDoRecord) => (
                <DoRecordTableRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default DoRecordTable;

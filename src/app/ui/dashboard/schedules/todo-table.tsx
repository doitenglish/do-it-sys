import Pagination from "../pagination";
import { TableCell, TableHeaderCell } from "../table";
import { formatDate, formatTimeToString } from "@/lib/utils";
import { SCHEDULES_BASE_PATH } from "@/lib/constants";
import { getTodo } from "@/lib/data/schedule-data";
import { FrontendSchedule } from "@/definitions/schedule-types";
import TotalItems from "../total-items";

import Link from "next/link";

function TodoTableRow({ todo }: { todo: FrontendSchedule }) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-semibold tracking-wide text-neutral-700  pl-12">
        {todo._className}
      </TableCell>
      <TableCell className="font-medium ">{todo.levelName}</TableCell>
      <TableCell
        className={{
          "text-neutral-400 text-sm": todo.division == "none",
        }}
      >
        {todo.division}
      </TableCell>
      <TableCell>{formatTimeToString(todo.startTime)}</TableCell>
      <TableCell>{todo.attendees.length}</TableCell>
      <TableCell className="text-sm">{formatDate(todo.updatedAt)}</TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <Link
            href={`${SCHEDULES_BASE_PATH}/${todo.id}/on-air`}
            className="flex items-center py-2  px-7 text-sm text-neutral-100 bg-neutral-700 hover:bg-neutral-800"
          >
            Enter
          </Link>
        </div>
      </TableCell>
    </tr>
  );
}

async function TodoTable({
  id,
  currentPage,
}: {
  id: string;
  currentPage: number;
}) {
  const { data, totalCounts, totalPages } = await getTodo(id, currentPage);

  return (
    <>
      <div className="mt-8 flow-root ">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm ">
              <tr>
                <TableHeaderCell className="pl-10">ClassName</TableHeaderCell>
                <TableHeaderCell>Level</TableHeaderCell>
                <TableHeaderCell>Division</TableHeaderCell>
                <TableHeaderCell>StartTime</TableHeaderCell>
                <TableHeaderCell>Attendees</TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                <TableHeaderCell className="pl-6 pr-4">
                  <span className="sr-only">Enter</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((todo: FrontendSchedule) => (
                <TodoTableRow key={todo.id} todo={todo} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between ">
        <Pagination totalPages={totalPages} />
        <TotalItems label="schedules" counts={totalCounts} />
      </div>
    </>
  );
}

export default TodoTable;

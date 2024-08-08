import Pagination from "../pagination";
import { TableCell, TableHeaderCell } from "../table";
import { EditButton } from "../buttons";
import { formatDate } from "@/lib/utils";
import { getClasses } from "@/lib/data/class-data";
import { FrontendClass } from "@/definitions/class-types";
import TotalItems from "../total-items";
import { ADMIN_CLASS_BASE_PATH } from "@/lib/constants";

function ClassTableRow({ _class }: { _class: FrontendClass }) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-semibold text-neutral-700 pl-10 pr-3">
        {_class.name}
      </TableCell>
      <TableCell className=" tracking-wide text-neutral-700">
        {_class.textbook}
      </TableCell>
      <TableCell>{_class.teacherName}</TableCell>
      <TableCell href={`${ADMIN_CLASS_BASE_PATH}/${_class.id}/schedules`}>
        {_class.totalSchedules}
      </TableCell>
      <TableCell className="text-sm">{formatDate(_class.updatedAt)}</TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <EditButton href={`${ADMIN_CLASS_BASE_PATH}/${_class.id}/edit`} />
        </div>
      </TableCell>
    </tr>
  );
}

async function AdminClassTable({
  query,
  currentlevel,
  currentPage,
  currentDivision,
}: {
  query: string;
  currentPage: number;
  currentlevel: string;
  currentDivision: string;
}) {
  const { data, totalCounts, totalPages } = await getClasses(
    query,
    currentlevel,
    currentDivision,
    currentPage
  );

  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm ">
              <tr>
                <TableHeaderCell className="pl-10 pr-3 w-1/6">
                  Name
                </TableHeaderCell>
                <TableHeaderCell>TextBook</TableHeaderCell>
                <TableHeaderCell>Teacher</TableHeaderCell>
                <TableHeaderCell>Schedules</TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                <TableHeaderCell className="pl-6 pr-4">
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((_class: FrontendClass) => (
                <ClassTableRow key={_class.id} _class={_class} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between ">
        {/* handle error -> totalPages! => totalPages */}
        <Pagination totalPages={totalPages} />
        <TotalItems label="classes" counts={totalCounts} />
      </div>
    </>
  );
}

export default AdminClassTable;

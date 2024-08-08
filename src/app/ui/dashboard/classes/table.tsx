import Pagination from "../pagination";
import { TableCell, TableHeaderCell } from "../table";
import { EditButton } from "../buttons";
import { formatDate } from "@/lib/utils";
import { getClassesByTeacher } from "@/lib/data/class-data";
import { FrontendClass } from "@/definitions/class-types";
import { ADMIN_CLASS_BASE_PATH, CLASS_BASE_PATH } from "@/lib/constants";
import TotalItems from "../total-items";

function ClassTableRow({
  forAdmin,
  _class,
}: {
  forAdmin: boolean;
  _class: FrontendClass;
}) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-semibold  text-neutral-700 pl-10">
        {_class.name}
      </TableCell>
      <TableCell className=" tracking-wide text-neutral-700">
        {_class.textbook}
      </TableCell>
      <TableCell className="font-medium">{_class.levelName}</TableCell>
      <TableCell
        className={{
          "text-neutral-400 text-sm": _class.division == "none",
        }}
      >
        {_class.division}
      </TableCell>
      <TableCell
        href={
          (forAdmin ? ADMIN_CLASS_BASE_PATH : CLASS_BASE_PATH) +
          `/${_class.id}/schedules`
        }
      >
        {_class.totalSchedules}
      </TableCell>
      <TableCell className="text-sm">{formatDate(_class.updatedAt)}</TableCell>
      {forAdmin && (
        <TableCell className="pl-6 pr-4">
          <div className="flex justify-end gap-3">
            <EditButton href={ADMIN_CLASS_BASE_PATH + `/${_class.id}/edit`} />
          </div>
        </TableCell>
      )}
    </tr>
  );
}

async function ClassTable({
  forAdmin = false,
  id,
  currentlevel,
  currentPage,
  currentDivision,
}: {
  forAdmin?: boolean;
  id: string;
  currentPage: number;
  currentlevel: string;
  currentDivision: string;
}) {
  const { data, totalPages, totalCounts } = await getClassesByTeacher(
    id,
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
                <TableHeaderCell className="pl-10 w-1/6">Name</TableHeaderCell>
                <TableHeaderCell>TextBook</TableHeaderCell>
                <TableHeaderCell>Level</TableHeaderCell>
                <TableHeaderCell>Division</TableHeaderCell>
                <TableHeaderCell>Schedules</TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                {forAdmin && (
                  <TableHeaderCell className="pl-6 pr-4">
                    <span className="sr-only">Edit</span>
                  </TableHeaderCell>
                )}
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((_class: FrontendClass) => (
                <ClassTableRow
                  forAdmin={forAdmin}
                  key={_class.id}
                  _class={_class}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between">
        <Pagination totalPages={totalPages} />
        <TotalItems label="classes" counts={totalCounts} />
      </div>
    </>
  );
}

export default ClassTable;

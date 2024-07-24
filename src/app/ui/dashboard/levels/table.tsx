import { getLevels } from "@/lib/data/level-data";
import Pagination from "../pagination";
import { EditButton } from "../buttons";
import { formatDate } from "@/lib/utils";
import { TableHeaderCell, TableCell } from "../table";
import { FrontendLevel } from "@/definitions/level-types";
import TotalItems from "../total-items";
import { LEVELS_BASE_PATH } from "@/lib/constants";

function LevelTableRow({ level }: { level: FrontendLevel }) {
  const children = level.useDivision ? level.divisions?.join(" / ") : "none";

  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10">
        {level.name}
      </TableCell>
      <TableCell
        className={{
          "text-neutral-400 text-sm": children == "none",
        }}
      >
        {children}
      </TableCell>

      <TableCell href={`${LEVELS_BASE_PATH}/${level.id}/students`}>
        {level.totalStudents}
      </TableCell>
      <TableCell>{level.totalClasses}</TableCell>
      <TableCell className="text-sm">{formatDate(level.updatedAt)}</TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <EditButton href={`${LEVELS_BASE_PATH}/${level.id}/edit`} />
        </div>
      </TableCell>
    </tr>
  );
}

async function LevelTable({ currentPage }: { currentPage: number }) {
  const { data, totalCounts, totalPages } = await getLevels(currentPage);

  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm">
              <tr>
                <TableHeaderCell className="pl-10">Name</TableHeaderCell>
                <TableHeaderCell className="w-1/6">Children</TableHeaderCell>
                <TableHeaderCell>Students</TableHeaderCell>
                <TableHeaderCell>Classes</TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                <TableHeaderCell className="pl-6 pr-4">
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((level: FrontendLevel) => (
                <LevelTableRow key={level.id} level={level} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex justify-between items-center">
        <Pagination totalPages={totalPages} />
        <TotalItems label="levels" counts={totalCounts} />
      </div>
    </>
  );
}

export default LevelTable;

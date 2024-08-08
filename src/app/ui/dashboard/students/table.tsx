import { getStudents } from "@/lib/data/student-data";
import Pagination from "../pagination";
import { TableCell, TableHeaderCell } from "../table";
import { EditButton } from "../buttons";
import { formatDate } from "@/lib/utils";
import { FrontendStudent } from "@/definitions/student-types";
import TotalItems from "../total-items";
import Link from "next/link";

function StudentTableRow({ student }: { student: FrontendStudent }) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="text-lg font-normal tracking-wide text-neutral-700 pl-10">
        {student.nameKo}
      </TableCell>
      <TableCell className="font-normal tracking-wide text-neutral-700">
        {student.nameEn}
      </TableCell>
      <TableCell className="font-medium">{student.levelName}</TableCell>
      <TableCell
        className={{
          "text-neutral-400 text-sm": student.division == "none",
        }}
      >
        {student.division}
      </TableCell>
      <TableCell>{student.birth}</TableCell>
      <TableCell className="text-sm">{formatDate(student.updatedAt)}</TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end items-center gap-x-5">
          <Link
            href={`/dashboard/admin/students/${student.id}/orders`}
            className="flex items-center py-2 px-5 text-sm border border-gray-700 hover:font-semibold hover:border-none hover:ring ring-gray-700 text-neutral-700"
          >
            Order
          </Link>
          <Link
            href={`/dashboard/admin/students/${student.id}/do`}
            className="flex items-center py-2 px-7 text-sm border border-gray-700 hover:font-semibold hover:border-none hover:ring ring-gray-700 text-neutral-700"
          >
            Do
          </Link>
          <EditButton href={`/dashboard/admin/students/${student.id}/edit`} />
        </div>
      </TableCell>
    </tr>
  );
}

async function StudentTable({
  query,
  currentlevel,
  currentPage,
  currentDivision,
}: {
  query: string;
  currentlevel: string;
  currentDivision: string;
  currentPage: number;
}) {
  const { data, totalPages, totalCounts } = await getStudents(
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
                <TableHeaderCell className="pl-10 ">이 름</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Level</TableHeaderCell>
                <TableHeaderCell>Division</TableHeaderCell>
                <TableHeaderCell>Birth</TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                <TableHeaderCell className="pl-6 pr-4">
                  <span className="sr-only">Order</span>
                  <span className="sr-only">Do</span>
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((student: FrontendStudent) => (
                <StudentTableRow key={student.id} student={student} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between">
        {/* handle error -> totalPages! => totalPages */}
        <Pagination totalPages={totalPages} />
        <TotalItems label="students" counts={totalCounts} />
      </div>
    </>
  );
}

export default StudentTable;

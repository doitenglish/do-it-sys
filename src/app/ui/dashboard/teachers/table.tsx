import Pagination from "../pagination";
import { getTeachers } from "@/lib/data/teacher-data";
import { TableCell, TableHeaderCell } from "../table";
import { EditButton } from "../buttons";
import { formatDate } from "@/lib/utils";
import { FrontendTeacher } from "@/definitions/teacher-types";
import { TEACHER_BASE_PATH } from "@/lib/constants";
import TotalItems from "../total-items";

function TeacherTableRow({ teacher }: { teacher: FrontendTeacher }) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10">
        {teacher.name}
      </TableCell>
      <TableCell href={TEACHER_BASE_PATH + `/${teacher.id}/classes`}>
        {teacher.totalClasses}
      </TableCell>
      <TableCell className="text-sm">{formatDate(teacher.updatedAt)}</TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end gap-3">
          <EditButton href={TEACHER_BASE_PATH + `/${teacher.id}/edit`} />
        </div>
      </TableCell>
    </tr>
  );
}

async function TeacherTable({ currentPage }: { currentPage: number }) {
  const { data, totalPages, totalCounts } = await getTeachers(currentPage);

  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm ">
              <tr>
                <TableHeaderCell className=" pl-10 w-1/6">Name</TableHeaderCell>
                <TableHeaderCell>Classes</TableHeaderCell>
                <TableHeaderCell>UpdatedAt</TableHeaderCell>
                <TableHeaderCell className="pl-6 pr-4">
                  <span className="sr-only">Edit</span>
                </TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data?.map((teacher: FrontendTeacher) => (
                <TeacherTableRow key={teacher.id} teacher={teacher} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 flex items-center justify-between">
        <Pagination totalPages={totalPages} />
        <TotalItems label="teachers" counts={totalCounts} />
      </div>
    </>
  );
}

export default TeacherTable;

"use client";

import { StudentForSelect } from "@/definitions/student-types";
import { TableCell, TableHeaderCell } from "../table";
import useSelected from "@/hooks/useSelected";
import { useEffect } from "react";
import { addAttendees } from "@/lib/actions/schedule-actions";
import clsx from "clsx";

function TableRow({
  student,
  toggleSelected,
}: {
  student: StudentForSelect;
  toggleSelected: (id: string) => void;
}) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10 pr-3">
        {student.nameKo}
      </TableCell>
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 ">
        {student.nameEn}
      </TableCell>

      <TableCell
        className={clsx("text-gray-500", {
          "text-neutral-400 text-sm": student.division == "none",
        })}
      >
        {student.division}
      </TableCell>
      <TableCell className="pl-6 pr-8">
        <div className="flex justify-end">
          <button
            className="border border-gray-400  p-1 focus:outline-none"
            onClick={() => {
              toggleSelected(student.id);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </TableCell>
    </tr>
  );
}

function SelectStudentTable({
  id,
  _class,
  students,
}: {
  students: StudentForSelect[];
  id: string;
  _class: string;
}) {
  const { selectedIds, toggleSelected, clearSelected } = useSelected();

  useEffect(() => {
    if (selectedIds.length > 0) {
      addAttendees(false, _class, id, selectedIds[0]);
      clearSelected();
    }
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  return (
    <div className="mt-3 flow-root flex-1">
      <div className="relative inline-block w-full align-middle overflow-y-scroll h-96">
        <table className=" table-fixed min-w-full ">
          <thead className="text-left text-sm sticky top-0 bg-white">
            <tr>
              <TableHeaderCell className="pl-10 pr-3 min-w-10">
                이 름
              </TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Division</TableHeaderCell>
              <TableHeaderCell className="pl-6 pr-4">
                <span className="sr-only">Check</span>
              </TableHeaderCell>
            </tr>
          </thead>
          <tbody className="bg-white">
            {students.map((std: StudentForSelect) => (
              <TableRow
                key={std.id}
                student={std}
                toggleSelected={toggleSelected}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SelectStudentTable;

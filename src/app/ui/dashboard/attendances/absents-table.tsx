"use client";

import { Attendee } from "@/definitions/student-types";
import { TableHeaderCell, TableCell } from "../table";
import { CancelButton } from "../buttons";
import { deleteAttendance } from "@/lib/actions/attendance-actions";
import { ATTENDANCE_BASE_PATH } from "@/lib/constants";
import { useFormState } from "react-dom";

function AbsentTableRow({ absent }: { absent: Attendee }) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal  tracking-wide text-neutral-700 pl-10">
        {absent.nameKo}
      </TableCell>
      <TableCell>{absent.nameEn}</TableCell>
      <TableCell>{absent.phone}</TableCell>
    </tr>
  );
}

function AbsentTable({ absents, date }: { absents: Attendee[]; date: string }) {
  const deleteAttendanceWithBind = deleteAttendance.bind(null, date);

  const onSubmit = (e: any) => {
    const ok = confirm("Are you sure you want to delete?");
    if (!ok) {
      e.preventDefault();
    }
  };

  const [state, dispatch] = useFormState(deleteAttendanceWithBind, {
    message: "Deleting...",
  });
  return (
    <>
      <div className="mt-8 flow-root">
        <div className=" inline-block w-full align-middle overflow-scroll max-h-[60vh]">
          <table className=" table-auto min-w-full">
            <thead className="text-left text-sm sticky top-0 bg-white">
              <tr>
                <TableHeaderCell className="pl-10 pr-3 w-1/5">
                  이 름
                </TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
              </tr>
            </thead>
            <tbody className="bg-white">
              {absents.map((atd: Attendee) => (
                <AbsentTableRow key={atd.id} absent={atd} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex w-full justify-between mt-8">
          <CancelButton href={`${ATTENDANCE_BASE_PATH}`} />
          <form action={dispatch} onSubmit={onSubmit}>
            <button className="flex items-center justify-center py-4  px-7 text-sm text-neutral-100 bg-neutral-800 hover:bg-neutral-950 focus:outline-none">
              Delete
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AbsentTable;

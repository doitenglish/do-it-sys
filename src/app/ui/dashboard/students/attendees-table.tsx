"use client";

import useSelected from "@/hooks/useSelected";
import { TableCell, TableHeaderCell } from "../table";
import { Attendee } from "@/definitions/student-types";
import { removeAttendees } from "@/lib/actions/schedule-actions";
import { useEffect } from "react";
import TotalItems from "../total-items";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function AttendeeEditTableRow({
  attendee,
  toggleSelected,
}: {
  attendee: Attendee;
  toggleSelected: (id: string) => void;
}) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10 pr-3">
        {attendee.nameKo}
      </TableCell>
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 ">
        {attendee.nameEn}
      </TableCell>
      <TableCell className="pl-6 pr-8">
        <div className="flex justify-end ">
          <button
            className="border border-gray-400  p-1 focus:outline-none"
            onClick={() => {
              toggleSelected(attendee.id);
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
        </div>
      </TableCell>
    </tr>
  );
}

function AttendeeTableRow({
  attendee,
  toggleSelected,
  isSelected,
  clearSelected,
}: {
  attendee: Attendee;
  toggleSelected: (id: string) => void;
  isSelected: boolean;
  clearSelected: () => void;
}) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10 pr-3">
        {attendee.nameKo}
      </TableCell>
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 ">
        {attendee.nameEn}
      </TableCell>
      <TableCell>{attendee.phone}</TableCell>
      <TableCell className="pl-6 pr-8">
        <div className="flex justify-end ">
          <div className="flex justify-end pr-8">
            <button
              className={clsx("border border-gray-300 p-1 focus:outline-none", {
                " border-green-400 border-1 bg-green-400 ": isSelected,
              })}
              onClick={() => {
                if (isSelected) {
                  return;
                }
                clearSelected();
                toggleSelected(attendee.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={clsx("w-3 h-3 text-gray-500", {
                  "text-white": isSelected,
                })}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </TableCell>
    </tr>
  );
}

function AttendeeTable({
  id,
  _class,
  attendees,
  onAir = false,
}: {
  id: string;
  _class: string;
  attendees: Attendee[];
  onAir?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const { selectedIds, toggleSelected, clearSelected, isSelected } =
    useSelected();

  useEffect(() => {
    if (onAir) {
      const params = new URLSearchParams(searchParams);
      if (selectedIds.length == 1) {
        params.set("atd", selectedIds[0]);
      }
      replace(`${pathname}?${params.toString()}`);
    } else {
      if (selectedIds.length > 0) {
        removeAttendees(false, _class, id, selectedIds[0]);
        clearSelected();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  return (
    <div className="mt-6 flow-root flex-1">
      <div
        className={clsx(
          "relative inline-block w-full align-middle overflow-y-scroll ",
          {
            "h-96": !onAir,
            " h-full max-h-[60vh]": onAir,
          }
        )}
      >
        <table className=" table-fixed min-w-full  ">
          <thead className="text-left text-sm sticky top-0 bg-white ">
            <tr>
              <TableHeaderCell className="pl-10 pr-3 ">이 름</TableHeaderCell>
              <TableHeaderCell className=" ">Name</TableHeaderCell>
              {onAir && (
                <TableHeaderCell className="w-1/5">Phone</TableHeaderCell>
              )}
              <TableHeaderCell className="pl-6 pr-4 text-end">
                <span className="sr-only">Check</span>
                {!onAir && <TotalItems label="" counts={attendees.length} />}
              </TableHeaderCell>
            </tr>
          </thead>
          <tbody className="bg-white">
            {attendees.map((atd: Attendee) =>
              onAir ? (
                <AttendeeTableRow
                  key={atd.id}
                  attendee={atd}
                  toggleSelected={toggleSelected}
                  isSelected={isSelected(atd.id)}
                  clearSelected={clearSelected}
                />
              ) : (
                <AttendeeEditTableRow
                  key={atd.id}
                  attendee={atd}
                  toggleSelected={toggleSelected}
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendeeTable;

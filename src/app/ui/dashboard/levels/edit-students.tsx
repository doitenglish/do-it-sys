"use client";

import { FormRow, FormStateBox } from "../form";
import { useCallback, useEffect, useState } from "react";
import { TableCell, TableHeaderCell } from "../table";
import Pagination from "../pagination";

import { FrontendLevel } from "@/definitions/level-types";
import { StudentForSelect } from "@/definitions/student-types";
import clsx from "clsx";
import { CancelButton } from "../buttons";
import { LEVELS_BASE_PATH } from "@/lib/constants";
import TotalItems from "../total-items";
import { useFormState } from "react-dom";
import { updateStudentsLevel } from "@/lib/actions/student-actions";
import useSelected from "@/hooks/useSelected";
import { filterStudentsByPage } from "@/lib/utils";

function LevelTableRow({
  student,
  toggleSelected,
  isSelected,
}: {
  student: StudentForSelect;
  toggleSelected: (id: string) => void;
  isSelected: boolean;
}) {
  return (
    <tr className="w-full text-neutral-800 odd:bg-neutral-100 ">
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 pl-10 pr-3">
        {student.nameKo}
      </TableCell>
      <TableCell className="font-normal text-lg tracking-wide text-neutral-700 ">
        {student.nameEn}
      </TableCell>
      <TableCell>{student.birth}</TableCell>
      <TableCell
        className={{
          "text-neutral-400 text-sm": student.division == "none",
        }}
      >
        {student.division}
      </TableCell>
      <TableCell className="pl-6 pr-4">
        <div className="flex justify-end pr-8">
          <button
            className={clsx("border border-gray-300 p-1 focus:outline-none", {
              " border-green-400 border-1 bg-green-400 ": isSelected,
            })}
            onClick={() => toggleSelected(student.id)}
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
      </TableCell>
    </tr>
  );
}

function EditLevelStudents({
  id,
  levels,
  students,
  currentPage,
}: {
  id: string;
  levels: FrontendLevel[];
  students: StudentForSelect[];
  currentPage: number;
}) {
  const {
    selectedIds,
    toggleSelected,
    clearSelected,
    appendAll,
    isSelected,
    selectedCount,
  } = useSelected();
  const filteredStudents = useCallback(
    () => filterStudentsByPage(students, currentPage),
    [students, currentPage]
  );

  const [level, setLevel] = useState<FrontendLevel>(levels[0]);

  const [divisions, setDivisions] = useState(level.divisions);
  const [division, setDivision] = useState("none");

  useEffect(() => {
    setDivisions(level.useDivision ? level.divisions : ["none"]);
  }, [level]);

  const updateStudentsLevelWithBind = updateStudentsLevel.bind(
    null,
    selectedIds,
    levels.find((lvl) => lvl.id == id)?.id || levels[0].id,
    level.name
  );

  const initialState = { ok: false, message: "" };
  const [state, dispatch] = useFormState(
    updateStudentsLevelWithBind,
    initialState
  );

  useEffect(() => {
    if (state.ok) {
      clearSelected();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="flex gap-x-6">
      <div className=" w-2/3">
        <table className=" table-fixed min-w-full relative">
          <thead className="text-left text-sm sticky">
            <tr>
              <TableHeaderCell className="pl-10 pr-3 w-1/5">
                이 름
              </TableHeaderCell>
              <TableHeaderCell className=" w-1/5">Name</TableHeaderCell>
              <TableHeaderCell className="w-1/5">Birth</TableHeaderCell>
              <TableHeaderCell>Division</TableHeaderCell>
              <TableHeaderCell className="pl-6 pr-4">
                <span className="sr-only">Check</span>
                <div className="flex justify-end pr-8">
                  <button
                    className={clsx(
                      "border border-gray-300 p-1 focus:outline-none",
                      {
                        " border-green-400 border-1 bg-green-400 ":
                          students.length > 0 &&
                          selectedCount() == students.length,
                      }
                    )}
                    onClick={() => {
                      if (students.length == selectedCount()) {
                        clearSelected();
                      } else {
                        appendAll(students);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={clsx("w-3 h-3 text-gray-500", {
                        "text-white":
                          students.length > 0 &&
                          selectedCount() == students.length,
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
              </TableHeaderCell>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredStudents().map((std: StudentForSelect) => (
              <LevelTableRow
                key={std.id}
                student={std}
                toggleSelected={toggleSelected}
                isSelected={isSelected(std.id)}
              />
            ))}
          </tbody>
        </table>
        <div className="mt-12 flex justify-between items-center">
          <Pagination totalPages={Math.ceil(students.length / 7)} />
          <TotalItems label="selected" counts={selectedIds.length} />
        </div>
      </div>
      <div className="flex flex-col w-1/3 mt-20">
        <form
          action={dispatch}
          className="bg-neutral-50 border  border-gray-200 py-12 px-8"
        >
          <FormRow label="Move From">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md ">
                  {levels.find((lvl) => lvl.id == id)?.name}
                </div>
              </div>
              <div className="relative flex-1">
                <div className="block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md ">
                  -
                </div>
              </div>
            </div>
          </FormRow>
          <FormRow label="Move To">
            <div className="flex gap-3">
              <div className="relative flex-1 mb-8">
                <select
                  id="levelTo"
                  name="levelTo"
                  className="  cursor-pointer block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md "
                  onChange={(e) =>
                    setLevel(
                      levels.find((lvl) => lvl.id == e.target.value) ||
                        levels[0]
                    )
                  }
                >
                  {levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative flex-1 mb-8">
                <select
                  id="division"
                  name="division"
                  className="  cursor-pointer block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md "
                  disabled={divisions?.includes("none")}
                  onChange={(e) => setDivision(e.target.value)}
                  value={division}
                >
                  {divisions?.map((dvs) => (
                    <option key={dvs} value={dvs}>
                      {dvs}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FormRow>
          <div className="flex w-full gap-x-4">
            <CancelButton href={LEVELS_BASE_PATH} />
            <button
              type="submit"
              className="flex-1 text-sm text-neutral-100 bg-neutral-800 hover:bg-neutral-950 focus:outline-none disabled:bg-neutral-200 disabled:text-neutral-400"
              disabled={selectedCount() == 0}
            >
              Save
            </button>
          </div>
        </form>
        <div className="w-full flex items-center h-12 mt-2 ml-1">
          {state?.message && <FormStateBox state={state} />}
        </div>
      </div>
    </div>
  );
}

export default EditLevelStudents;

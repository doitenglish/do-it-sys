"use client";

import { useFormState } from "react-dom";
import { Button, CancelButton } from "../buttons";
import { useEffect, useState } from "react";
import { ErrorBox, FormRow, Slash, UnderArr } from "../form";

import { FrontendLevel } from "@/definitions/level-types";
import { FrontendTeacher } from "@/definitions/teacher-types";
import { createClass } from "@/lib/actions/class-actions";
import { ADMIN_CLASS_BASE_PATH, CLASS_BASE_PATH } from "@/lib/constants";

function CreateClassForm({
  forAdmin = false,
  levels,
  teachers,
}: {
  forAdmin?: boolean;
  levels: FrontendLevel[];
  teachers: FrontendTeacher[];
}) {
  const [teacher, setTeacher] = useState(teachers[0]);
  console.log(teachers);

  const [level, setLevel] = useState(levels[0]);
  const [divisions, setDivisions] = useState(
    levels[0].useDivision ? levels[0].divisions : ["none"]
  );
  const [division, setDivision] = useState("");

  useEffect(() => {
    setDivisions(level.useDivision ? level.divisions : ["none"]);
  }, [level]);

  const createClassWithBind = createClass.bind(
    null,
    forAdmin,
    level.name,
    teacher.name
  );
  const initialState = { message: "" };
  const [state, dispatch] = useFormState(createClassWithBind, initialState);

  const cancelHref = forAdmin ? ADMIN_CLASS_BASE_PATH : CLASS_BASE_PATH;

  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && TextBook*/}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" required>
            <input
              id="name"
              name="name"
              type="text"
              className="input-field  "
              placeholder="Enter classname"
            />
          </FormRow>
          {/*TextBook*/}
          <FormRow label="TextBook" required>
            <input
              id="textbook"
              name="textbook"
              type="text"
              className="input-field  "
              placeholder="Enter textbook"
            />
          </FormRow>
        </div>

        {/*Teacher && Level*/}
        <div className="flex gap-x-20">
          {/*Teacher*/}
          <FormRow label="Teacher" required>
            <div className="relative flex-1">
              <select
                id="teacher"
                name="teacher"
                className="input-field appearance-none cursor-pointer pl-8"
                onChange={(e) => {
                  setTeacher(
                    teachers.find((teacher) => teacher.id == e.target.value)!
                  );
                }}
                value={teacher.id}
              >
                <option value="" disabled>
                  Select Teacher
                </option>
                {teachers?.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <Slash />
              <UnderArr />
            </div>
          </FormRow>
          {/*Level*/}
          <FormRow label="Level" required>
            <div className="flex gap-x-8">
              <div className="relative flex-1">
                <select
                  id="level"
                  name="level"
                  className="input-field appearance-none cursor-pointer pl-8"
                  onChange={(e) => {
                    setLevel(levels.find((lvl) => lvl.id == e.target.value)!);
                  }}
                  value={level.id}
                >
                  <option value="" disabled>
                    Select a Level
                  </option>
                  {levels?.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
                <Slash />
                <UnderArr />
              </div>
              <div className="relative flex-1">
                <select
                  id="division"
                  name="division"
                  className="input-field appearance-none cursor-pointer pl-8"
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
                <Slash />
                <UnderArr />
              </div>
            </div>
          </FormRow>
        </div>

        <div className="w-full flex items-center h-12 -mt-5">
          {state?.message && <ErrorBox message={state.message} />}
        </div>
      </div>

      <div className="flex w-full justify-between">
        <CancelButton href={cancelHref} />
        <Button type="submit">Create Class</Button>
      </div>
    </form>
  );
}

export default CreateClassForm;

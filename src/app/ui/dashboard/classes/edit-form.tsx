"use client";

import { useFormState } from "react-dom";
import { Button, CancelButton, DeleteButton } from "../buttons";
import { useState } from "react";
import { ErrorBox, FormRow, Slash, UnderArr } from "../form";

import { FrontendTeacher } from "@/definitions/teacher-types";
import { deleteClass, updateClass } from "@/lib/actions/class-actions";
import { FrontendClass } from "@/definitions/class-types";
import { ADMIN_CLASS_BASE_PATH } from "@/lib/constants";

function EditClassForm({
  id,
  _class,
  teachers,
  deletable,
}: {
  id: string;
  _class: FrontendClass;
  teachers: FrontendTeacher[];
  deletable: boolean;
}) {
  const {
    name,
    textbook,
    levelName,
    division,
    teacher: defaultTeacher,
  } = _class;

  const [teacher, setTeacher] = useState(
    teachers.find((teacher) => teacher.id == defaultTeacher) ?? teachers[0]
  );

  const updateClassWithBind = updateClass.bind(null, id, teacher.name);
  const deleteClassWithBind = deleteClass.bind(null, id);

  const initialState = { message: "" };
  const [state, dispatch] = useFormState(updateClassWithBind, initialState);

  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && TextBook*/}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" disabled>
            <div id="name" className="input-field  ">
              {name}
            </div>
          </FormRow>
          {/*TextBook*/}
          <FormRow label="TextBook" disabled>
            <div id="textbook" className="input-field  ">
              {textbook}
            </div>
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
                  Select a Level
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
                <div className="input-field appearance-none cursor-pointer pl-8">
                  {levelName}
                </div>
                <Slash />
                <UnderArr />
              </div>
              <div className="relative flex-1">
                <div className="input-field appearance-none cursor-pointer pl-8">
                  {division}
                </div>
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

      <div className="flex w-full justify-between mt-4">
        <div className="flex gap-x-4">
          <CancelButton
            href={`${ADMIN_CLASS_BASE_PATH}?query=&page=1&level=${_class.level}`}
          />
          <DeleteButton action={deleteClassWithBind} disabled={!deletable} />
        </div>
        <div className="flex gap-x-4">
          <Button type="submit">Edit</Button>
        </div>
      </div>
    </form>
  );
}

export default EditClassForm;

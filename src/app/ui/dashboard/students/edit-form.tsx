"use client";

import {
  deleteStudent,
  resetPassword,
  updateStudent,
} from "@/lib/actions/student-actions";
import { useFormState } from "react-dom";
import { Button, CancelButton, DeleteButton, ResetPassword } from "../buttons";
import { useEffect, useState } from "react";
import { ErrorBox, FormRow, Slash, UnderArr } from "../form";
import { FrontendStudent } from "@/definitions/student-types";
import { FrontendLevel } from "@/definitions/level-types";
import { STUDENTS_BASE_PATH } from "@/lib/constants";

function EditStudentForm({
  id,
  student,
  levels,
  deletable,
}: {
  id: string;
  student: FrontendStudent;
  levels: FrontendLevel[];
  deletable: boolean;
}) {
  const [phone, setPhone] = useState(student.phone);
  const [level, setLevel] = useState<FrontendLevel>(
    levels.find((lvl) => lvl.id == student.level) || levels[0]
  );
  const [divisions, setDivisions] = useState(level.divisions);
  const [division, setDivision] = useState(student.division);

  useEffect(() => {
    setDivisions(level.useDivision ? level.divisions : ["none"]);
  }, [level]);

  const updateStudentWithBind = updateStudent.bind(null, id, level.name);
  const deleteStudentWithBind = deleteStudent.bind(null, id);
  const resetPasswordWithBind = resetPassword.bind(null, id);

  const initialState = { message: "" };
  const [state, dispatch] = useFormState(updateStudentWithBind, initialState);

  const formatPhone = (value: string) => {
    setPhone(value);
    if (phone.length < value.length && value.length == 8) {
      setPhone(value + "-");
    }
  };

  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name-Ko && Name-En && */}
        <div className="flex gap-x-20">
          {/*Name-Ko*/}
          <FormRow label="이 름" required>
            <input
              id="nameKo"
              name="nameKo"
              type="text"
              className="input-field  "
              placeholder="Enter korean name"
              defaultValue={student.nameKo}
            />
          </FormRow>
          {/*Name-En*/}
          <FormRow label="Name" required>
            <input
              id="nameEn"
              name="nameEn"
              type="text"
              className="input-field  "
              placeholder="Enter english name"
              defaultValue={student.nameEn}
            />
          </FormRow>
        </div>

        {/*ID && Level */}
        <div className="flex gap-x-20">
          {/*ID*/}
          <FormRow label="ID" disabled>
            <div className="input-field">{student.signInID}</div>
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

        {/*Birth && Phone*/}
        <div className="flex gap-x-20">
          {/*Birth*/}
          <FormRow label="Birth" disabled>
            <div id="birth" className="input-field">
              {student.birth}
            </div>
          </FormRow>
          {/*Phone*/}
          <FormRow label="Phone" required>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="input-field  "
              placeholder="Enter phone number"
              maxLength={13}
              value={phone}
              onChange={(e) => formatPhone(e.target.value)}
              onFocus={() => setPhone("010-")}
            />
          </FormRow>
        </div>

        <div className="w-full flex items-center h-12 -mt-5">
          {state?.message && <ErrorBox message={state.message} />}
        </div>
      </div>

      <div className="flex w-full justify-between mt-4">
        <div className="flex gap-x-4">
          <CancelButton href={STUDENTS_BASE_PATH} />
          <DeleteButton action={deleteStudentWithBind} disabled={!deletable} />
        </div>
        <div className="flex gap-x-4">
          <ResetPassword action={resetPasswordWithBind} />
          <Button type="submit">Edit</Button>
        </div>
      </div>
    </form>
  );
}

export default EditStudentForm;

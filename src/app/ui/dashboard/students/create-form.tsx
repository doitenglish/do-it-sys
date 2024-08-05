"use client";

import { createStudent } from "@/lib/actions/student-actions";
import { useFormState } from "react-dom";
import { Button, CancelButton } from "../buttons";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { ErrorBox, FormRow, Slash, UnderArr } from "../form";
import { FrontendLevel } from "@/definitions/level-types";

function CreateStudentForm({ levels }: { levels: FrontendLevel[] }) {
  const [nameKo, setNameKo] = useState("");
  const [signInID, setSignInID] = useState("");
  const [phone, setPhone] = useState("");

  const [level, setLevel] = useState(levels[0]);
  const [divisions, setDivisions] = useState(
    levels[0].useDivision ? levels[0].divisions : ["none"]
  );
  const [division, setDivision] = useState("");

  useEffect(() => {
    setDivisions(level.useDivision ? level.divisions : ["none"]);
  }, [level]);

  const createStudentWithBind = createStudent.bind(null, level.name);
  const initialState = { message: "" };
  const [state, dispatch] = useFormState(createStudentWithBind, initialState);

  const formatPhone = (value: string) => {
    setPhone(value);
    if (phone.length < value.length && value.length == 8) {
      setPhone(value + "-");
    }
  };

  const maxDate = formatDate(new Date());

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
              value={nameKo}
              onChange={(e) => {
                setNameKo(e.target.value);
                setSignInID(e.target.value);
              }}
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
            />
          </FormRow>
        </div>

        {/*ID && Level */}
        <div className="flex gap-x-20">
          {/*ID*/}
          <FormRow label="ID" required>
            <input
              id="signInID"
              name="signInID"
              type="text"
              className="input-field  "
              placeholder="Enter ID"
              value={signInID}
              onChange={(e) => setSignInID(e.target.value)}
            />
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
          <FormRow label="Birth" required>
            <input
              id="birth"
              name="birth"
              type="date"
              max={maxDate}
              className="input-field -mb-0.5"
              value={formatDate(new Date())}
            />
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

      <div className="flex w-full justify-between ">
        <CancelButton href="/dashboard/admin/students" />
        <Button type="submit">Create Student</Button>
      </div>
    </form>
  );
}

export default CreateStudentForm;

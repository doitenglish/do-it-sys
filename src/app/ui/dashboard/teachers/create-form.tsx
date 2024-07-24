"use client";

import { useFormState } from "react-dom";
import { Button, CancelButton } from "../buttons";
import { createTeacher } from "@/lib/actions/teacher-actions";
import { ErrorBox, FormRow } from "../form";
import { useState } from "react";

function CreateTeacherForm() {
  const initialState = { message: "" };
  const [state, dispatch] = useFormState(createTeacher, initialState);

  const [name, setName] = useState("");
  const [signInID, setSignInID] = useState("");
  {
    /*todo: robust validations for each field*/
  }
  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && signInID*/}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" required>
            <input
              id="name"
              name="name"
              type="text"
              className="input-field"
              placeholder="Enter level name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSignInID(e.target.value);
              }}
            />
          </FormRow>
          {/*signInID*/}
          <FormRow label="ID" required>
            <input
              id="signInID"
              name="signInID"
              type="text"
              className="input-field"
              placeholder="Enter ID"
              value={signInID}
              onChange={(e) => setSignInID(e.target.value)}
            />
          </FormRow>
        </div>
        <div className="w-full flex items-center h-12 -mt-5">
          {state?.message && <ErrorBox message={state.message} />}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <CancelButton href="/dashboard/admin/teachers" />
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}

export default CreateTeacherForm;

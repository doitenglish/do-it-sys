"use client";

import { useFormState } from "react-dom";
import { Button } from "../buttons";
import { changePassword } from "@/lib/actions/teacher-actions";
import { ErrorBox, FormRow, SuccessBox } from "../form";
import { useEffect, useState } from "react";

function ChangePassword({ forAdmin = false }: { forAdmin?: boolean }) {
  const [newPW, setNewPW] = useState("");
  const [confirmPW, setConfirmPW] = useState("");
  const initialState = { message: "", ok: false };

  const changePasswordWithBind = changePassword.bind(null, forAdmin);
  const [state, dispatch] = useFormState(changePasswordWithBind, initialState);

  useEffect(() => {
    if (state.ok) {
      setNewPW("");
      setConfirmPW("");
    }
  }, [state]);

  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        <div className="flex gap-x-20">
          {/*New Password*/}
          <FormRow label="New Password" required>
            <input
              id="new"
              name="new"
              type="password"
              className="input-field"
              placeholder="Enter new password"
              value={newPW}
              onChange={(e) => setNewPW(e.target.value)}
            />
          </FormRow>
          {/*Confirm New Password*/}
          <FormRow label="Confirm new password" required>
            <input
              id="confirm"
              name="confirm"
              type="password"
              className="input-field"
              placeholder="Confirm New Password"
              value={confirmPW}
              onChange={(e) => setConfirmPW(e.target.value)}
            />
          </FormRow>
        </div>
        <div className="w-full flex items-center h-12 -mt-5">
          {!state?.ok && state?.message && <ErrorBox message={state.message} />}
          {state?.ok && state?.message && (
            <SuccessBox message={state.message} />
          )}
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default ChangePassword;

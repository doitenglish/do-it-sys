"use client";

import { useFormState } from "react-dom";
import { Button, CancelButton, DeleteButton } from "../buttons";

import { ErrorBox, FormRow, Slash, UnderArr } from "../form";
import { deleteLevel, updateLevel } from "@/lib/actions/level-actions";
import { FrontendLevel } from "@/definitions/level-types";
import { LEVELS_BASE_PATH, LEVEL_DIVISION_CHILDREN } from "@/lib/constants";

function EditLevelForm({
  id,
  level,
  deletable,
}: {
  id: string;
  level: FrontendLevel;
  deletable: boolean;
}) {
  const updateLevelWithBind = updateLevel.bind(null, id);
  const deleteLevelWithBind = deleteLevel.bind(null, id);

  const initialState = { message: "" };
  const [state, dispatch] = useFormState(updateLevelWithBind, initialState);

  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && Amount*/}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" disabled>
            <div className="input-field">{level.name}</div>
          </FormRow>

          {/*Amount*/}
          <FormRow label="Division Amounts" required>
            <div className="relative">
              <select
                id="amount"
                name="amount"
                className="input-field appearance-none cursor-pointer pl-8"
                defaultValue={level.useDivision ? level.divisions?.length : 1}
              >
                <option value="" disabled>
                  Select amount of divisions
                </option>
                {LEVEL_DIVISION_CHILDREN.map((amount) => (
                  <option key={amount} value={amount}>
                    {amount}
                  </option>
                ))}
              </select>
              <Slash />
              <UnderArr />
            </div>
          </FormRow>
        </div>
        <div className="w-full flex items-center h-12 -mt-5">
          {state?.message && <ErrorBox message={state.message} />}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <div className="flex gap-x-4">
          <CancelButton href={LEVELS_BASE_PATH} />
          <DeleteButton action={deleteLevelWithBind} disabled={!deletable} />
        </div>

        <Button type="submit">Edit</Button>
      </div>
    </form>
  );
}

export default EditLevelForm;

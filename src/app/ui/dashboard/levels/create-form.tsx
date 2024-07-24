"use client";

import { useFormState } from "react-dom";
import { Button, CancelButton } from "../buttons";
import { ErrorBox, FormRow, Slash, UnderArr } from "../form";
import { createLevel } from "@/lib/actions/level-actions";
import { LEVELS_BASE_PATH, LEVEL_DIVISION_CHILDREN } from "@/lib/constants";

function CreateLevelForm() {
  const initialState = { message: "" };
  const [state, dispatch] = useFormState(createLevel, initialState);

  {
    /*todo: robust validations for each field*/
  }
  return (
    <form action={dispatch} className="flex flex-col">
      <div className="w-full my-10 ">
        {/*Name && Amount*/}
        <div className="flex gap-x-20">
          {/*Name*/}
          <FormRow label="Name" required>
            <input
              id="name"
              name="name"
              type="text"
              className="input-field"
              placeholder="Enter level name"
            />
          </FormRow>

          {/*Amount*/}
          <FormRow label="Division Amounts" required>
            <div className="relative">
              <select
                id="amount"
                name="amount"
                className="input-field appearance-none cursor-pointer pl-8"
                defaultValue={1}
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
        <CancelButton href={LEVELS_BASE_PATH} />
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}

export default CreateLevelForm;

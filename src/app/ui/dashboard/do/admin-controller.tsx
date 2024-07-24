"use client";

import { adminMutateBalanceById } from "@/lib/actions/do-actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { ErrorBox, SuccessBox } from "../form";

function Controller({ id }: { id: string }) {
  const [amount, setAmount] = useState("");

  const initialState = { message: "", ok: false };

  const mutateBalanceWithBind = adminMutateBalanceById.bind(null, id, +amount);
  const [state, dispatch] = useFormState(mutateBalanceWithBind, initialState);

  useEffect(() => {
    if (state.ok) {
      setAmount("");
    }
  }, [state]);
  return (
    <>
      <div className="px-5 pt-5 pb-8 bg-neutral-100 bg-opacity-80 border border-neutral-200">
        <h3 className="text-neutral-700 font-medium mb-6">
          Account Controller
        </h3>
        <div className="flex gap-x-4">
          <input
            type="number"
            name="weight"
            id="weight"
            autoFocus
            className="cursor-pointer block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex gap-x-2">
            <form action={dispatch} className="w-12 h-13">
              <input
                id="sign"
                name="sign"
                defaultValue="1"
                className="hidden"
              />
              <button className="text-lg w-full h-full bg-yellow-300">+</button>
            </form>
            <form action={dispatch} className="w-12 h-13">
              <input
                id="sign"
                name="sign"
                defaultValue="-1"
                className="hidden"
              />
              <button className="text-lg w-full h-full bg-neutral-400">
                -
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center h-12 -my-5">
        {!state?.ok && state?.message && <ErrorBox message={state.message} />}
        {state?.ok && state?.message && <SuccessBox message={state.message} />}
      </div>
    </>
  );
}

export default Controller;

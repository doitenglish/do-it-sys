"use client";

import { Attendee, onAirAttendee } from "@/definitions/student-types";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FormRow } from "../form";
import { useFormState } from "react-dom";
import { saveOnAir } from "@/lib/actions/schedule-actions";

function useBeforeUnloadWarning(): void {
  useEffect(() => {
    // Use a more generic event type if specific types cause issues
    const handleBeforeUnload = (e: Event) => {
      e.preventDefault();
      // As per the standard, to make the event cancelable, returnValue must be set
      (e as BeforeUnloadEvent).returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload as EventListener
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload as EventListener
      );
  }, []);
}

function AttendanceBtn({
  label,
  isFocused,
  onClick,
}: {
  label: string;
  isFocused: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={clsx("flex-1  py-4 text-sm tracking-wide", {
        "bg-neutral-800 text-neutral-100": isFocused,
        "bg-neutral-100 text-neutral-800": !isFocused,
      })}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function Controller({
  attendee,
  handleAbsent,
  handleDoMoney,
  disabled = false,
}: {
  attendee: onAirAttendee;
  handleAbsent: (currentAtd: onAirAttendee) => void;
  handleDoMoney: (
    currentAtd: onAirAttendee,
    weight: number,
    isPositive: boolean
  ) => void;
  disabled?: boolean;
}) {
  const [weight, setWeight] = useState("");

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex">
        <AttendanceBtn
          label="Present"
          isFocused={attendee.absent == 0}
          onClick={() => handleAbsent(attendee)}
        />
        <AttendanceBtn
          label="Absent"
          isFocused={attendee.absent == 1}
          onClick={() => handleAbsent(attendee)}
        />
      </div>
      <div className="bg-neutral-200 bg-opacity-50 pt-12 pb-6 px-8">
        <FormRow label="Do money" disabled={disabled}>
          <div className="flex gap-x-4">
            <input
              type="number"
              name="weight"
              id="weight"
              autoFocus
              className="cursor-pointer block w-full text-sm px-3 py-3.5 border border-neutral-300 focus:border-neutral-500 focus:outline-none shadow focus:shadow-md"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min={0}
              disabled={disabled}
            />
            <div className="flex gap-x-2">
              <button
                className="text-lg w-12 h-13 bg-yellow-300"
                onClick={() => {
                  if (!weight) {
                    return;
                  }
                  handleDoMoney(attendee, Math.floor(+weight), true);
                  setWeight("");
                }}
                disabled={disabled}
              >
                +
              </button>
              <button
                className="text-lg w-12 h-13 bg-neutral-400 "
                onClick={() => {
                  if (!weight) {
                    return;
                  }

                  handleDoMoney(attendee, Math.floor(+weight), false);
                  setWeight("");
                }}
                disabled={disabled}
              >
                -
              </button>
            </div>
          </div>
        </FormRow>
        <FormRow label="History" disabled={disabled}>
          <div className="bg-white h-44 flex flex-col justify-between w-full text-sm  py-3 border border-neutral-300 shadow">
            <div className="h-36 overflow-auto">
              {[...attendee.history].reverse().map((history, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center pl-5 pr-7 mb-0.5"
                  >
                    <span>{history > 0 ? "+" : "  -"}</span>
                    <span>{Math.abs(history)}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center border-t border-neutral-300 pt-3 pl-3 pr-7">
              <span>Total</span>
              <span>
                {attendee.history.length > 0
                  ? attendee.history.reduce(
                      (accumulator, currentValue) => accumulator + currentValue,
                      0
                    )
                  : 0}
              </span>
            </div>
          </div>
        </FormRow>
      </div>
    </div>
  );
}

function OnAir({
  id,
  teacherName,
  _className,
  attendees: students,
  currentAtd,
}: {
  id: string;
  teacherName: string;
  _className: string;
  attendees: Attendee[];
  currentAtd?: string;
}) {
  useBeforeUnloadWarning();

  const [attendees, setAttendees] = useState(
    students.map(
      (atd: Attendee) =>
        ({
          id: atd.id,
          absent: 0,
          history: [] as Number[],
        } as onAirAttendee)
    )
  );

  const handleAbsent = (currentAtd: onAirAttendee) => {
    setAttendees((currentAttendees) =>
      currentAttendees.map((atd) =>
        atd.id === currentAtd.id
          ? { ...atd, absent: atd.absent === 0 ? 1 : 0 }
          : atd
      )
    );
  };

  const handleDoMoney = (
    currentAtd: onAirAttendee,
    weight: number,
    isPositive: boolean
  ) => {
    const amount = isPositive ? weight : -weight;
    setAttendees((currentAttendees) =>
      currentAttendees.map((atd) =>
        atd.id === currentAtd.id
          ? { ...atd, history: [...atd.history, amount] }
          : atd
      )
    );
  };

  const selected = currentAtd
    ? attendees.find((atd) => atd.id === currentAtd)
    : undefined;

  const onSubmit = (e: any) => {
    const ok = confirm("Are you sure you want to save?");
    if (!ok) {
      e.preventDefault();
    }
  };

  const saveOnAirWithBind = saveOnAir.bind(
    null,
    id,
    attendees,
    teacherName,
    _className
  );

  const [state, dispatch] = useFormState(saveOnAirWithBind, {
    message: "Saving...",
  });

  return (
    <div className="w-full  ">
      <Controller
        attendee={selected || attendees[0]}
        handleAbsent={handleAbsent}
        handleDoMoney={handleDoMoney}
        disabled={selected == undefined || selected.absent == 1}
      />
      <form action={dispatch} className="mt-8" onSubmit={onSubmit}>
        <button
          type="submit"
          className="bg-neutral-800 text-neutral-100 w-full py-4 tracking-wide disabled:hidden"
          disabled={selected == undefined}
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default OnAir;

import clsx from "clsx";
import { ReactNode } from "react";

interface IFormRowProps {
  label: string;
  children: ReactNode;
  disabled?: boolean;
  required?: boolean;
}

export function FormRow({
  label,
  children,
  disabled = false,
  required = false,
}: IFormRowProps) {
  return (
    <div className="flex-1 mb-10">
      <label
        className={clsx("mb-2 block   font-medium", {
          "text-neutral-400": disabled,
          "text-neutral-700": !disabled,
        })}
      >
        {label}
        {required ? <span className=" text-red-400 ml-1">*</span> : null}
      </label>
      {children}
    </div>
  );
}

export function UnderArr() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-4 h-4 "
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
    </div>
  );
}

export function Slash() {
  return (
    <div className="absolute -top-2 left-0 translate-y-1/2 text-2xl text-neutral-600 font-extralight">
      -
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div id="error" aria-live="polite" aria-atomic="true">
      <p className=" text-red-500">{message}</p>
    </div>
  );
}

export function SuccessBox({ message }: { message: string }) {
  return (
    <div id="success" aria-live="polite" aria-atomic="true">
      <p className=" text-green-500">{message}</p>
    </div>
  );
}

export function FormStateBox({
  state,
}: {
  state: { ok: boolean; message: string };
}) {
  return state.ok ? (
    <SuccessBox message={state.message} />
  ) : (
    <ErrorBox message={state.message} />
  );
}

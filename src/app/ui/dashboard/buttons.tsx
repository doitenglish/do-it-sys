import clsx from "clsx";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        (className =
          "flex items-center justify-center py-3.5  px-7 text-sm text-neutral-100 bg-neutral-800 hover:bg-neutral-950 focus:outline-none disabled:hidden"),
        className
      )}
    >
      {children}
    </button>
  );
}

export function CancelButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className=" text-center text-sm justify-center items-center py-3.5 px-10  text-neutral-600 bg-neutral-200 hover:bg-neutral-300 hover:text-neutral-700 focus:outline-none "
    >
      Cancel
    </Link>
  );
}

export function CreateButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center py-3.5  px-7 text-sm text-neutral-100 bg-neutral-800 hover:bg-neutral-950"
    >
      <span>{label}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5 ml-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </Link>
  );
}

export function EditButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center py-2  px-7 text-sm text-neutral-100 bg-neutral-700 hover:bg-neutral-800"
    >
      <span>Edit</span>
    </Link>
  );
}

export function DeleteButton({
  action,
  disabled,
}: {
  action: () => Promise<{ message: string }>;
  disabled: boolean;
}) {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        const ok = confirm("Are you sure?");

        if (ok) {
          action();
        }
      }}
      disabled={disabled}
    >
      Delete
    </Button>
  );
}

export function ResetPassword({
  action,
}: {
  action: () => Promise<{ message: string }>;
}) {
  return (
    <button
      className="border py-3.5 px-4 hover:bg-gray-100 flex items-center gap-x-3"
      onClick={(e) => {
        e.preventDefault();
        const ok = confirm("Are you sure?");

        if (ok) {
          action();
        }
      }}
    >
      <span className="text-sm text-neutral-800 font-medium">
        Reset Password
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    </button>
  );
}

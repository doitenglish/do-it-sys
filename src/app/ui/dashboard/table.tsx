import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

export function TableHeaderCell({
  children,
  className,
}: {
  children: ReactNode | string;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={clsx(
        "px-3 py-7 font-normal text-neutral-400",
        className
      )}
    >
      {children}
    </th>
  );
}

type ClassNameType =
  | string
  | { [key: string]: boolean };

export function TableCell({
  className,
  children,
  href,
}: {
  className?: ClassNameType;
  children: ReactNode | string;
  href?: string;
}) {
  const TableCell = href ? (
    <Link
      href={href}
      className="underline underline-offset-1 font-semibold"
    >
      {children}{" "}
    </Link>
  ) : (
    children
  );

  return (
    <td
      className={clsx(
        "whitespace-nowrap px-3 py-5",
        className
      )}
    >
      {TableCell}
    </td>
  );
}

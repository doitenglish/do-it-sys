"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
export const links = [
  {
    name: "Schedules",
    href: "/dashboard/schedules",
  },
  {
    name: "Classes",
    href: "/dashboard/classes",
  },
];

export const adminLinks = [
  {
    name: "Orders",
    href: "/dashboard/admin/orders",
  },
  {
    name: "Products",
    href: "/dashboard/admin/products",
  },
  {
    name: "Ranking",
    href: "/dashboard/admin/ranking",
  },
  {
    name: "Attendances",
    href: "/dashboard/admin/attendances",
  },
  {
    name: "Schedules",
    href: "/dashboard/admin/schedules",
  },
  {
    name: "Classes",
    href: "/dashboard/admin/classes",
  },
  {
    name: "Students",
    href: "/dashboard/admin/students",
  },
  {
    name: "Levels",
    href: "/dashboard/admin/levels",
  },
  {
    name: "Teachers",
    href: "/dashboard/admin/teachers",
  },
];

function NavLink({
  name,
  href,
  isActive = false,
}: {
  name: string;
  href?: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href!}
      className="w-full flex items-center text-lg py-1.5 focus:outline-none"
    >
      {isActive && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.3}
          stroke="currentColor"
          className="w-5 h-5 -ml-2 text-neutral-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      )}
      <div className={clsx("text-gray-800", { "ml-2.5 my-1": isActive })}>
        {name}
      </div>
    </Link>
  );
}

export default function NavLinks({ role }: { role: string }) {
  const pathname = usePathname();

  const renderLinks = ({
    linkSet,
    useActive = true,
  }: {
    linkSet: { name: string; href: string }[];
    useActive?: boolean;
  }) =>
    linkSet.map(({ name, href }) => (
      <NavLink
        key={name}
        name={name}
        href={href}
        {...(useActive && { isActive: pathname.includes(href) })}
      />
    ));

  return (
    <>
      <h3 className="mt-6 mb-2 text-base font-medium text-neutral-400 focus:outline-none">
        {role === "admin" ? "Admin" : "Teacher"}
      </h3>
      {role === "admin"
        ? renderLinks({
            linkSet: adminLinks,
          })
        : renderLinks({
            linkSet: links,
          })}
    </>
  );
}

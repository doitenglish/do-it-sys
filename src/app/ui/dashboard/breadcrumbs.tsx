"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { adminLinks, links } from "./nav-links";
import { useFormState } from "react-dom";
import { signOut } from "@/lib/actions/auth-actions";
import { DASHBOARD_BASE_PATH } from "@/lib/constants";

interface IBreadcrumb {
  label: string;
  href?: string;
}

function MobileNavLink({ name, href }: { name: string; href: string }) {
  return (
    <Link href={href} className="text-xl font-semi-bold text-gray-800">
      <span>{name}</span>
    </Link>
  );
}

function Breadcrumb({ label, href }: IBreadcrumb) {
  return href ? (
    <Link href={href} className="mr-6  text-2xl">
      {label}
    </Link>
  ) : (
    <span className="mr-6  text-2xl">{label}</span>
  );
}

export default function Breadcrumbs({
  breadcrumbs,
  role = "admin",
}: {
  breadcrumbs: IBreadcrumb[];
  role?: "admin" | "teacher";
}) {
  const [showMenu, setShowMenu] = useState(false);
  const initialState = null;
  const [_, dispatch] = useFormState(signOut, initialState);
  const meLink =
    DASHBOARD_BASE_PATH + (role !== "teacher" ? "/admin" : "") + "/me";

  return (
    <>
      {showMenu && (
        <div className="absolute top-0 left-0 z-20 w-screen h-screen bg-white/80 backdrop-blur-sm px-20 py-28">
          <div className="w-full h-full flex justify-between ">
            <div className="flex flex-col  items-start gap-y-8">
              <Link
                href={meLink}
                className="text-gray-700 mb-8 p-2 border-2 rounded-md border-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="size-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                {/*  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-7"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clipRule="evenodd"
                  />
                </svg> */}
              </Link>
              {role === "admin"
                ? adminLinks.map((link, index) => (
                    <MobileNavLink
                      key={index}
                      name={link.name}
                      href={link.href}
                    />
                  ))
                : links.map((link, index) => (
                    <MobileNavLink
                      key={index}
                      name={link.name}
                      href={link.href}
                    />
                  ))}
              <form action={dispatch} className="mt-12  ">
                <button className="text-gray-100 bg-gray-700 hover:bg-gray-900 p-3 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.3"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                    />
                  </svg>
                </button>
              </form>
            </div>
            <div className="flex flex-col justify-start items-center text-gray-700 ">
              <button onClick={() => setShowMenu(false)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  stroke="currentColor"
                  className="size-12"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <nav aria-label="Breadcrumb" className="w-full">
        <ol className="w-full flex items-center justify-start text-neutral-800">
          <li className="2xl:hidden mr-6">
            <button onClick={() => setShowMenu(true)} className="pt-1">
              <Image
                src="/logo_final_4.png"
                alt="main logo"
                width={50}
                height={50}
              />
            </button>
          </li>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={index} className=" flex items-center">
              <Breadcrumb label={breadcrumb.label} href={breadcrumb.href} />

              {index < breadcrumbs.length - 1 ? (
                <div className="mr-6 text-lg text-neutral-600">
                  <span>/</span>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

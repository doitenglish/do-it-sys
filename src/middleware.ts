import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt, encrypt } from "./lib/jose";
import {
  ADMIN_BASE_PATH,
  ADMIN_SCHEDULES_BASE_PATH,
  DASHBOARD_BASE_PATH,
  LOGIN_PATH,
  PUBLIC_PATHS,
  ROLES,
  SCHEDULES_BASE_PATH,
  UNAUTHORIZED_PATH,
} from "./lib/constants";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (PUBLIC_PATHS.includes(path)) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("__session");

  if (!sessionCookie) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  const session = await decrypt(sessionCookie.value);
  const {
    user: { role },
  } = session;

  // Redirect logic for hitting "/dashboard" directly
  if (path === DASHBOARD_BASE_PATH) {
    const redirectPath =
      role === ROLES.TEACHER
        ? SCHEDULES_BASE_PATH
        : role === ROLES.ADMIN
        ? ADMIN_SCHEDULES_BASE_PATH
        : UNAUTHORIZED_PATH;

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Check if the path starts with /dashboard/admin, which is restricted to admin users
  if (path.startsWith(ADMIN_BASE_PATH)) {
    if (role !== ROLES.ADMIN) {
      // If not admin, redirect to login page or show an unauthorized message
      return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, request.url));
    }
  } else if (path.startsWith(DASHBOARD_BASE_PATH)) {
    // For other /dashboard paths, restrict to teacher users
    if (role !== ROLES.TEACHER) {
      // If not a teacher, redirect or show an unauthorized message
      return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, request.url));
    }
  }

  //update session expiration time
  session.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "__session",
    value: await encrypt(session),
    expires: session.expires,
    httpOnly: true,
    secure: true,
  });

  // If the user has the correct role, proceed with the request
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard/admin/:path*", "/dashboard"],
};

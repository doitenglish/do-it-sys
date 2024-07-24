"use server";

import { cookies } from "next/headers";
import { verifyIdToken } from "../firebase/firebase-admin";
import { setAdminClaim } from "../firebase/services/common/hasAccess";
import { redirect } from "next/navigation";
import { encrypt } from "../jose";
import { getNameFromEmail } from "../utils";
import { CurrentUser } from "@/definitions/common-types";

export async function signIn(idToken: string) {
  try {
    let decodedToken = await verifyIdToken(idToken);

    if (!decodedToken) {
      return {
        ok: false,
        message: "Credential invalid.",
      };
    }

    // default setting 'admin' custom claim
    if (decodedToken.role == undefined) {
      const ok = await setAdminClaim(decodedToken.uid);
      if (!ok) {
        return {
          ok: false,
          message: "Fail to set admin claim.",
        };
      }

      return {
        ok: false,
        message: "Successfully set admin claim. Sign in again.",
      };
    }

    if (decodedToken.role !== "admin" && decodedToken.role !== "teacher") {
      return {
        ok: false,
        message: "Unauthorized.",
      };
    }

    const user: CurrentUser = {
      uid: decodedToken.uid,
      role: decodedToken.role,
      name: getNameFromEmail(decodedToken.email!),
    };

    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const sessionCookie = await encrypt({
      user,
      expires,
    });

    cookies().set("__session", sessionCookie, {
      expires,
      httpOnly: true,
      secure: true,
    });

    const path =
      decodedToken.role === "admin"
        ? "/dashboard/admin/orders"
        : "/dashboard/schedules";

    return {
      ok: true,
      path,
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: "Fail to sign in. Try again.",
    };
  }
}

export async function signOut() {
  cookies().delete("__session");

  redirect("/dashboard/login");
}

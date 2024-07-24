"use server";

import { QueryOutput } from "@/definitions/common-types";
import { Role, getRoleAndName } from "./getRole";
import { adminAuth } from "../../firebase-admin";

type HasAccessOutput = QueryOutput<{ role: Role; name: string }>;

export async function setAdminClaim(id: string) {
  try {
    const result = await getRoleAndName(id);
    console.log(result);

    if (!result.ok) {
      return false;
    }

    const {
      data: { role },
    } = result;

    if (role !== "admin") {
      return false;
    }

    const customClaims = {
      role: "admin",
      // Add other custom claims as needed
    };

    await adminAuth.setCustomUserClaims(id, customClaims);

    return true;
  } catch (error) {
    return false;
  }
}

export async function hasAccess(
  id: string | null,
  roles: Role[]
): Promise<HasAccessOutput> {
  try {
    const result = await getRoleAndName(id);
    if (!result.ok) {
      return {
        ok: false,
        error: result.error,
      };
    }

    const {
      data: { role, name },
    } = result;

    if (!roles.includes(role)) {
      return {
        ok: false,
        error: "Unauthorized",
      };
    }

    const data = {
      role,
      name,
    };

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot authorize user.",
    };
  }
}

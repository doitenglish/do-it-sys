import { QueryOutput } from "@/definitions/common-types";
import { adminDB } from "../../firebase-admin";
import { FrontendTeacher } from "@/definitions/teacher-types";

export type Role = "admin" | "teacher" | "student";

type GetRoleAndNameOutput = QueryOutput<{ role: Role; name: string }>;

export async function getRoleAndName(
  id: string | null
): Promise<GetRoleAndNameOutput> {
  try {
    if (!id) {
      return {
        ok: false,
        error: "Unauthenticated.",
      };
    }
    const user = (
      await adminDB.collection("teachers").doc(id).get()
    ).data() as FrontendTeacher;
    if (!user) {
      return {
        ok: false,
        error: "User not found.",
      };
    }

    const data = { role: user.role as Role, name: user.name };

    return {
      ok: true,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      error: "Cannot get role and name.",
    };
  }
}

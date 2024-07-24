import { cookies } from "next/headers";
import { decrypt } from "./jose";
import { CurrentUser } from "@/definitions/common-types";

export async function getSession() {
  try {
    const session = cookies().get("__session")?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch (error) {
    console.error("Error getting session:", error);
    return null; // Or handle differently based on your application's needs
  }
}

export async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session) {
      return null;
    }

    return (session.user as CurrentUser) || null;
  } catch (error) {
    return null;
  }
}

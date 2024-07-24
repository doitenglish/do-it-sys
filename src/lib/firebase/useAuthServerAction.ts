import { adminAuth } from "./firebase-admin";

interface AuthServerActionResponse {
  user: { uid: string; email?: string } | null;
}

export async function useAuthServerAction(
  session: string | null
): Promise<AuthServerActionResponse> {
  if (!session) return { user: null };

  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(session, true);
    return { user: { uid: decodedIdToken.uid, email: decodedIdToken.email } };
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return { user: null };
  }
}

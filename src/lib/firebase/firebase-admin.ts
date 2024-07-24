import "server-only";

import { cookies } from "next/headers";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { Auth, SessionCookieOptions, getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function formatPrivateKey(key: string | undefined) {
  if (key == undefined) {
    return "";
  }
  return key.replace(/\\n/g, "\n");
}

const firebaseAdminApp =
  getApps().find((it) => it.name === "firebase-admin-app") ||
  initializeApp(
    {
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    },
    "firebase-admin-app"
  );

export const adminAuth: Auth = getAuth(firebaseAdminApp);
export const adminDB = getFirestore(firebaseAdminApp);
export const adminStorage = getStorage(firebaseAdminApp).bucket();

//todo: should be try-catch
export async function verifyIdToken(idToken: string) {
  return await adminAuth.verifyIdToken(idToken);
}

export async function isUserAuthenticated(
  session: string | undefined = undefined
): Promise<boolean> {
  const _session = session ?? getSession();
  if (!_session) return false;

  try {
    const isRevoked = !(await adminAuth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    return false;
  }
}

function getSession() {
  try {
    return cookies().get("__session")?.value;
  } catch (error) {
    return undefined;
  }
}

export async function createSessionCookie(
  idToken: string,
  sessionCookieOptions: SessionCookieOptions
) {
  return adminAuth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await adminAuth.verifySessionCookie(session);

  return await adminAuth.revokeRefreshTokens(decodedIdToken.sub);
}

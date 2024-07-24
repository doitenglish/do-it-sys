import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET_KEY || "secret";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(key);
  } catch (error) {
    console.error("Error encrypting payload:", error);
    throw new Error("Failed to encrypt payload.");
  }
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.error("Error decrypting token:", error);
    throw new Error("Failed to decrypt token.");
  }
}

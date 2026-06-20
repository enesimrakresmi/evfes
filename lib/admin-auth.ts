import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "bizim-evrenimiz-admin";
const SESSION_VALUE = "admin";

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is missing.");
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function makeAdminToken() {
  return `${SESSION_VALUE}.${sign(SESSION_VALUE)}`;
}

export function isValidAdminToken(token?: string) {
  if (!token) {
    return false;
  }

  const [value, signature] = token.split(".");
  if (value !== SESSION_VALUE || !signature) {
    return false;
  }

  const expected = sign(value);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminRequest() {
  const cookieStore = await cookies();
  return isValidAdminToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function setAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeAdminToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

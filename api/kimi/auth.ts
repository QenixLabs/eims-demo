import * as cookie from "cookie";
import { getDb } from "../queries/connection";
import { platformUsers } from "@db/schema";
import { eq } from "drizzle-orm";
import { Session } from "@contracts/constants";
import { Errors } from "@contracts/errors";
import { verifySessionToken } from "./session";

export async function authenticateRequest(headers: Headers) {
  const cookies = cookie.parse(headers.get("cookie") || "");
  const token = cookies[Session.cookieName];
  if (!token) {
    console.warn("[auth] No session cookie found in request.");
    throw Errors.forbidden("Invalid authentication token.");
  }

  const claim = await verifySessionToken(token);
  if (!claim) {
    throw Errors.forbidden("Invalid authentication token.");
  }

  const userId = Number(claim.userId);
  if (Number.isNaN(userId)) {
    throw Errors.forbidden("Invalid authentication token.");
  }

  const rows = await getDb()
    .select()
    .from(platformUsers)
    .where(eq(platformUsers.id, userId))
    .limit(1);

  const user = rows[0];
  if (!user) {
    throw Errors.forbidden("User not found. Please re-login.");
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

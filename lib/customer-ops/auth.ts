import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const OPS_COOKIE = "wc_ops_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
type SessionPayload = { role: "owner"; exp: number };

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
function secret() { return process.env.OPS_SESSION_SECRET || ""; }
export function opsAuthConfigured() { return Boolean(process.env.OPS_ADMIN_PASSWORD && secret()); }
export function verifyOpsPassword(input: string) { const expected = process.env.OPS_ADMIN_PASSWORD || ""; return Boolean(expected) && safeEqual(input, expected); }
export function createOpsSession() {
  const payload: SessionPayload = { role: "owner", exp: Date.now() + SESSION_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}
export function verifyOpsSession(token: string | undefined | null) {
  if (!token || !secret()) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  if (!safeEqual(sig, expected)) return false;
  try { const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload; return payload.role === "owner" && payload.exp > Date.now(); } catch { return false; }
}
export async function hasOpsSession() { const store = await cookies(); return verifyOpsSession(store.get(OPS_COOKIE)?.value); }

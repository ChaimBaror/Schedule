/**
 * Super-admin utilities.
 * Checks both backend role AND a frontend-side NEXT_PUBLIC_ADMIN_EMAILS fallback.
 */

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "ch.baror@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/** Check if an email is a super admin (frontend fallback) */
export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

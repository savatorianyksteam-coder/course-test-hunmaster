export type PaidAccessReason =
  "account_blocked" | "pending" | "no_enrollment" | "expired" | "revoked";

export type PaidAccessResult =
  { allowed: true; reason: null } | { allowed: false; reason: PaidAccessReason };

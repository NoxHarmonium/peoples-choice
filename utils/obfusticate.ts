import { createHash } from "crypto";

import { env } from "./env";

/**
 * Best effort obfuscation of a candidates email
 *
 * Will not hold up if someone has access to the database
 * and deployment config (they could precompute hashes)
 * but will avoid accidental leaking of the source of votes.
 *
 * NOTE: Don't be lulled into a false sense of security
 *       if someone has the deployment config and direct
 *       access to the DynamoDB table they could create
 *       a precomputed hash table and determine the source
 *       of votes. Only appropriate RBAC can prevent this.
 *
 * @param email the email address to obfusticate
 */
export const obfusticateEmail = (email: string) => {
  // This doesn't really help if this project is open source
  // but I suppose it doesn't hurt
  const fixedSalt = "EnsLFgMB2QaHs4SnnyVPGMga4";
  return createHash("sha256")
    .update(`${fixedSalt}${email}${env.OBFUSTICATION_PEPPER}`)
    .digest("hex");
};

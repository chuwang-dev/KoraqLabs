#!/usr/bin/env node
/**
 * Generates a bcrypt hash for use as ADMIN_PASSWORD_HASH.
 *
 * Usage:
 *   node scripts/hash-password.js "your-new-password"
 *
 * Copy the printed hash into your deployment's environment variables
 * (never commit it to source control) and redeploy.
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.js \"your-password\"");
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
});

#!/usr/bin/env node
/**
 * Generates a bcrypt hash for use as ADMIN_PASSWORD_HASH.
 *
 * Usage:
 *   npm run hash-password
 *
 * Copy the printed hash into your deployment's environment variables
 * (never commit it to source control) and redeploy.
 */
const bcrypt = require("bcryptjs");
const { stdin, stdout } = process;

function promptPassword() {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
      reject(new Error("Run this command in an interactive terminal."));
      return;
    }

    let password = "";
    stdout.write("New admin password (input hidden): ");
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    function cleanup() {
      stdin.removeListener("data", onData);
      stdin.setRawMode(false);
      stdin.pause();
    }

    function onData(chunk) {
      for (const character of chunk) {
        if (character === "\u0003") {
          cleanup();
          stdout.write("\n");
          reject(new Error("Password hashing cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          cleanup();
          stdout.write("\n");
          resolve(password);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          if (password.length > 0) {
            password = password.slice(0, -1);
            stdout.write("\b \b");
          }
          continue;
        }
        if (character >= " ") {
          password += character;
          stdout.write("*");
        }
      }
    }

    stdin.on("data", onData);
  });
}

(async () => {
  const password = process.argv[2] ?? await promptPassword();
  if (password.length < 12) {
    throw new Error("Use a password with at least 12 characters.");
  }

  const hash = await bcrypt.hash(password, 12);
  console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

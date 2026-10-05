#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { createInterface } = require("readline");
const { randomBytes } = require("crypto");
const bcrypt = require("bcryptjs");
const { loadEnvConfig } = require("@next/env");

loadEnvConfig(process.cwd());

function ask(question, defaultValue = "") {
  return new Promise((resolve) => {
    const terminal = createInterface({ input: process.stdin, output: process.stdout });
    const suffix = defaultValue ? ` [${defaultValue}]` : "";
    terminal.question(`${question}${suffix}: `, (answer) => {
      terminal.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

function askHidden(question) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
      reject(new Error("Run this command in an interactive terminal."));
      return;
    }

    let value = "";
    process.stdout.write(`${question} (input hidden): `);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    function cleanup() {
      process.stdin.removeListener("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }

    function onData(chunk) {
      for (const character of chunk) {
        if (character === "\u0003") {
          cleanup();
          process.stdout.write("\n");
          reject(new Error("Setup cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          cleanup();
          process.stdout.write("\n");
          resolve(value);
          return;
        }
        if (character === "\u007f" || character === "\b") {
          if (value.length > 0) {
            value = value.slice(0, -1);
            process.stdout.write("\b \b");
          }
          continue;
        }
        if (character >= " ") {
          value += character;
          process.stdout.write("*");
        }
      }
    }

    process.stdin.on("data", onData);
  });
}

function saveEnvironment(values) {
  const filePath = path.join(process.cwd(), ".env.local");
  const original = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
  const lines = original.split(/\r?\n/);
  const saved = new Set();
  const output = [];

  for (const line of lines) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (!match || !Object.hasOwn(values, match[1])) {
      output.push(line);
      continue;
    }
    if (!saved.has(match[1])) output.push(formatEnvironmentValue(match[1], values[match[1]]));
    saved.add(match[1]);
  }

  for (const [key, value] of Object.entries(values)) {
    if (!saved.has(key)) output.push(formatEnvironmentValue(key, value));
  }

  const content = `${output.join("\n").replace(/\n*$/, "")}\n`;
  fs.writeFileSync(filePath, content, { mode: 0o600 });
  fs.chmodSync(filePath, 0o600);
}

function formatEnvironmentValue(key, value) {
  return `${key}=${key === "ADMIN_PASSWORD_HASH" ? value.replace(/\$/g, "\\$") : value}`;
}

function readEnvironment() {
  const filePath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(filePath)) throw new Error(".env.local was not found.");

  const values = {};
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    if (!["ADMIN_EMAIL", "ADMIN_PASSWORD_HASH", "AUTH_SECRET"].includes(match[1])) continue;

    let value = match[2].trim();
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

async function repairEnvironment() {
  const values = readEnvironment();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.ADMIN_EMAIL ?? "")) {
    throw new Error("A valid ADMIN_EMAIL is required in .env.local.");
  }
  try {
    bcrypt.getRounds(values.ADMIN_PASSWORD_HASH ?? "");
  } catch {
    throw new Error("ADMIN_PASSWORD_HASH is not a valid bcrypt hash.");
  }

  saveEnvironment({
    ADMIN_EMAIL: values.ADMIN_EMAIL,
    ADMIN_PASSWORD_HASH: values.ADMIN_PASSWORD_HASH,
    AUTH_SECRET: randomBytes(32).toString("base64"),
  });
  console.log("Auth settings repaired. The password hash is escaped for Next.js env parsing, and the session secret has been rotated. Restart the dev server.");
}

(async () => {
  if (process.argv[2] === "--repair") {
    await repairEnvironment();
    return;
  }

  const email = (await ask("Admin email", process.env.ADMIN_EMAIL)).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid admin email address.");
  }

  const password = await askHidden("New admin password");
  const confirmation = await askHidden("Confirm password");
  if (password !== confirmation) throw new Error("The passwords do not match.");
  if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("Choose a password between 12 and 72 UTF-8 bytes.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const authSecret = randomBytes(32).toString("base64");
  saveEnvironment({
    ADMIN_EMAIL: email,
    ADMIN_PASSWORD_HASH: passwordHash,
    AUTH_SECRET: authSecret,
  });

  console.log("\nAdmin setup saved to .env.local. Restart the dev server, then sign in with the email and password you entered.");
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
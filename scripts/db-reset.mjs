#!/usr/bin/env node
/**
 * Rebuilds PocketBase from scratch: deletes pb/pb_data, applies all
 * migrations, creates the superuser from PB_ADMIN_* (.env.local), then boots
 * PocketBase temporarily to run the seed script and shuts it down again.
 *
 * Usage: npm run db:reset   (stop `npm run pb` first)
 */

import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL ?? "http://127.0.0.1:8090";
const { PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD } = process.env;
const PB = "./pb/pocketbase";
const DATA_DIR = "pb/pb_data";

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", env: process.env });
    child.on("error", reject);
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args[0]} exited with ${code}`))));
  });

const isUp = () =>
  fetch(`${PB_URL}/api/health`).then((r) => r.ok, () => false);

async function waitUntilUp(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isUp()) return;
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`PocketBase did not start at ${PB_URL}`);
}

async function main() {
  if (!PB_ADMIN_EMAIL || !PB_ADMIN_PASSWORD) {
    throw new Error("PB_ADMIN_EMAIL and PB_ADMIN_PASSWORD must be set in .env.local");
  }
  if (await isUp()) {
    throw new Error(`PocketBase is already running at ${PB_URL} — stop it (npm run pb) first`);
  }

  console.log(`\n▸ Deleting ${DATA_DIR}`);
  await rm(DATA_DIR, { recursive: true, force: true });

  console.log("\n▸ Applying migrations");
  await run(PB, ["migrate", "up", "--dir", DATA_DIR]);

  console.log("\n▸ Creating superuser");
  await run(PB, ["superuser", "upsert", PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD, "--dir", DATA_DIR]);

  console.log("\n▸ Starting PocketBase for seeding");
  const server = spawn(PB, ["serve", "--dir", DATA_DIR, "--http", new URL(PB_URL).host], {
    stdio: "ignore",
    env: process.env,
  });
  try {
    await waitUntilUp();
    console.log("\n▸ Seeding");
    await run(process.execPath, ["scripts/seed.mjs"]);
  } finally {
    server.kill("SIGTERM");
  }

  console.log("\n✓ Database reset. Start it with: npm run pb");
}

main().catch((err) => {
  console.error(`\nReset failed: ${err.message}`);
  process.exit(1);
});

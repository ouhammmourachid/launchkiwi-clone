/**
 * Starts PocketBase with pb/.env loaded (via `node --env-file-if-exists`), so
 * pb_hooks can read PocketBase-only secrets such as LEMONSQUEEZY_API_KEY
 * through $os.getenv(). Next.js never sees them. Extra CLI args pass through.
 */

import { spawn } from "node:child_process";

const args = ["serve", "--dir", "pb/pb_data", "--http", "127.0.0.1:8090", ...process.argv.slice(2)];
const child = spawn("./pb/pocketbase", args, { stdio: "inherit", env: process.env });

for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 0));

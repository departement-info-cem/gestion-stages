#!/usr/bin/env node
import "dotenv/config";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const normalizedBasePath = rawBasePath
  ? rawBasePath.startsWith("/")
    ? rawBasePath
    : `/${rawBasePath}`
  : "";
const trailingPath = normalizedBasePath.endsWith("/")
  ? normalizedBasePath
  : normalizedBasePath
  ? `${normalizedBasePath}/`
  : "/";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ?? "3000";

const displayUrl = `http://${host}:${port}${trailingPath}`;

console.log(`Launching Next.js dev server at ${displayUrl}`);

const binary = process.platform === "win32" ? "next.cmd" : "next";
const nextExecutable = path.join(process.cwd(), "node_modules", ".bin", binary);

const devProcess = spawn(nextExecutable, ["dev"], {
  stdio: "inherit",
  env: process.env,
});

devProcess.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

devProcess.on("error", (error) => {
  console.error("Failed to start Next.js dev server:", error);
  process.exit(1);
});

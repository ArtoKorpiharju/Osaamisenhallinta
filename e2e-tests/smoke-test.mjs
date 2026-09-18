#!/usr/bin/env node
/**
 * Builds full stack with Docker compose checks backend and frontend endpoints
 * and then tears the stack down.
 *
 * Remember to have `docker compose down -v --remove-orphans` at your e2e tests
 * to prevent docker leaving anything behind.
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const PROJECT = "osaamisenhallinta-smoketest";

const env = {
  ...process.env,
  POSTGRES_DB: process.env.POSTGRES_DB ?? "smoketest",
  POSTGRES_USER: process.env.POSTGRES_USER ?? "smoketest",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? "smoketest",
};

const BACKEND_HEALTH_URL = "http://localhost:8080/actuator/health";
const FRONTEND_URL = "http://localhost:5173/";

const MAX_WAIT_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 3000;

function dockerCompose(args) {
  console.log(`\n$ docker compose -p ${PROJECT} ${args.join(" ")}`);
  const result = spawnSync("docker", ["compose", "-p", PROJECT, ...args], {
    cwd: repoRoot,
    env,
    stdio: "inherit",
  });
  return result.status ?? 1;
}

function cleanup() {
  dockerCompose(["down", "-v", "--remove-orphans"]);
}

async function waitForOk(name, url, isReady) {
  const deadline = Date.now() + MAX_WAIT_MS;
  let lastError = "no attempt made yet";
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      const body = await res.text();
      if (res.ok && isReady(body)) {
        console.log(`PASS: ${name} responded as expected (${url})`);
        return true;
      }
      lastError = `HTTP ${res.status}, response body did not match expectations`;
    } catch (err) {
      lastError = err.message;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  console.error(`FAIL: ${name} never became ready at ${url} (${lastError})`);
  return false;
}

async function main() {
  console.log(
    "Building and starting the full stack (db, backend, frontend)...",
  );
  const upStatus = dockerCompose(["up", "-d", "--build"]);
  if (upStatus !== 0) {
    console.error("docker compose up failed - see output above.");
    process.exitCode = 1;
    return;
  }

  const backendOk = await waitForOk("Backend", BACKEND_HEALTH_URL, (body) =>
    body.includes('"status":"UP"'),
  );
  const frontendOk = await waitForOk("Frontend", FRONTEND_URL, (body) =>
    body.includes('id="root"'),
  );

  if (!backendOk || !frontendOk) {
    console.error(
      "\nOne or more services did not come up. Recent container logs:",
    );
    dockerCompose(["logs", "--tail", "100"]);
    process.exitCode = 1;
    return;
  }

  console.log("\nBackend and frontend both loaded successfully.");
}

try {
  await main();
} finally {
  console.log("\nTearing down the stack...");
  cleanup();
}

process.exit(process.exitCode ?? 0);

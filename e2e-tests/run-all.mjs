#!/usr/bin/env node
/**
 * Runs every e2e test in this folder.
 *
 * Any `.mjs` file placed directly in e2e-tests/ (other than this one) is
 * treated as a standalone test and run with `node <file>`. Drop in another
 * .mjs file here to add a new e2e test - no other wiring needed, `npm run
 * e2e-test` will pick it up automatically.
 *
 */

import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const self = path.basename(fileURLToPath(import.meta.url));

const testFiles = readdirSync(__dirname)
  .filter((name) => name.endsWith(".mjs") && name !== self)
  .sort();

if (testFiles.length === 0) {
  console.error(`No test files (*.mjs) found in ${__dirname}`);
  process.exit(1);
}

console.log(
  `Found ${testFiles.length} e2e test file(s): ${testFiles.join(", ")}`,
);

const results = [];

for (const file of testFiles) {
  console.log(`\n${"=".repeat(70)}\nRunning ${file}\n${"=".repeat(70)}`);
  const result = spawnSync(process.execPath, [path.join(__dirname, file)], {
    stdio: "inherit",
  });
  results.push({ file, status: result.status ?? 1 });
}

console.log(`\n${"=".repeat(70)}\nSummary\n${"=".repeat(70)}`);
let anyFailed = false;
for (const { file, status } of results) {
  console.log(`${status === 0 ? "PASS" : "FAIL"} - ${file}`);
  if (status !== 0) anyFailed = true;
}

process.exit(anyFailed ? 1 : 0);

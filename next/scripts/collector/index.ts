import path from "node:path";

import sourceConfig from "@/config/sources";

import { buildRunner } from "./builder";

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const CONTENT_DIR = path.join(REPO_ROOT, "content");
const RESULT_JSON_PATH = path.join(REPO_ROOT, "next", "collector-result.json");

async function main(): Promise<void> {
  const { runner, reporter } = buildRunner({
    config: sourceConfig,
    contentDir: CONTENT_DIR,
    resultJsonPath: RESULT_JSON_PATH,
    jobSummaryPath: process.env["GITHUB_STEP_SUMMARY"],
  });

  const result = await runner.run();
  await reporter.emit(result);
}

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`[ERROR][collector] fatal: ${message}`);
  process.exit(1);
});

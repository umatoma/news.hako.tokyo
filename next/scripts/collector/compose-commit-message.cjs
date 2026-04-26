#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const RESULT_PATH = path.resolve(__dirname, "..", "..", "collector-result.json");

function main() {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(RESULT_PATH, "utf8"));
  } catch {
    process.stdout.write("chore(collector): add articles");
    return;
  }
  const totalNew = Number(payload?.totalNew ?? 0);
  const per = payload?.perSource ?? {};
  const detail = ["zenn", "hatena", "googlenews", "togetter"]
    .map((src) => `${src}=${Number(per?.[src]?.fetched ?? 0)}`)
    .join(", ");
  process.stdout.write(
    `chore(collector): add ${totalNew} articles (${detail})`,
  );
}

main();

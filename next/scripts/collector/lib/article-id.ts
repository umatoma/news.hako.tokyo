import { createHash } from "node:crypto";

import { normalizeUrlForDedup } from "./url-normalize";

const ID_LENGTH = 16;

export function generateArticleId(rawUrl: string): string {
  const normalized = normalizeUrlForDedup(rawUrl);
  const digest = createHash("sha256").update(normalized).digest();
  return toBase36(digest, ID_LENGTH);
}

function toBase36(buffer: Buffer, length: number): string {
  const eight = BigInt(8);
  let value = BigInt(0);
  for (const byte of buffer) {
    value = (value << eight) | BigInt(byte);
  }
  const result = value.toString(36);
  if (result.length >= length) {
    return result.slice(0, length);
  }
  return result.padStart(length, "0");
}

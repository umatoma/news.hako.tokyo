const SECRET_PATTERNS: ReadonlyArray<RegExp> = [
  /Bearer\s+[A-Za-z0-9._\-]+/gi,
  /Authorization\s*[:=]\s*\S+/gi,
  /(?:api[_-]?key|token|secret|password)\s*[:=]\s*['"]?[A-Za-z0-9._\-]+['"]?/gi,
];

export class SecretScrubber {
  scrub(text: string): string {
    let result = text;
    for (const pattern of SECRET_PATTERNS) {
      result = result.replace(pattern, "[REDACTED]");
    }
    return result;
  }
}

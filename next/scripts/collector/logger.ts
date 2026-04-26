import type { SourceId } from "@/lib/article";

import { SecretScrubber } from "./lib/secret-scrubber";

export type LogLevel = "info" | "warn" | "error";

export type LogSource = SourceId | "collector";

export interface LogContext {
  [key: string]: unknown;
}

export interface ReportEntry {
  level: LogLevel;
  source: LogSource;
  message: string;
  context?: LogContext;
  timestamp: string;
}

export interface Logger {
  info(source: LogSource, message: string, context?: LogContext): void;
  warn(source: LogSource, message: string, context?: LogContext): void;
  error(source: LogSource, message: string, context?: LogContext): void;
  getReports(): ReadonlyArray<ReportEntry>;
}

export interface LoggerDeps {
  scrubber?: SecretScrubber;
  now?: () => Date;
  out?: (line: string) => void;
}

export class DefaultLogger implements Logger {
  private readonly scrubber: SecretScrubber;
  private readonly now: () => Date;
  private readonly out: (line: string) => void;
  private readonly reports: ReportEntry[] = [];

  constructor(deps: LoggerDeps = {}) {
    this.scrubber = deps.scrubber ?? new SecretScrubber();
    this.now = deps.now ?? (() => new Date());
    this.out = deps.out ?? ((line) => console.log(line));
  }

  info(source: LogSource, message: string, context?: LogContext): void {
    this.emit("info", source, message, context);
  }

  warn(source: LogSource, message: string, context?: LogContext): void {
    this.emit("warn", source, message, context);
  }

  error(source: LogSource, message: string, context?: LogContext): void {
    this.emit("error", source, message, context);
  }

  getReports(): ReadonlyArray<ReportEntry> {
    return this.reports;
  }

  private emit(
    level: LogLevel,
    source: LogSource,
    message: string,
    context?: LogContext,
  ): void {
    const safeMessage = this.scrubber.scrub(message);
    const safeContext = context ? this.scrubContext(context) : undefined;
    const timestamp = this.now().toISOString();

    this.reports.push({
      level,
      source,
      message: safeMessage,
      context: safeContext,
      timestamp,
    });

    const levelTag = `[${level.toUpperCase()}][${source}]`;
    const ctxText = safeContext ? ` ${formatContext(safeContext)}` : "";
    this.out(`${levelTag} ${safeMessage}${ctxText}`);
  }

  private scrubContext(context: LogContext): LogContext {
    const result: LogContext = {};
    for (const [key, value] of Object.entries(context)) {
      result[key] =
        typeof value === "string" ? this.scrubber.scrub(value) : value;
    }
    return result;
  }
}

function formatContext(context: LogContext): string {
  return Object.entries(context)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(" ");
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return String(value);
  }
  if (typeof value === "string") {
    return /\s/u.test(value) ? JSON.stringify(value) : value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

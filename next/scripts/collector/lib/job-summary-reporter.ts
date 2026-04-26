import { promises as fs } from "node:fs";
import path from "node:path";

import type { SourceId } from "@/lib/article";

export interface PerSourceStat {
  fetched: number;
  skipped: boolean;
  error: string | null;
}

export interface CollectorRunResult {
  schemaVersion: 1;
  ranAt: string;
  totalFetched: number;
  totalNew: number;
  totalDuplicate: number;
  failedSources: SourceId[];
  perSource: Record<SourceId, PerSourceStat>;
  durationMs: number;
}

export interface JobSummaryReporterDeps {
  resultJsonPath: string;
  jobSummaryPath?: string | undefined;
}

export class JobSummaryReporter {
  private readonly resultJsonPath: string;
  private readonly jobSummaryPath: string | undefined;

  constructor(deps: JobSummaryReporterDeps) {
    this.resultJsonPath = deps.resultJsonPath;
    this.jobSummaryPath = deps.jobSummaryPath;
  }

  async emit(result: CollectorRunResult): Promise<void> {
    await this.writeJson(result);
    if (this.jobSummaryPath) {
      await this.appendSummary(result);
    }
  }

  private async writeJson(result: CollectorRunResult): Promise<void> {
    await fs.mkdir(path.dirname(this.resultJsonPath), { recursive: true });
    await fs.writeFile(
      this.resultJsonPath,
      JSON.stringify(result, null, 2),
      "utf8",
    );
  }

  private async appendSummary(result: CollectorRunResult): Promise<void> {
    if (!this.jobSummaryPath) return;
    const md = renderJobSummary(result);
    await fs.appendFile(this.jobSummaryPath, md + "\n", "utf8");
  }
}

export function renderJobSummary(result: CollectorRunResult): string {
  const seconds = (result.durationMs / 1000).toFixed(1);
  const failed = result.failedSources.length === 0
    ? "_none_"
    : result.failedSources.join(", ");
  const rows = (Object.keys(result.perSource) as SourceId[]).map((source) => {
    const stat = result.perSource[source];
    const status = stat.skipped
      ? "⏭️ skipped"
      : stat.error
        ? `❌ ${truncate(stat.error, 80)}`
        : "✅";
    return `| ${source} | ${stat.fetched} | ${status} |`;
  });

  return [
    "## Collector run summary",
    "",
    `- Run at: \`${result.ranAt}\``,
    `- Duration: \`${seconds}s\``,
    `- Total fetched: **${result.totalFetched}**`,
    `- Total new (committed): **${result.totalNew}**`,
    `- Total duplicate: **${result.totalDuplicate}**`,
    `- Failed sources: ${failed}`,
    "",
    "| Source | Fetched | Status |",
    "|---|---:|---|",
    ...rows,
    "",
  ].join("\n");
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

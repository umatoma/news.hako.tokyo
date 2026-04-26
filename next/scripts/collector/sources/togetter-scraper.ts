import { load } from "cheerio";

import type { TogetterConfig } from "@/config/sources";
import type { SourceId } from "@/lib/article";

import { generateArticleId } from "../lib/article-id";
import type { Clock } from "../lib/clock";
import type { HttpClient } from "../lib/http-client";
import type { Logger } from "../logger";
import { errorMessage } from "./rss-mapping";
import type { FetchedArticle, SourceFetcher } from "./source-fetcher";

const TOGETTER_BASE = "https://togetter.com";
const TITLE_MAX_LENGTH = 500;
const SUMMARY_MAX_LENGTH = 1000;

export interface TogetterScraperDeps {
  http: HttpClient;
  logger: Logger;
  clock: Clock;
  sleep?: (ms: number) => Promise<void>;
}

export class TogetterScraper implements SourceFetcher<TogetterConfig> {
  readonly source: SourceId = "togetter";
  private readonly sleep: (ms: number) => Promise<void>;

  constructor(private readonly deps: TogetterScraperDeps) {
    this.sleep = deps.sleep ?? defaultSleep;
  }

  async fetch(config: TogetterConfig): Promise<FetchedArticle[]> {
    if (!config.enabled) return [];

    const all: FetchedArticle[] = [];
    let firstRequest = true;

    for (const url of config.targetUrls) {
      if (!firstRequest && config.requestIntervalMs > 0) {
        await this.sleep(config.requestIntervalMs);
      }
      firstRequest = false;

      try {
        const response = await this.deps.http.get(url);
        if (response.status >= 400) {
          this.deps.logger.warn(this.source, "non-2xx response", {
            url,
            status: response.status,
          });
          continue;
        }
        const items = parseCategoryPage(response.body, url, this.source, this.deps.clock);
        if (items.length === 0) {
          throw new Error(`no items extracted from ${url} (selectors may have changed)`);
        }
        all.push(...items.slice(0, config.maxItemsPerRun));
      } catch (err) {
        this.deps.logger.warn(this.source, "page fetch/parse failed, continuing", {
          url,
          error: errorMessage(err),
        });
      }
    }

    return all.slice(0, config.maxItemsPerRun);
  }
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function parseCategoryPage(
  html: string,
  pageUrl: string,
  source: SourceId,
  clock: Clock,
): FetchedArticle[] {
  const $ = load(html);
  const items: FetchedArticle[] = [];

  const candidates = $('a[href*="/li/"]').toArray();

  for (const element of candidates) {
    const $link = $(element);
    const rawHref = ($link.attr("href") ?? "").trim();
    if (rawHref.length === 0 || !rawHref.includes("/li/")) continue;

    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(rawHref, TOGETTER_BASE).toString();
    } catch {
      continue;
    }

    const title = sanitizeTitle($link.text());
    if (title.length === 0) continue;

    const summary = sanitizeSummary($link.attr("title") ?? "");
    const publishedAt = clock().toISOString();

    items.push({
      id: generateArticleId(absoluteUrl),
      title,
      url: absoluteUrl,
      source,
      publishedAt,
      summary,
      tags: deriveTags(pageUrl),
      thumbnailUrl: null,
    });
  }

  return dedupeByUrl(items);
}

function dedupeByUrl(items: FetchedArticle[]): FetchedArticle[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function deriveTags(pageUrl: string): string[] {
  try {
    const u = new URL(pageUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("category");
    if (idx >= 0 && parts.length > idx + 1) {
      return [parts[idx + 1]!];
    }
  } catch {
    // ignore
  }
  return [];
}

function sanitizeTitle(value: string): string {
  const text = value.replace(/[\r\n]+/gu, " ").trim();
  return text.length > TITLE_MAX_LENGTH ? text.slice(0, TITLE_MAX_LENGTH) : text;
}

function sanitizeSummary(value: string): string {
  const text = value.replace(/[\r\n]+/gu, " ").trim();
  if (text.length <= SUMMARY_MAX_LENGTH) return text;
  return `${text.slice(0, SUMMARY_MAX_LENGTH - 1)}…`;
}

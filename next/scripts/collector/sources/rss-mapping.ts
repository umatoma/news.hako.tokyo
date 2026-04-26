import Parser from "rss-parser";

import type { SourceId } from "@/lib/article";

import { generateArticleId } from "../lib/article-id";
import type { Logger } from "../logger";
import type { FetchedArticle } from "./source-fetcher";

const TITLE_MAX_LENGTH = 500;
const SUMMARY_MAX_LENGTH = 1000;

export type ExtraField = "media:content" | "media:thumbnail" | "enclosure";

export interface RssParseOptions {
  source: SourceId;
  logger: Logger;
  fallbackPublishedAt: () => string;
  customFields?: ReadonlyArray<string | [string, string]>;
}

interface RssItem {
  title?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
  contentSnippet?: string;
  content?: string;
  summary?: string;
  description?: string;
  categories?: string[];
  enclosure?: { url?: string };
  "media:content"?: { $?: { url?: string } };
  "media:thumbnail"?: { $?: { url?: string } };
}

export async function parseRss(
  xml: string,
  options: RssParseOptions,
): Promise<FetchedArticle[]> {
  const customItems = (options.customFields ?? [
    ["media:content", "media:content"],
    ["media:thumbnail", "media:thumbnail"],
  ]) as Array<string | [string, string]>;

  const parser = new Parser({
    customFields: {
      item: customItems as never,
    },
  });

  const feed = await parser.parseString(xml);
  const articles: FetchedArticle[] = [];

  for (const raw of feed.items as RssItem[]) {
    try {
      const article = mapItem(raw, options);
      if (article) {
        articles.push(article);
      }
    } catch (err) {
      options.logger.warn(options.source, "skip malformed item", {
        error: errorMessage(err),
      });
    }
  }

  return articles;
}

function mapItem(
  raw: RssItem,
  options: RssParseOptions,
): FetchedArticle | null {
  const link = trimOrEmpty(raw.link);
  if (link.length === 0) {
    return null;
  }
  const title = sanitizeTitle(raw.title);
  if (title.length === 0) {
    return null;
  }

  const publishedAt = pickPublishedAt(raw, options.fallbackPublishedAt);
  const summary = sanitizeSummary(raw.contentSnippet ?? raw.summary ?? raw.description ?? raw.content ?? "");
  const tags = (raw.categories ?? [])
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  const thumbnailUrl = pickThumbnail(raw);

  return {
    id: generateArticleId(link),
    title,
    url: link,
    source: options.source,
    publishedAt,
    summary,
    tags,
    thumbnailUrl,
  };
}

function trimOrEmpty(value: string | undefined): string {
  return value?.trim() ?? "";
}

function sanitizeTitle(value: string | undefined): string {
  if (!value) return "";
  const text = value.replace(/[\r\n]+/gu, " ").trim();
  return text.length > TITLE_MAX_LENGTH ? text.slice(0, TITLE_MAX_LENGTH) : text;
}

function sanitizeSummary(value: string): string {
  const stripped = stripHtml(value).trim();
  if (stripped.length <= SUMMARY_MAX_LENGTH) {
    return stripped;
  }
  return `${stripped.slice(0, SUMMARY_MAX_LENGTH - 1)}…`;
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/gu, "")
    .replace(/&amp;/gu, "&")
    .replace(/&lt;/gu, "<")
    .replace(/&gt;/gu, ">")
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'")
    .replace(/&nbsp;/gu, " ");
}

function pickPublishedAt(
  raw: RssItem,
  fallback: () => string,
): string {
  const candidate = raw.isoDate ?? raw.pubDate;
  if (candidate) {
    const date = new Date(candidate);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  return fallback();
}

function pickThumbnail(raw: RssItem): string | null {
  const fromEnclosure = raw.enclosure?.url;
  if (fromEnclosure && isValidUrl(fromEnclosure)) {
    return fromEnclosure;
  }
  const fromMediaContent = raw["media:content"]?.$?.url;
  if (fromMediaContent && isValidUrl(fromMediaContent)) {
    return fromMediaContent;
  }
  const fromMediaThumb = raw["media:thumbnail"]?.$?.url;
  if (fromMediaThumb && isValidUrl(fromMediaThumb)) {
    return fromMediaThumb;
  }
  return null;
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

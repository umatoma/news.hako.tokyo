import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { Article, SourceId } from "@/lib/article";
import { fromFrontmatter } from "@/lib/article";

export const SOURCE_LABEL: Record<SourceId, string> = {
  zenn: "Zenn",
  hatena: "はてブ",
  googlenews: "Google ニュース",
  togetter: "Togetter",
};

const DATE_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

export function formatPublishedAt(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}

export function resolveContentDir(): string {
  const env = process.env["CONTENT_DIR"];
  if (env && env.length > 0) {
    return env;
  }
  return path.resolve(process.cwd(), "..", "content");
}

export interface ArticleListItemView {
  id: string;
  title: string;
  url: string;
  sourceId: SourceId;
  sourceLabel: string;
  publishedAtIso: string;
  publishedAtDisplay: string;
}

export function toListItemView(article: Article): ArticleListItemView {
  return {
    id: article.id,
    title: article.title,
    url: article.url,
    sourceId: article.source,
    sourceLabel: SOURCE_LABEL[article.source],
    publishedAtIso: article.publishedAt,
    publishedAtDisplay: formatPublishedAt(article.publishedAt),
  };
}

export function sortArticlesForDisplay(
  articles: ReadonlyArray<Article>,
): Article[] {
  return [...articles].sort((a, b) => {
    const primary = b.publishedAt.localeCompare(a.publishedAt);
    if (primary !== 0) return primary;
    return b.collectedAt.localeCompare(a.collectedAt);
  });
}

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

export function filterArticlesWithinDays(
  articles: ReadonlyArray<Article>,
  days: number,
  now: Date = new Date(),
): Article[] {
  const reference = now.getTime();
  const threshold = reference - days * MILLIS_PER_DAY;
  return articles.filter((a) => Date.parse(a.publishedAt) >= threshold);
}

export interface PageStats {
  totalArticles: number;
  lastUpdatedIso: string | null;
  lastUpdatedDisplay: string | null;
}

export function computePageStats(
  articles: ReadonlyArray<Article>,
): PageStats {
  if (articles.length === 0) {
    return {
      totalArticles: 0,
      lastUpdatedIso: null,
      lastUpdatedDisplay: null,
    };
  }
  let latest = articles[0]!.collectedAt;
  for (const a of articles) {
    if (a.collectedAt > latest) latest = a.collectedAt;
  }
  return {
    totalArticles: articles.length,
    lastUpdatedIso: latest,
    lastUpdatedDisplay: formatPublishedAt(latest),
  };
}

export interface FileReader {
  listMarkdownFiles(dir: string): Promise<string[]>;
  readText(filePath: string): Promise<string>;
  exists(filePath: string): Promise<boolean>;
}

class NodeFileReader implements FileReader {
  async listMarkdownFiles(dir: string): Promise<string[]> {
    if (!(await this.exists(dir))) return [];
    const result: string[] = [];
    await walk(dir, result);
    return result.sort();
  }

  async readText(filePath: string): Promise<string> {
    return fs.readFile(filePath, "utf8");
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }
}

async function walk(dir: string, accumulator: string[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, accumulator);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      accumulator.push(full);
    }
  }
}

export interface ArticleRepository {
  getAllArticles(): Promise<Article[]>;
}

export interface ArticleRepositoryDeps {
  contentDir?: string;
  fileReader?: FileReader;
}

export class FsArticleRepository implements ArticleRepository {
  private readonly contentDir: string;
  private readonly fileReader: FileReader;

  constructor(deps: ArticleRepositoryDeps = {}) {
    this.contentDir = deps.contentDir ?? resolveContentDir();
    this.fileReader = deps.fileReader ?? new NodeFileReader();
  }

  async getAllArticles(): Promise<Article[]> {
    const files = await this.fileReader.listMarkdownFiles(this.contentDir);
    const articles: Article[] = [];
    for (const filePath of files) {
      const text = await this.fileReader.readText(filePath);
      const parsed = matter(text);
      try {
        articles.push(fromFrontmatter(parsed.data));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`Invalid frontmatter in ${filePath}: ${message}`);
      }
    }
    return articles;
  }
}

export const articleRepository: ArticleRepository = new FsArticleRepository();

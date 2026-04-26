import matter from "gray-matter";

import type { Article } from "@/lib/article";
import { ArticleFrontmatterSchema } from "@/lib/article";

import type { FileReader } from "./file-system";
import { normalizeUrlForDedup } from "./url-normalize";

export interface DeduplicatorDeps {
  contentDir: string;
  fileReader: FileReader;
}

export class Deduplicator {
  private readonly contentDir: string;
  private readonly fileReader: FileReader;
  private knownUrls: Set<string> = new Set();
  private initialized = false;

  constructor(deps: DeduplicatorDeps) {
    this.contentDir = deps.contentDir;
    this.fileReader = deps.fileReader;
  }

  async initialize(): Promise<void> {
    const files = await this.fileReader.listMarkdownFiles(this.contentDir);
    const urls = new Set<string>();

    for (const filePath of files) {
      const text = await this.fileReader.readText(filePath);
      const parsed = matter(text);
      const fm = ArticleFrontmatterSchema.parse(parsed.data);
      urls.add(normalizeUrlForDedup(fm.url));
    }

    this.knownUrls = urls;
    this.initialized = true;
  }

  filterNew(candidates: ReadonlyArray<Article>): Article[] {
    if (!this.initialized) {
      throw new Error("Deduplicator must be initialized before filterNew()");
    }

    const seenInBatch = new Set<string>();
    const result: Article[] = [];

    for (const article of candidates) {
      const normalized = normalizeUrlForDedup(article.url);
      if (this.knownUrls.has(normalized)) {
        continue;
      }
      if (seenInBatch.has(normalized)) {
        continue;
      }
      seenInBatch.add(normalized);
      result.push(article);
    }

    return result;
  }

  getKnownUrlCount(): number {
    return this.knownUrls.size;
  }
}

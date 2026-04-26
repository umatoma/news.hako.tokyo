import path from "node:path";

import matter from "gray-matter";

import type { Article } from "@/lib/article";
import { toFrontmatter } from "@/lib/article";

import type { FileSystem } from "./file-system";
import { SlugBuilder } from "./slug-builder";

const MAX_COLLISION_RETRY = 99;

export interface WriteResult {
  written: number;
  skipped: number;
}

export interface MarkdownWriterDeps {
  contentDir: string;
  fileSystem: FileSystem;
  slugBuilder: SlugBuilder;
}

export class MarkdownWriter {
  private readonly contentDir: string;
  private readonly fileSystem: FileSystem;
  private readonly slugBuilder: SlugBuilder;

  constructor(deps: MarkdownWriterDeps) {
    this.contentDir = deps.contentDir;
    this.fileSystem = deps.fileSystem;
    this.slugBuilder = deps.slugBuilder;
  }

  async write(articles: ReadonlyArray<Article>): Promise<WriteResult> {
    if (articles.length === 0) {
      return { written: 0, skipped: 0 };
    }
    await this.fileSystem.ensureDir(this.contentDir);

    let written = 0;
    let skipped = 0;
    for (const article of articles) {
      try {
        const filePath = await this.resolveFilePath(article);
        const content = renderMarkdown(article);
        await this.fileSystem.writeText(filePath, content);
        written += 1;
      } catch {
        skipped += 1;
      }
    }
    return { written, skipped };
  }

  private async resolveFilePath(article: Article): Promise<string> {
    const date = article.publishedAt.slice(0, 10);
    const slug = this.slugBuilder.build(article.title, article.id);
    const baseName = `${date}-${slug}.md`;
    const candidate = path.join(this.contentDir, baseName);

    if (!(await this.fileSystem.exists(candidate))) {
      return candidate;
    }

    for (let n = 2; n <= MAX_COLLISION_RETRY; n += 1) {
      const altName = `${date}-${slug}-${n}.md`;
      const altPath = path.join(this.contentDir, altName);
      if (!(await this.fileSystem.exists(altPath))) {
        return altPath;
      }
    }

    throw new Error(
      `Filename collision exceeded retry limit at ${candidate}`,
    );
  }
}

export function renderMarkdown(article: Article): string {
  const fm = toFrontmatter(article);
  const body = article.summary.length > 0
    ? `# ${article.title}\n\n${article.summary}\n`
    : `# ${article.title}\n`;
  return matter.stringify(body, fm);
}

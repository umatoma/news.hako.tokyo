import { z } from "zod";

export const ARTICLE_SOURCES = [
  "zenn",
  "hatena",
  "googlenews",
  "togetter",
] as const;

export const SourceIdSchema = z.enum(ARTICLE_SOURCES);
export type SourceId = z.infer<typeof SourceIdSchema>;

export const ArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(500),
  url: z.string().url(),
  source: SourceIdSchema,
  publishedAt: z.string().datetime({ offset: true }),
  collectedAt: z.string().datetime({ offset: true }),
  summary: z.string(),
  tags: z.array(z.string()),
  thumbnailUrl: z.string().url().nullable(),
});
export type Article = z.infer<typeof ArticleSchema>;

export const ArticleFrontmatterSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(500),
  url: z.string().url(),
  source: SourceIdSchema,
  published_at: z.string().datetime({ offset: true }),
  collected_at: z.string().datetime({ offset: true }),
  summary: z.string(),
  tags: z.array(z.string()),
  thumbnail_url: z.string().url().nullable(),
});
export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;

export function toFrontmatter(article: Article): ArticleFrontmatter {
  return {
    id: article.id,
    title: article.title,
    url: article.url,
    source: article.source,
    published_at: article.publishedAt,
    collected_at: article.collectedAt,
    summary: article.summary,
    tags: article.tags,
    thumbnail_url: article.thumbnailUrl,
  };
}

export function fromFrontmatter(raw: unknown): Article {
  const fm = ArticleFrontmatterSchema.parse(raw);
  return ArticleSchema.parse({
    id: fm.id,
    title: fm.title,
    url: fm.url,
    source: fm.source,
    publishedAt: fm.published_at,
    collectedAt: fm.collected_at,
    summary: fm.summary,
    tags: fm.tags,
    thumbnailUrl: fm.thumbnail_url,
  });
}

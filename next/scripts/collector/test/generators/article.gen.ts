import * as fc from "fast-check";

import type { Article } from "@/lib/article";
import { ARTICLE_SOURCES } from "@/lib/article";

import { generateArticleId } from "../../lib/article-id";
import { cleanUrlArbitrary } from "./url.gen";

const isoDateArbitrary = fc
  .integer({
    min: new Date("2020-01-01T00:00:00Z").getTime(),
    max: new Date("2030-12-31T23:59:59Z").getTime(),
  })
  .map((ms) => new Date(ms).toISOString());

const titleArbitrary = fc.stringMatching(/^[A-Za-z0-9 .,!?-]{1,200}$/u).filter((s) => s.trim().length > 0);
const summaryArbitrary = fc.stringMatching(/^[A-Za-z0-9 .,!?-]{0,500}$/u);
const tagArbitrary = fc.stringMatching(/^[A-Za-z0-9-]{1,16}$/u);

export const articleArbitrary: fc.Arbitrary<Article> = fc
  .record({
    title: titleArbitrary,
    url: cleanUrlArbitrary,
    source: fc.constantFrom(...ARTICLE_SOURCES),
    publishedAt: isoDateArbitrary,
    collectedAt: isoDateArbitrary,
    summary: summaryArbitrary,
    tags: fc.array(tagArbitrary, { minLength: 0, maxLength: 5 }),
    thumbnailUrl: fc.option(cleanUrlArbitrary, { nil: null }),
  })
  .map(({ title, url, source, publishedAt, collectedAt, summary, tags, thumbnailUrl }) => ({
    id: generateArticleId(url),
    title: title.trim(),
    url,
    source,
    publishedAt,
    collectedAt,
    summary,
    tags,
    thumbnailUrl,
  }));

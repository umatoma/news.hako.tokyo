import * as fc from "fast-check";

import { cleanUrlArbitrary } from "./url.gen";

export interface RssItemFixture {
  title: string;
  link: string;
  isoDate: string;
  summary: string;
  categories: string[];
}

const isoDateArbitrary = fc
  .integer({
    min: new Date("2020-01-01T00:00:00Z").getTime(),
    max: new Date("2030-12-31T23:59:59Z").getTime(),
  })
  .map((ms) => new Date(ms).toISOString());

const titleArbitrary = fc.stringMatching(/^[A-Za-z0-9 .,!?-]{1,200}$/u).filter((s) => s.trim().length > 0);
const summaryArbitrary = fc.stringMatching(/^[A-Za-z0-9 .,!?-]{0,500}$/u);

export const rssItemArbitrary: fc.Arbitrary<RssItemFixture> = fc.record({
  title: titleArbitrary,
  link: cleanUrlArbitrary,
  isoDate: isoDateArbitrary,
  summary: summaryArbitrary,
  categories: fc.array(fc.stringMatching(/^[A-Za-z0-9-]{1,16}$/u), { minLength: 0, maxLength: 5 }),
});

export function renderRssXml(items: ReadonlyArray<RssItemFixture>, channelTitle = "Test Feed"): string {
  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <pubDate>${escapeXml(new Date(item.isoDate).toUTCString())}</pubDate>
      <description>${escapeXml(item.summary)}</description>
      ${item.categories.map((c) => `<category>${escapeXml(c)}</category>`).join("\n      ")}
    </item>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>https://example.com/</link>
    <description>Test feed</description>${itemsXml}
  </channel>
</rss>`;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&apos;");
}

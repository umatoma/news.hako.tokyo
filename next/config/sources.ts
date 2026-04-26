import { z } from "zod";

export const ZennConfigSchema = z.object({
  enabled: z.boolean(),
  feedUrls: z.array(z.string().url()).min(1),
  maxItemsPerRun: z.number().int().positive().default(50),
});
export type ZennConfig = z.infer<typeof ZennConfigSchema>;

export const HatenaConfigSchema = z.object({
  enabled: z.boolean(),
  feedUrls: z.array(z.string().url()).min(1),
  maxItemsPerRun: z.number().int().positive().default(50),
});
export type HatenaConfig = z.infer<typeof HatenaConfigSchema>;

export const GoogleNewsTopicSchema = z.enum([
  "WORLD",
  "NATION",
  "BUSINESS",
  "TECHNOLOGY",
  "ENTERTAINMENT",
  "SPORTS",
  "SCIENCE",
  "HEALTH",
]);
export type GoogleNewsTopic = z.infer<typeof GoogleNewsTopicSchema>;

export const GoogleNewsConfigSchema = z.object({
  enabled: z.boolean(),
  hl: z.string().default("ja"),
  gl: z.string().default("JP"),
  ceid: z.string().default("JP:ja"),
  queries: z.array(z.string().min(1)).default([]),
  topics: z.array(GoogleNewsTopicSchema).default([]),
  geos: z.array(z.string().min(1)).default([]),
  maxItemsPerRun: z.number().int().positive().default(50),
});
export type GoogleNewsConfig = z.infer<typeof GoogleNewsConfigSchema>;

export const TogetterConfigSchema = z.object({
  enabled: z.boolean(),
  targetUrls: z.array(z.string().url()),
  requestIntervalMs: z.number().int().nonnegative().default(5000),
  maxItemsPerRun: z.number().int().positive().default(30),
});
export type TogetterConfig = z.infer<typeof TogetterConfigSchema>;

export const SourceConfigSchema = z.object({
  zenn: ZennConfigSchema,
  hatena: HatenaConfigSchema,
  googlenews: GoogleNewsConfigSchema,
  togetter: TogetterConfigSchema,
});
export type SourceConfig = z.infer<typeof SourceConfigSchema>;

const sourceConfig: SourceConfig = {
  zenn: {
    enabled: true,
    feedUrls: ["https://zenn.dev/feed"],
    maxItemsPerRun: 50,
  },
  hatena: {
    enabled: true,
    feedUrls: ["https://b.hatena.ne.jp/hotentry/it.rss"],
    maxItemsPerRun: 50,
  },
  googlenews: {
    enabled: true,
    hl: "ja",
    gl: "JP",
    ceid: "JP:ja",
    queries: ["AI"],
    topics: ["TECHNOLOGY"],
    geos: [],
    maxItemsPerRun: 50,
  },
  togetter: {
    enabled: true,
    targetUrls: ["https://togetter.com/ranking"],
    requestIntervalMs: 5000,
    maxItemsPerRun: 30,
  },
};

export default sourceConfig;

import * as fc from "fast-check";

const SCHEMES = ["https", "http"];
const HOSTS = [
  "example.com",
  "zenn.dev",
  "b.hatena.ne.jp",
  "togetter.com",
  "news.google.com",
  "example.co.jp",
];
const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "mc_cid",
  "mc_eid",
];
const NORMAL_KEYS = ["q", "page", "id", "ref", "lang"];

const segmentArb = fc.stringMatching(/^[a-zA-Z0-9_-]{1,16}$/u);

export const urlArbitrary = fc
  .record({
    scheme: fc.constantFrom(...SCHEMES),
    host: fc.constantFrom(...HOSTS),
    segments: fc.array(segmentArb, { minLength: 0, maxLength: 5 }),
    trailingSlash: fc.boolean(),
    trackingParams: fc.array(
      fc.tuple(
        fc.constantFrom(...TRACKING_KEYS),
        fc.stringMatching(/^[a-zA-Z0-9_-]{1,12}$/u),
      ),
      { minLength: 0, maxLength: 4 },
    ),
    normalParams: fc.array(
      fc.tuple(
        fc.constantFrom(...NORMAL_KEYS),
        fc.stringMatching(/^[a-zA-Z0-9_-]{1,12}$/u),
      ),
      { minLength: 0, maxLength: 4 },
    ),
    fragment: fc.option(fc.stringMatching(/^[a-zA-Z0-9_-]{1,16}$/u)),
  })
  .map((spec) => buildUrl(spec));

export const cleanUrlArbitrary = fc
  .record({
    scheme: fc.constantFrom(...SCHEMES),
    host: fc.constantFrom(...HOSTS),
    segments: fc.array(segmentArb, { minLength: 1, maxLength: 4 }),
    normalParams: fc.array(
      fc.tuple(
        fc.constantFrom(...NORMAL_KEYS),
        fc.stringMatching(/^[a-zA-Z0-9_-]{1,12}$/u),
      ),
      { minLength: 0, maxLength: 2 },
    ),
  })
  .map((spec) =>
    buildUrl({
      ...spec,
      trailingSlash: false,
      trackingParams: [],
      fragment: null,
    }),
  );

interface UrlSpec {
  scheme: string;
  host: string;
  segments: string[];
  trailingSlash: boolean;
  trackingParams: Array<[string, string]>;
  normalParams: Array<[string, string]>;
  fragment: string | null;
}

function buildUrl(spec: UrlSpec): string {
  const path = spec.segments.length > 0 ? "/" + spec.segments.join("/") : "/";
  const slashed = spec.trailingSlash && spec.segments.length > 0 ? `${path}/` : path;
  const allParams = [...spec.trackingParams, ...spec.normalParams];
  const search = allParams.length > 0 ? "?" + allParams.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&") : "";
  const hash = spec.fragment ? `#${spec.fragment}` : "";
  return `${spec.scheme}://${spec.host}${slashed}${search}${hash}`;
}

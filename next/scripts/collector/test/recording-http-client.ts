import type {
  HttpClient,
  HttpClientGetOptions,
  HttpResponse,
} from "../lib/http-client";

export interface RecordedCall {
  url: string;
  options: HttpClientGetOptions | undefined;
}

export class RecordingHttpClient implements HttpClient {
  readonly calls: RecordedCall[] = [];
  private readonly responses: Map<string, HttpResponse>;
  private readonly fallback: HttpResponse;

  constructor(
    responses: Record<string, HttpResponse | string>,
    fallback?: HttpResponse,
  ) {
    this.responses = new Map(
      Object.entries(responses).map(([k, v]) => [
        k,
        typeof v === "string"
          ? { status: 200, body: v, headers: {} }
          : v,
      ]),
    );
    this.fallback = fallback ?? { status: 404, body: "not found", headers: {} };
  }

  async get(url: string, options?: HttpClientGetOptions): Promise<HttpResponse> {
    this.calls.push({ url, options });
    const direct = this.responses.get(url);
    if (direct) return direct;
    for (const [pattern, response] of this.responses) {
      if (url.startsWith(pattern)) return response;
    }
    return this.fallback;
  }
}

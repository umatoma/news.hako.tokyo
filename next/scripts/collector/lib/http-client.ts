export interface HttpResponse {
  readonly status: number;
  readonly body: string;
  readonly headers: Record<string, string>;
}

export interface HttpClientGetOptions {
  readonly headers?: Record<string, string>;
  readonly timeoutMs?: number;
}

export interface HttpClient {
  get(url: string, options?: HttpClientGetOptions): Promise<HttpResponse>;
}

const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36";

export class DefaultHttpClient implements HttpClient {
  async get(url: string, options: HttpClientGetOptions = {}): Promise<HttpResponse> {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const headers: Record<string, string> = {
      "User-Agent": DEFAULT_USER_AGENT,
      ...options.headers,
    };

    const response = await fetch(url, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(timeoutMs),
    });

    const body = await response.text();
    const headerEntries: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headerEntries[key] = value;
    });

    return {
      status: response.status,
      body,
      headers: headerEntries,
    };
  }
}

export const defaultHttpClient: HttpClient = new DefaultHttpClient();

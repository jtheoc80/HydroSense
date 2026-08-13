import { CATALOG_VERSION, PUBLIC_API_VERSION } from "./catalog";

export const MAX_PUBLIC_REQUEST_BYTES = 16 * 1024;

export const PUBLIC_GET_CACHE_CONTROL =
  "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

export const PUBLIC_POST_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
} as const;

export class PublicRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function readBoundedJson(request: Request): Promise<unknown> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_PUBLIC_REQUEST_BYTES) {
    throw new PublicRequestError(413, "request_too_large", "Request body exceeds 16 KiB");
  }

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_PUBLIC_REQUEST_BYTES) {
    throw new PublicRequestError(413, "request_too_large", "Request body exceeds 16 KiB");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new PublicRequestError(400, "invalid_json", "Request body must be valid JSON");
  }
}

export function publicJson(
  payload: unknown,
  options: { status?: number; cacheControl?: string } = {},
): Response {
  return new Response(JSON.stringify(payload), {
    status: options.status ?? 200,
    headers: {
      "Cache-Control": options.cacheControl ?? PUBLIC_GET_CACHE_CONTROL,
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function publicError(
  status: number,
  code: string,
  message: string,
  details?: unknown,
): Response {
  return publicJson(
    {
      apiVersion: PUBLIC_API_VERSION,
      catalogVersion: CATALOG_VERSION,
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status, cacheControl: "no-store" },
  );
}

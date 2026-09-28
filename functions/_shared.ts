export interface Env {
  TOOLS_DB: D1Database;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  OAUTH_REDIRECT_URI?: string;
  SESSION_SECRET?: string;
  ALLOWED_EMAIL_DOMAIN?: string;
}

export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(data), {
    ...init,
    headers,
  });
}

export function notImplemented(feature: string) {
  return json(
    {
      error: 'not_implemented',
      feature,
    },
    { status: 501 },
  );
}

import { json, type Env } from './_shared';

interface ShortUrlRow {
  id: number;
  destination_url: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const slug = String(params.slug ?? '');

  if (!slug) {
    return json({ error: 'missing_slug' }, { status: 400 });
  }

  const row = await env.TOOLS_DB.prepare(
    `SELECT id, destination_url
       FROM short_urls
      WHERE slug = ? AND active = 1
      LIMIT 1`,
  )
    .bind(slug)
    .first<ShortUrlRow>();

  if (!row) {
    return json({ error: 'short_url_not_found' }, { status: 404 });
  }

  return Response.redirect(row.destination_url, 302);
};

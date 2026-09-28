CREATE TABLE IF NOT EXISTS sessions (
  id_hash TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_profile_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  expires_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_expires_at_idx
  ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS short_urls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS short_urls_creator_email_idx
  ON short_urls (creator_email);

CREATE TABLE IF NOT EXISTS short_url_clicks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  short_url_id INTEGER NOT NULL,
  slug TEXT NOT NULL,
  clicked_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  ip_hash TEXT,
  FOREIGN KEY (short_url_id) REFERENCES short_urls (id)
);

CREATE INDEX IF NOT EXISTS short_url_clicks_short_url_id_idx
  ON short_url_clicks (short_url_id);

CREATE INDEX IF NOT EXISTS short_url_clicks_clicked_at_idx
  ON short_url_clicks (clicked_at);

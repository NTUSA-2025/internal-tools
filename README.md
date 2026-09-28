# NTUSA Internal Tools

Nx monorepo for small NTUSA internal tools.

## Stack

- Nx 23 with `pnpm`
- React + Vite portal app in `apps/portal`
- Cloudflare Pages Functions in `functions`
- Cloudflare D1 binding `TOOLS_DB`
- shadcn-style shared UI primitives in `libs/ui`

## Tools

- QR code: login required, frontend-only scaffold
- Short URL: login required for management, public redirect endpoint scaffold
- Document generator: login required, frontend-only scaffold
- PDF tools: public, frontend-only scaffold

## Commands

```sh
pnpm nx build portal
pnpm nx lint portal
pnpm nx test portal
pnpm nx typecheck portal
```

Do not run `npm run dev`, Playwright, deploy commands, or production data
operations unless explicitly requested.

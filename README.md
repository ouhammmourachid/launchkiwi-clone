# LaunchDunes

LaunchDunes — a product launch board for makers worldwide and across MENA: **Next.js 16** (App Router) frontend on a **PocketBase 0.40** backend.

## Quick start

```bash
npm install
cp .env.example .env.local        # then fill in PB_ADMIN_PASSWORD (see below)
npm run pb                        # PocketBase on http://127.0.0.1:8090 (applies migrations + hooks)
./pb/pocketbase superuser upsert admin@launchkiwi.local '<password>' --dir pb/pb_data
npm run seed                      # load test data (idempotent)
npm run dev                       # http://localhost:3000
```

Demo login after seeding: `demo@launchkiwi.local` / `launchkiwi-demo`.

| Script | What it does |
|---|---|
| `npm run pb` | Runs PocketBase with `pb/pb_migrations` and `pb/pb_hooks` |
| `npm run seed` | Upserts categories, tags, launch weeks, ~40 products (with logos), editorial reviews, comments, pricing plans, demo users |
| `npm run scrape:launchkiwi` | Re-scrapes sample data from launchkiwi.com into `pb/seed/launchkiwi.json` (test data only) |
| `npm run typecheck` / `npm run lint` | Static checks |
| `npx playwright test` | E2E specs in `tests/` (needs `pb` + `dev` running) |

## Environment

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_PB_URL` | Browser + server PocketBase client |
| `PB_ADMIN_EMAIL`, `PB_ADMIN_PASSWORD` | `scripts/seed.mjs` only — never exposed to the browser |

## Architecture

```
app/                    routes (server components fetch public data; see below)
components/             UI — ui/ primitives, products/, auth/, layout/, …
hooks/                  client state: use-auth, use-upvote, use-favorites, use-comments, …
lib/pb/                 PocketBase client (per-request on server, singleton in browser) + error helpers
lib/api/                service layer — the only code that talks to PocketBase
lib/types/              records.ts (raw PB shapes) and models.ts (UI view models)
lib/validation/         zod schemas for every form
pb/pb_migrations/       schema changes (versioned, applied on `pb` start)
pb/pb_hooks/            server-side business rules (JS hooks)
scripts/                scraper + seed
```

- **Public pages** (home, browse, product, reviews, pricing) render on the server from PocketBase.
- **Personal state** (session, votes, favorites, comments) lives on the client via React Query. PocketBase's SDK keeps the session in `localStorage`.
- **Browse filters** are URL search params, so results are shareable and server-rendered.

### Server-side rules (`pb/pb_hooks/main.pb.js`)

- Upvotes: one per user per product (unique index); counters are updated atomically in SQL on vote create/delete.
- Product submission: forces safe defaults (published, free plan, zero counters, unique slug), rejects duplicate URLs, records a submission and a launch-week entry.
- Makers can edit copy but not counters, moderation or paid-placement fields.
- Users can't grant themselves `is_admin`; comments and favorites are always owned by the caller.
- User-written reviews go to moderation, since published reviews are rendered as HTML.
- Newsletter subscribe is idempotent.

Payments (paid listing plans, advertising checkout) are intentionally not implemented; those buttons are disabled.

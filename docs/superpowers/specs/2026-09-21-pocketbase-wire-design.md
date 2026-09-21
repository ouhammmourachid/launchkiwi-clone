---
name: pocketbase-wire-design
description: "Architectural spec for wiring PocketBase (full schema, 20 collections, local at 127.0.0.1:8090) to Next.js 16 frontend with best practices (SDK, React Query, Zod, env, auth, service layer)."
metadata: 
  node_type: memory
  type: project
  created: 2026-09-21
  originSessionId: 9bc64758-ad2f-4bf2-8f0f-df5b88e1a449
  modified: 2026-09-21T10:43:43.160Z
---

# Design: PocketBase Backend → Next.js Frontend Wire

## Classification
Architectural. New data subsystem with auth, service layer, state management, type safety, and multi-page integration across 20 collections.

## Context
- Schema: `launchkiwi_pocketbase_schema_full.json` (20 collections: users/auth, categories, tags, products, launch_weeks, launch_entries, votes, reviews, favorites, product_claims, badge_verifications, submissions, pricing_plans, payments, ad_plans, advertisements, subscribers, newsletter_campaigns, blog_categories, blog_posts)
- PocketBase running at `http://127.0.0.1:8090`
- Frontend: Next.js 16.3.5, React 19, Tailwind 4, TypeScript 5, App Router (`app/` directory)
- Existing pages modified: `browse`, `launch`, `reviews`, `advertise`, `pricing`, `page` (home)

## Approaches Considered

**A: Server Components only** — Direct `fetch` in RSC. Simple, zero lib overhead. Cons: auth requires cookies/headers complexity; interactive pages (votes, favorites) need client hydration anyway.

**B: Client-only React Query** — Single pattern everywhere. Cons: SEO/content pages lose server rendering; more JavaScript shipped.

**C: Hybrid (RECOMMENDED)** — Server Components for public listings (browse, launch) with `fetch`; Client + React Query for auth-aware / interactive pages (reviews, favorites, votes, submissions). Best UX + SEO + simplicity.

Selected: **C — Hybrid**.

## Architecture

```
.env.local → NEXT_PUBLIC_PB_URL=http://127.0.0.1:8090
         ↓
lib/pb/client.ts → PocketBase SDK instance (singleton, env-configured)
         ↓
lib/api/ → service modules per domain (products.ts, auth.ts, reviews.ts)
         ↓
lib/types/ → Zod schemas + TypeScript interfaces derived from PB collections
         ↓
context/auth.tsx → AuthContext (PB auth store + token persistence)
         ↓
components/ui/ + pages/ → Consume via hooks (useProducts) or direct service calls
```

## Best-Practice Stack (Confirmed)
- `pocketbase` SDK for typed client
- `@tanstack/react-query` for server state / caching
- `zod` for input/output validation
- `dotenv` / `.env.local` for env (not committed)
- `next.config.ts` for image domains / headers
- `lib/` directory convention (not scattered in components)

## Data Flow by Feature

| Feature | Pages | Endpoint Pattern | Strategy |
|---|---|---|---|
| Products / Browse | `browse` | `pb.collection('products').getList()` + expand `category`, `tags`, `maker` | Server fetch + RSC |
| Launch Weeks | `launch` | `pb.collection('launch_weeks').getFullList()` + `launch_entries` | Server fetch |
| Reviews | `reviews` | `pb.collection('reviews').getList()` (filter `status='published'`) + expand `product`, `author` | Client + Query + Auth |
| Auth | All | `pb.authWithPassword()`, `pb.collection('users').create()` | AuthContext + Client |
| Favorites | User | `pb.collection('favorites').getList()` (filter `user=@request.auth.id`) | Client + Auth |
| Votes | Products | `pb.collection('votes').getList()` (filter `product`) + create | Client + Auth (visit-hash for anon) |
| Submissions | Admin / Form | `pb.collection('submissions').getList()` / `.create()` | Client + Auth |
| Ads / Pricing | `advertise`, `pricing` | `pb.collection('advertisements')`, `pricing_plans`, `ad_plans` | Hybrid |
| Blog / Newsletter | Pages | `blog_posts`, `subscribers`, `newsletter_campaigns` | Server fetch |

## Security / Rules Note
PocketBase rules are in schema (e.g., `products` create `@request.auth.id != ''`, list open, update by maker/admin). The frontend must pass `pb.authStore.token` for protected endpoints and handle `403` gracefully in service layer.

## File Plan (Implementation Target)
- `.env.local` (new, uncommitted)
- `lib/pb/client.ts`
- `lib/types/pocketbase.ts` (types + zod)
- `lib/api/*.ts` (service layer)
- `context/auth.tsx`
- Page updates (`app/browse/page.tsx`, `app/launch/page.tsx`, `app/reviews/page.tsx`, etc.)
- Component updates (review cards, product rows, sidebar widgets)

## Open Questions Resolved
- Fetch: Client + React Query for interactive; Server for listings
- Auth: Full flow (login, register, token persistence, protected routes)
- Stack: SDK + Query + Zod + env (full)
- Scope: Discovery + User + Admin pages first; content/newsletter included
- Config: Env-configured (`NEXT_PUBLIC_PB_URL`)

## Approval
Awaiting user approval of this spec before writing implementation plan.

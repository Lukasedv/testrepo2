# My App – Next.js 14

A full-stack web application built with [Next.js 14](https://nextjs.org/) (App Router), TypeScript, and Tailwind CSS.

## Features

- **App Router** – file-based routing under `app/`
- **Server-Side Rendering (SSR)** – dashboard page rendered fresh on every request
- **Static Site Generation (SSG)** – home page generated at build time
- **Incremental Static Regeneration (ISR)** – blog pages regenerated every 60 seconds
- **API Routes** – health check and on-demand revalidation endpoints
- **Edge Middleware** – authentication guard for protected routes
- **Custom Error Pages** – branded 404 and 500 pages
- **Image Optimisation** – via `next/image`
- **Environment Configuration** – server secrets vs. public variables

## Project Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (SSG)
│   ├── not-found.tsx           # Custom 404 page
│   ├── error.tsx               # Custom error page
│   ├── (auth)/
│   │   └── login/page.tsx      # Login page
│   ├── blog/
│   │   ├── page.tsx            # Blog listing (ISR)
│   │   └── [slug]/page.tsx     # Blog post (ISR + generateStaticParams)
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard (SSR, auth-protected)
│   └── api/
│       ├── health/route.ts     # GET /api/health
│       └── revalidate/route.ts # POST /api/revalidate (token-protected)
├── components/                 # Shared UI components
├── lib/                        # Utilities, helpers, DB clients
├── middleware.ts               # Edge middleware (auth guard)
├── public/                     # Static assets
├── next.config.mjs             # Next.js configuration
├── .env.example                # Environment variable documentation
└── tsconfig.json               # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Lukasedv/testrepo2.git
cd testrepo2

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local and fill in your secrets

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimised production build |
| `npm start` | Start the production server (requires `build` first) |
| `npm run lint` | Run ESLint with the Next.js ruleset |

## Environment Variables

See [`.env.example`](./.env.example) for a full list of required and optional variables.

| Variable | Required | Visibility | Description |
|---|---|---|---|
| `REVALIDATE_SECRET` | Yes | Server-only | Token that authorises `POST /api/revalidate` |
| `SESSION_SECRET` | Yes | Server-only | Used to sign/verify session cookies |
| `NEXT_PUBLIC_APP_URL` | No | Public | Canonical base URL of the app |

> **Never** commit `.env.local` to version control.

## API Endpoints

### `GET /api/health`
Returns a `200 OK` JSON response with server timestamp. Use this as a liveness/readiness probe.

```json
{ "status": "ok", "timestamp": "2026-03-14T12:00:00.000Z" }
```

### `POST /api/revalidate`
Triggers on-demand ISR revalidation. Requires the `x-revalidate-secret` header.

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: <REVALIDATE_SECRET>" \
  -d '{"path": "/blog"}'
```

## Deployment

### Vercel (recommended)

1. Push to GitHub.
2. Import the repository in [Vercel](https://vercel.com/).
3. Set environment variables in the Vercel dashboard.
4. Every push to `main` triggers an automatic deployment.

### Docker / Self-hosted

```bash
# Build the Docker image
docker build -t myapp .

# Run the container
docker run -p 3000:3000 \
  -e REVALIDATE_SECRET=<secret> \
  -e SESSION_SECRET=<secret> \
  myapp
```

## Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 90 |
| LCP | < 2.5 s |
| CLS | < 0.1 |
| TTFB (SSG) | < 100 ms |
| TTFB (SSR) | < 400 ms |
| Initial JS bundle (gzipped) | < 150 KB |

## Authentication

Protected routes (e.g. `/dashboard`) are guarded by `middleware.ts` running at the edge. Unauthenticated requests are redirected to `/login`. The middleware checks for a `session_token` cookie. In production, integrate a proper auth provider (e.g. [Auth.js](https://authjs.dev/), Clerk, Supabase Auth) and validate the session token cryptographically.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/my-feature`.
3. Commit your changes: `git commit -m "feat: add my feature"`.
4. Push to the branch and open a pull request.

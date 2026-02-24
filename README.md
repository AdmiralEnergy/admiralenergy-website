# Admiral Energy Website

Portable Energy Autonomy and Home Resilience site for North Carolina homeowners.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Snipcart (CDN integration)
- MDX blog (`next-mdx-remote`)
- Netlify deployment (`@netlify/plugin-nextjs`)

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and set values:

```bash
NEXT_PUBLIC_SITE_URL=https://admiralenergy.ai
NEXT_PUBLIC_SNIPCART_API_KEY=your_snipcart_public_api_key
```

- `NEXT_PUBLIC_SITE_URL` is used for sitemap, robots, metadata base URL, and Snipcart canonical product URLs.
- `NEXT_PUBLIC_SNIPCART_API_KEY` is required for cart and checkout.

## Build

```bash
npm run build
npm run start
```

## Netlify Notes

- `netlify.toml` uses `@netlify/plugin-nextjs`.
- Legacy `.html` routes are redirected to new App Router routes.
- Contact page includes hidden static forms so Netlify Forms can detect both inquiry forms at build time.

## Content Paths

- Routes: `src/app/*`
- Shared UI: `src/components/*`
- Product data: `src/data/products.ts`
- Blog posts: `src/content/blog/*.mdx`

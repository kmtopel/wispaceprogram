# Wi Space Program

Band website built with Next.js 15, React 19, and Tailwind CSS v4.

## Project Structure

- `wisp/` — Next.js application (App Router)
  - `src/app/` — pages, layouts, API routes
  - `public/` — static assets
- JavaScript (not TypeScript)
- Turbopack for dev and build

## Development

```bash
cd wisp
npm run dev     # dev server with Turbopack
npm run build   # production build
npm start       # start production server
```

## Integrations (planned)

- **Sanity** — headless CMS (multiple editors)
- **Bandcamp** — embedded player (iframe)
- **Bandsintown** — events via API (not widget embed)
- **Brevo** — newsletter subscriptions via API (not embed)
- **YouTube** — video embeds
- **Google reCAPTCHA** — form protection

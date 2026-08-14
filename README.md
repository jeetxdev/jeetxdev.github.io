# jeetm.dev

Jeet Mukherjee's personal portfolio — a single-page site built with Vite, React and TypeScript,
styled with Tailwind CSS v4. Deployed as a static build to GitHub Pages.

The design (deep-navy "glass and dark," an animated background, and a streaming JSON "API
playground" centerpiece) is documented in [`docs/design/README.md`](docs/design/README.md).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the site. Vite hot-reloads on save.

## Scripts

- `npm run dev` — start the dev server.
- `npm run build` — type-check and build the static site into `dist/`.
- `npm run preview` — serve the production build locally.
- `npm run lint` — run ESLint.

## Deployment

Pushes to `main` trigger [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds the site and publishes `dist/` to GitHub Pages.

# jeetm.dev

Jeet Mukherjee's personal portfolio - a two-page site built with Vite, React and TypeScript,
styled with Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see the site. Vite hot-reloads on save.

## Scripts

- `npm run dev` - start the dev server.
- `npm run build` - type-check and build the static site into `dist/`.
- `npm run preview` - serve the production build locally.
- `npm run lint` - run ESLint.

## Pages

- `index.html` - the portfolio (sheet 1).
- `projects/index.html` - side projects (sheet 2), served at `/projects/`.

To add a project, add an entry to `PROJECTS` in `src/data/projects.ts`. The first one is
featured on the projects page and the first three show on the home page. Put screenshots in
`public/projects/` and point the project's `image` at them.

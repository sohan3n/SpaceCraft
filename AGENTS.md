<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project

Single-package Next.js 16.4.6 App Router site ("StudioSpace", a studio-booking marketing site). No monorepo, no tests, no CI. Source lives entirely under `src/` (`src/app` routes, `src/components`, `src/lib`).

## Commands

```bash
npm run dev      # next dev (also (re)writes the generated block above)
npm run lint     # biome check — lint + format check + import-organize assist
npm run format   # biome format --write
npx tsc --noEmit # typecheck (no npm script exists)
```

Verify with `npm run lint && npx tsc --noEmit && npm run build` before finishing.

## Tooling quirks

- **Biome only.** No ESLint/Prettier configs exist — don't add them. 2-space indent (see `biome.json`).
- **Tailwind CSS v4, no config file.** Theme tokens live in `src/app/globals.css` (`@theme` blocks + shadcn CSS variables); CSS is processed through the `@tailwindcss/turbopack` loader rule in `next.config.ts` (Turbopack only).
- **`cn` comes from the `cn` npm package**, re-exported by `src/lib/utils.ts`. Import `cn` from `@/lib/utils`; do not add `clsx`/`tailwind-merge`.
- **Path alias:** `@/*` → `src/*`.
- **shadcn** (`components.json`) uses style `base-nova` (Base UI primitives, not Radix-only). Components live in `src/components/ui`; the `utils` alias is `@/lib/utils`.

## Next 16 specifics

- `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true` — caching/data-fetching semantics differ from older Next.js. Check `node_modules/next/dist/docs/01-app/` before writing data-fetching, caching, or `use cache` code.
- Fonts are wired in `src/app/layout.tsx` via `next/font`: Inter → `--font-sans`, Plus Jakarta Sans → `--font-heading` (consumed in `globals.css`).
- Theming: `next-themes` with `attribute="class"` (`src/components/theme-provider.tsx`); Tailwind dark mode is the `.dark` custom variant in `globals.css`.

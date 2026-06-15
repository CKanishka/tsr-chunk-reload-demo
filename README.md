# TanStack Router + Rspack chunk reload demo

Minimal Rspack + TanStack Router app to reproduce stale `ChunkLoadError` after a rebuild/deploy.

## Branches

| Branch | Behavior |
|--------|----------|
| **`main`** (current) | Vanilla `@tanstack/router-core@1.167.1` — `ChunkLoadError` is **not** detected; navigation fails with an uncaught error |
| **`fix/chunk-load-retry`** | pnpm patch on `router-core` extending `isModuleNotFoundError` for Rspack/Webpack — one-time auto-reload via native `lazyRouteComponent` |

```bash
git checkout main                  # broken (upstream today)
git checkout fix/chunk-load-retry  # patched fix
```

After switching branches, always run `pnpm install` (patch changes resolved dependencies).

## Setup

```bash
pnpm install
```

## Routes

| Path | Type |
|------|------|
| `/` | Home (keep this tab open during tests) |
| `/about` | Lazy — `autoCodeSplitting` |
| `/dashboard` | Lazy |
| `/settings` | Lazy |

## Reproduce stale chunk (both branches)

**Terminal 1** — build and serve:

```bash
pnpm build
pnpm preview
```

Open http://localhost:3333 and stay on **Home** (do not refresh).

**Terminal 2** — simulate a deploy (change a lazy route, then rebuild):

```bash
# edit any lazy route file, e.g. src/components/SettingsPage.tsx
pnpm build
```

**Browser** — without refreshing, click **About**, **Dashboard**, or **Settings**.

### Expected on `main` (broken)

- `ChunkLoadError: Loading chunk … failed` in console
- Route does not load; **no** auto-reload

### Expected on `fix/chunk-load-retry`

- Brief `ChunkLoadError` in console
- **One** full page reload
- Route loads successfully

Clear stale reload guards between runs:

```js
Object.keys(sessionStorage)
  .filter(k => k.startsWith("tanstack_router_reload:"))
  .forEach(k => sessionStorage.removeItem(k));
```

## Patch (fix branch only)

Extends `isModuleNotFoundError` in `@tanstack/router-core` to recognize:

- `error.name === "ChunkLoadError"`
- `error.message.startsWith("Loading chunk")`

Upstream only handles native ESM (Vite) error strings today.

## Stack

- Rspack 1.7
- TanStack Router 1.167.1, `autoCodeSplitting: true`
- `@tanstack/router-plugin` 1.166.10

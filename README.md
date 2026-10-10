# Multiscale Modeling

An **extensible** English-language introduction site for multiscale materials modeling: prose intros, refined WebGL visuals, and lightweight in-browser compute demos.

## Stack

| Concern | Choice | Notes |
|---------|--------|--------|
| UI / routing | React + Vite + TypeScript | Shell + module registry |
| Browser compute | TypeScript (WASM-ready later) | Shared `ComputeDemo` contract |
| Rendering | Three.js (WebGL) | ACES tone mapping, PBR materials via `mountSimpleScene` |
| Deploy | GitHub Pages | **Only** on `vX.Y` tags |

## Add a module

1. Create `src/modules/<id>/index.ts` exporting a `ModelingModule` (`intro` required; `render` / `compute` optional).
2. `registerModule(...)` in `src/modules/index.ts`.
3. No router, layout, or CI changes needed.

See [`src/core/types.ts`](src/core/types.ts).

Built-ins: `dft` · `ms` · `neb` · `md` · `thermo` · `fem`.

## Local development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

For a GitHub Pages **project** site:

```bash
VITE_BASE=/MultiscaleModeling/ npm run build
```

## Deploy (tags only)

Workflow: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

- Triggers on tags matching `v[0-9]+.[0-9]+*` (e.g. `v0.1`, `v1.0.0`)
- Ordinary commits / PRs do **not** deploy

```bash
git tag v0.1.0
git push origin v0.1.0
```

Set Pages source to **GitHub Actions** in repo Settings.

## Layout

```
src/
  core/           # types, registry, render host, compute helpers
  components/     # shared Intro / Render / Compute hosts
  modules/        # independent topic modules
  pages/          # overview + module page
  styles/         # light theme
```

## License

GPL-3.0 — see [LICENSE](LICENSE)

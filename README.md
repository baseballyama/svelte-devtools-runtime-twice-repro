# svelte-devtools-runtime-twice-repro

A devtools runtime passed to `compilerOptions.experimental.devtools` can be evaluated twice in a Vite app. When that happens, the copy imported by the app's own components gets no devtools events.

Svelte: [`sveltejs/svelte@577c897`](https://github.com/sveltejs/svelte/tree/577c8973239b38ed8a33397970ec10220a5a7ec1) (`emit-dev-events` branch). Vite 8.3.5, vite-plugin-svelte 7.3.1.

## Run

```sh
pnpm install
pnpm dev:abs        # then open the printed URL
```

The page shows how many times the runtime was evaluated, and how many `componentCreated` events each copy received.

## Results

| script | `experimental.devtools` | evaluated | copy #1 (app) | copy #2 (inside `ui-lib` bundle) |
| --- | --- | --- | --- | --- |
| `dev:abs` | absolute path | 2 times | **0 events** | 5 events |
| `dev:bare` | bare specifier, installed package | once | 5 events | - |
| `dev:linked` | bare specifier, linked package (like `workspace:*`) | 2 times | **0 events** | 5 events |
| `dev:abs-fixed` | absolute path, runtime keeps its state on `globalThis` | 2 times | 5 events | 0 events |

## Why

1. The compiler adds `import '<runtime>'` to every compiled component, including the ones in `node_modules`.
2. `ui-lib` is a Svelte library in `node_modules`, so vite-plugin-svelte pre-bundles it. The bundler copies the runtime into `node_modules/.vite/deps/ui-lib.js`.
3. `src/App.svelte` is not pre-bundled, so it loads the runtime from its own URL. Now the browser has two copies with separate module state.
4. Both copies call `listen({ name: 'my-devtools' })`. There is only one Svelte, and `listen` replaces a plugin with the same name, so the copy evaluated last (the one in `ui-lib`) wins.

`dev:bare` works because the runtime package itself is pre-bundled, so both sides share one chunk. On a cold start it causes one extra page reload ("optimized dependencies changed"), because Vite's dependency scan can't see imports that the compiler adds.

## Files

- `packages/devtools-runtime/runtime.js`: the runtime, written the way a plugin naturally would.
- `packages/devtools-runtime/runtime-fixed.js`: only the first evaluation subscribes, and later copies reuse its state.
- `packages/ui-lib`: a Svelte library installed with `file:`, so it is pre-bundled.
- `packages/devtools-runtime-linked`: the same runtime installed with `link:`, so it is not pre-bundled.

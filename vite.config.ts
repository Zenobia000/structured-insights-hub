// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  // Note: tried tanstackStart.prerender for landing `/` (would let
  // Cloudflare cache static HTML at the edge). Failed because the
  // bundled cloudflare preset emits `worker-entry-*.js`, but the
  // prerender plugin self-fetches via a Node-style `dist/server/server.js`
  // entry that doesn't exist under this preset.
  // Tracking this as a known limitation in docs/perf/2026-05-03-baseline.md.
  // Workaround for the same goal: enable Cloudflare HTML caching for `/`
  // at the worker layer (not a vite-time change).
  vite: {
    plugins: [
      // Bundle visualizer — produces dist/stats.html on every build.
      // Only emits when bundle is generated (i.e. `npm run build`), so dev is unaffected.
      // gzipSize/brotliSize give realistic transfer numbers.
      // Note: TanStack Start runs build twice (client + cloudflare server worker).
      // The server pass overwrites stats.html — the file therefore reflects the
      // server bundle, which is what matters for Cloudflare Worker size limits.
      visualizer({
        filename: "dist/stats.html",
        gzipSize: true,
        brotliSize: true,
        template: "treemap",
      }) as never,
    ],
    build: {
      rollupOptions: {
        output: {
          // Split commonly-shared vendor code into its own long-cached chunk.
          // Business code changes frequently; these libraries change rarely
          // (weeks/months between updates). After a deploy, returning users
          // re-download only the changed app chunk and reuse cached vendors.
          //
          // Keep these conservative — over-splitting hurts HTTP/2 multiplexing
          // and can fragment shared deps across chunks.
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return undefined;
            // React core
            if (id.match(/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/)) {
              return "react-vendor";
            }
            // TanStack ecosystem (router + query + start)
            if (id.match(/[\\/]node_modules[\\/]@tanstack[\\/]/)) {
              return "tanstack-vendor";
            }
            // Radix UI primitives (many small packages, group together)
            if (id.match(/[\\/]node_modules[\\/]@radix-ui[\\/]/)) {
              return "radix-vendor";
            }
            // Lucide icons — only what's actually imported (tree-shaken),
            // but worth isolating since the icons that ARE used are stable.
            if (id.match(/[\\/]node_modules[\\/]lucide-react[\\/]/)) {
              return "icons-vendor";
            }
            // Motion library (framer-motion successor) — only used for
            // MotionConfig wrapper + AnimatePresence; isolate so it caches
            // independently of app code (rarely changes).
            if (id.match(/[\\/]node_modules[\\/](motion|framer-motion)[\\/]/)) {
              return "motion-vendor";
            }
            // Markdown renderer — only used by MarkdownView in worksheet
            // result + a couple cards. Already large enough to chunk alone.
            if (id.match(/[\\/]node_modules[\\/]marked[\\/]/)) {
              return "marked-vendor";
            }
            return undefined;
          },
        },
      },
    },
  },
});

// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
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
            return undefined;
          },
        },
      },
    },
  },
});

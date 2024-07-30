import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    clean: true,
    dts: true,
    sourcemap: true,
    format: ["cjs", "esm"],
    external: ["react"],
  },
  {
    entry: ["src/client/index.ts"],
    outDir: "dist/client",
    banner: {
      js: "'use client'",
    },
    format: ["cjs", "esm"],
    external: ["react"],
    dts: true,
    sourcemap: true,
  },
]);

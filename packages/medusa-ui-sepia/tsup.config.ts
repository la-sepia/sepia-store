import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    dts: true,
    target: "es2019",
    entry: ["src/ui/index.ts"],
    outDir: "dist/ui",
    format: ["cjs", "esm"],
    banner: {
      js: "'use client'",
    },
    external: ["react", /medusa-ui-sepia/, "@medusajs/medusa", "@medusajs/medusa-js"],
  },
  {
    clean: true,
    dts: true,
    target: "es2019",
    entry: ["src/rsc/index.ts"],
    outDir: "dist/rsc",
    format: ["cjs", "esm"],
    external: ["react", /medusa-ui-sepia/, "@medusajs/medusa", "@medusajs/medusa-js"],
  },
]);

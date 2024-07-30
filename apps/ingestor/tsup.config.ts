import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/main.ts"],
    clean: true,
    dts: true,
    sourcemap: true,
    format: ["cjs", "esm"],
  },
]);

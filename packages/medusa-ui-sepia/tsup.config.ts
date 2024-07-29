import { defineConfig } from "tsup";

export default defineConfig([
  {
    clean: true,
    bundle: false,
    entry: ["src/**/*"],
    format: ["cjs", "esm"],
    dts: true,
    sourcemap: true,
  },
]);

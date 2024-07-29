import { defineConfig } from "tsup";
export default defineConfig([
    {
        bundle: false,
        clean: true,
        dts: true,
        entry: ["src/**/*.ts", "src/**/*.tsx"],
        format: ["cjs"],
        sourcemap: true,
        external: ["ai", "react", "@ai-sdk/openai", "zod"],
        target: "es2019",
    },
]);
//# sourceMappingURL=tsup.config.js.map
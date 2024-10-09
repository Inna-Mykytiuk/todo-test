import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default {
    overrides: [
        {
            files: ["**/*.{js,mjs,cjs,ts}"],
            languageOptions: {
                globals: globals.browser,
            },
            plugins: ["import"],
            rules: {
                "no-var": "off",
                "import/no-commonjs": "off",
            },
        },
    ],
    ...eslintConfigPrettier,
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
};



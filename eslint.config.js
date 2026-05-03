import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Grok v1.2 enforcement — fail any spring/gradient/glow regression
      "no-restricted-syntax": [
        "error",
        {
          selector: "ImportSpecifier[imported.name=/^(useSpring|animate.*Spring)$/]",
          message:
            "Spring physics violate Grok v1.2 §9.2 (linear/sharp easing only). Use grokEase from @/lib/motion.",
        },
        {
          selector: "Property[key.name=/^(stiffness|damping|mass|bounce)$/]",
          message: "Spring physics violate Grok v1.2 §9.2 (linear/sharp easing only).",
        },
      ],
    },
  },
  // Strict v1.2 token enforcement on UI primitives, landing, and worksheet
  {
    files: [
      "src/components/ui/**/*.{ts,tsx}",
      "src/components/landing/**/*.{ts,tsx}",
      "src/components/worksheet/**/*.{ts,tsx}",
      "src/routes/**/*.{ts,tsx}",
    ],
    rules: {
      // Block deleted v1.2 violation patterns at the className level
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/(accent-electric|glow-accent|glow-focus|bg-spotlight|bg-status-(success|warning|danger|info)-bg|backdrop-blur(?!-(md|sm|lg)\\b)|bg-gradient|accent-glow|radial-gradient|linear-gradient(?!s)|conic-gradient)/]",
          message:
            "Grok v1.2 violation — purged token/utility (gradients, glow, blur, accent-electric, status backgrounds). See docs/design-system-specs/grok §10.",
        },
      ],
    },
  },
  eslintPluginPrettier,
);

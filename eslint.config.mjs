import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const rules = {
  "react-hooks/exhaustive-deps": "off",
};

const eslintConfig = {
  extends: [...compat.extends("next/core-web-vitals", "next/typescript")],
  rules,
};

export default eslintConfig;

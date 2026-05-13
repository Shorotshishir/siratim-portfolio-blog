import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const ignores = [
  ".next/**",
  "node_modules/**",
  "out/**",
  "coverage/**",
  "next-env.d.ts",
];

const config = [
  { ignores },
  ...nextVitals,
  ...nextTypescript,
];

export default config;

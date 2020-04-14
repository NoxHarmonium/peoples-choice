module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
  },
  env: {
    es2020: true,
  },
  plugins: [
    "@typescript-eslint",
    "sonarjs",
    "functional",
    "simple-import-sort",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:sonarjs/recommended",
    "plugin:functional/external-recommended",
    "plugin:functional/lite",
    "react-app",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "functional/no-return-void": "off",
    "functional/no-throw-statement": "off",
    "simple-import-sort/sort": "error",
    "sort-imports": "off",
    "import/order": "off",
  },
};

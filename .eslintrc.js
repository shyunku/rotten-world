module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
};

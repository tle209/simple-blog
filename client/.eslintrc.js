module.exports = {
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "react"
  ],
  rules: {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    indent: ["error", 4],
    "max-len": ["error", { code: 150, tabWidth: 4 }],
    camelcase: [0, { properties: "never" }],
    "no-bitwise": 0,
    "no-console": "error",
    "no-unused-vars": "error",
    "no-use-before-define": "error",
    "no-multi-str": "error",
    "comma-dangle": ["error", "only-multiline"],
    semi: ["error", "always"],
    "prefer-promise-reject-errors": 0,
  },
};

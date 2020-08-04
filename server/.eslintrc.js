module.exports = {
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
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
    // "linebreak-style": [
    //   "error",
    //   process.env.NODE_ENV === "prod" ? "unix" : "windows",
    // ],
  },
};

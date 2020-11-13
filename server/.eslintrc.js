module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    ecmaVersion: 6
  },
  plugins: ["prettier"],
  extends: ["eslint:recommended", "plugin:prettier/recommended"]
};

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  plugins: ["import"],
  extends: ["@nuxtjs", "plugin:nuxt/recommended", "prettier"],
  // add your custom rules here
  rules: {
    "vue/max-attributes-per-line": "off",
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-v-html": "off"
  }
};

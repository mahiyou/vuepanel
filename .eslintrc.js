module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
    ],
    rules: {
        "vue/multi-word-component-names": "off",
        "semi-style": ["error", "last"],
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "indent": ["error", 4]
    },
};

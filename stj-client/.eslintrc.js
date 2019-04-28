module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/prettier"],
    rules: {
        indent: ["warn", 4],
        "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "prettier/prettier": [
            "error",
            { htmlWhitespaceSensitivity: "ignore", tabWidth: 4 }
        ]
    },
    parserOptions: {
        parser: "babel-eslint"
    }
};

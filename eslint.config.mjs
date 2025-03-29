import js from "@eslint/js";

export default [
	{
		ignores: [
			"**/node_modules/",
			".git/",
			"dist/",
			"**/*-inline.js",
			"tests/vendor/*.js",
			"index.cjs",
			"index.min.js"
		]
	},
	js.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: {
				console: "readonly",
			}
		},
		rules: {
			"indent": [
				"error",
				"tab",
				{
					"SwitchCase": 1
				}
			],
			"linebreak-style": [
				"error",
				"unix"
			],
			"quotes": [
				"error",
				"double"
			],
			"semi": [
				"error",
				"always"
			],
			"no-console": [
				"warn"
			]
		}
	}
];
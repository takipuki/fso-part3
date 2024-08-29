import globals from 'globals';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin-js';


export default [
	js.configs.recommended,
	{
		ignores: ['dist/', 'frontend/'],
	},
	{
		files: ['**/*.js'],
		languageOptions: {
			sourceType: 'commonjs',
			globals: {
				...globals.node,
			},
			ecmaVersion: 'latest',
		},
		plugins: {
			'@stylistic/js': stylistic,
		},
		rules: {
			'eqeqeq': 'error',
			'object-curly-spacing': ['error', 'always'],
			'arrow-spacing': [
				'error', { 'before': true, 'after': true },
			],
			'no-trailing-spaces': 'error',
			'no-unused-vars': [
				'error',
				{
					'varsIgnorePattern': '^_+$',
					'argsIgnorePattern': '^_+$',
				}
			],
			'@stylistic/js/indent': ['error', 'tab'],
			'@stylistic/js/linebreak-style': ['error', 'unix'],
			'@stylistic/js/semi': ['error', 'always'],
			'@stylistic/js/quotes': ['error', 'single'],
		},
	},
];

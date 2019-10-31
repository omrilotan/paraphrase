const { readdirSync } = require('fs');
const { resolve } = require('path');
const EcmaPlugin = require('ecma-webpack-plugin');

const entry = Object.assign(
	...readdirSync(
		resolve('src')
	).filter(
		i => !i.endsWith('.js')
	).map(
		item => ({
			[`${item}/index.js`]: resolve(`./src/${item}/`)
		})
	)
);

const config = {
	mode: 'production',
	output: {
		filename: '[name]',
		path: __dirname,
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				loader: 'babel-loader',
				include: __dirname,
				sideEffects: false,
				options: require('babelrc'),
			},
		],
	},
	plugins: [
		new EcmaPlugin({
			extensions: [ 'js' ],
			parser: { ecmaVersion: '5' },
		}),
	],
};

module.exports = [
	Object.assign(
		{
			entry: { 'index.js': resolve('./src/') }
		},
		config,
	),
	Object.assign(
		{ entry },
		config,
	),
]

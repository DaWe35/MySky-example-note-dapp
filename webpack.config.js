const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	mode: 'development',
	resolve: {
		fallback: { "crypto": false }
	},
	optimization: {
		// minimize: true,
		minimize: false,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
	},
}

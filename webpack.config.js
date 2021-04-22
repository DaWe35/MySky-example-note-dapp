const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
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

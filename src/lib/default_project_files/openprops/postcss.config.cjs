const presetEnv = require('postcss-preset-env');

const config = {
	plugins: [
		presetEnv({
			minimumVendorImplementations: 2,
			features: {
				'nesting-rules': true,
				'custom-media-queries': true,
				'media-query-ranges': true
			}
		})
	]
};

module.exports = config;

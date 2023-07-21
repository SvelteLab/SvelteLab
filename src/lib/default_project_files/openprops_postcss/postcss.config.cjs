const autoprefixer = require('autoprefixer');
const presetEnv = require('postcss-preset-env');

const config = {
	plugins: [
		autoprefixer(),
		presetEnv({
			stage: 3,
			features: {
				'nesting-rules': true,
				'custom-media-queries': true,
				'media-query-ranges': true
			}
		})
	]
};

module.exports = config;

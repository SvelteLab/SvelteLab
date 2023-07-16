import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: /.*\.e2e\.ts/,
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
	},
	use: {
		video: 'retain-on-failure',
	},
};

export default config;

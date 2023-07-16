import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173,
	},
	testDir: 'tests',
	testMatch: /.*\.e2e\.ts/,
};

export default config;

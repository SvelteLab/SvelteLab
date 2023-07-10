import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();
const dev = process.env.PLAYWRIGHT_DEV;

console.log('######asdfa');

//if we ever want /utils
// → https://playwright.dev/docs/test-configuration#filtering-tests
const config: PlaywrightTestConfig = {
	webServer: {
		command: dev ? '' : 'npm run build && npm run preview',
		port: dev ? 5173 : 4173,
		reuseExistingServer: !!dev,
	},
	testDir: './tests',
	testMatch: '*.ts',
};

export default config;

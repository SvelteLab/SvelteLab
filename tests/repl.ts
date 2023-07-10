import { test } from '@playwright/test';

test.describe('REPL', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});
	test('reflects changes', async ({ page }) => {
		await page.getByText('<script>').click(); // select Editor
		await page.keyboard.down('Meta');
		await page.keyboard.press('A');
		await page.keyboard.up('Meta');
		await page.keyboard.press('Backspace');
		const test_string = 'Hello World';
		await page.keyboard.type('Hello World');
		await page.frameLocator('iframe[title="content"]').getByText(test_string).click();
	});
});

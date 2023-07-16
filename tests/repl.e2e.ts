import { expect, test } from '@playwright/test';

test.describe('REPL', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		expect(
			page.frameLocator('iframe[title="content"]').getByText('Hello Basic Template!')
		).toBeVisible({ timeout: 60000 });
	});
	test('reflects changes', async ({ page }) => {
		await page.getByText('<script>').click(); // select Editor
		await page.keyboard.down('Control');
		await page.keyboard.press('A');
		await page.keyboard.up('Control');
		await page.keyboard.press('Backspace');
		const test_string = 'Hello World';
		await page.keyboard.type('Hello World');
		await page.frameLocator('iframe[title="content"]').getByText(test_string).click();
	});
});

import { expect, test } from '@playwright/test';

test.describe('REPL', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});
	test('reflects changes', async ({ page }) => {
		test.setTimeout(60000 * 10);

		await expect(
			page.frameLocator('iframe[title="content"]').getByText('Hello Basic Template!'),
		).toBeVisible({ timeout: 60000 * 5 });
		await page.getByText('<script>').click(); // select Editor
		await page.keyboard.down('Control');
		await page.keyboard.press('A');
		await page.keyboard.up('Control');
		await page.keyboard.press('Backspace');
		const test_string = 'Hello World';
		await page.keyboard.type(test_string);
		await expect(page.frameLocator('iframe[title="content"]').getByText(test_string)).toBeVisible({
			timeout: 60000 * 5,
		});
	});
});


import { test, expect } from '@playwright/test';

test.describe('Critical User Journey', () => {

    test('User can browse, view pricing, and attempt to buy a package', async ({ page }) => {
        // 1. Homepage
        await page.goto('/', { timeout: 60000 });
        await expect(page).toHaveTitle(/ProEstate/);

        // Check key elements
        const hero = page.locator('main').first();
        await expect(hero).toBeVisible();

        // 2. Navigate to Pricing
        // Assuming there is a link to Pricing or we go directly
        await page.goto('/pricing');
        await expect(page.getByRole('heading', { name: /Pilih Paket/ })).toBeVisible();

        // 3. Attempt to Buy Package (Subscription)
        // The button text defaults to "Beli Sekarang" if logged in, or "Login untuk Membeli" link if not.

        // Check for the "Login untuk Membeli" link first (since we are not logged in)
        const loginLink = page.getByRole('link', { name: /Login untuk Membeli/i }).first();

        if (await loginLink.isVisible()) {
            await loginLink.click();

            // Expect redirection to Sign In page
            await expect(page).toHaveURL(/\/handler\/sign-in/);
        } else {
            // Fallback if we somehow have a session (unlikely in fresh test)
            const buyButton = page.getByRole('button', { name: /Beli Sekarang/i }).first();
            if (await buyButton.isVisible()) {
                await buyButton.click();
            }
        }
    });

});

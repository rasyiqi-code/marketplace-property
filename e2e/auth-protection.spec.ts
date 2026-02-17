
import { test, expect } from '@playwright/test';

test.describe('Route Protection', () => {

    test('Guest is redirected from /my-properties', async ({ page }) => {
        await page.goto('/my-properties');
        // Expect redirect to sign-in
        await expect(page).not.toHaveURL('/my-properties');
        await expect(page).toHaveURL(/\/handler\/sign-in/);
    });

    test('Guest is redirected from /post-ad', async ({ page }) => {
        await page.goto('/post-ad');
        // Expect redirect to sign-in
        await expect(page).not.toHaveURL('/post-ad');
        await expect(page).toHaveURL(/\/handler\/sign-in/);
    });

    test('Guest is redirected from /admin', async ({ page }) => {
        await page.goto('/admin');
        // Expect redirect to sign-in
        await expect(page).not.toHaveURL('/admin');
        await expect(page).toHaveURL(/\/handler\/sign-in/);
    });

});

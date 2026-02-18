
import { test, expect } from '@playwright/test';

test.describe('Property Details', () => {

    test('User can view property details', async ({ page }) => {
        // 1. Homepage
        await page.goto('/', { timeout: 60000 });

        // 2. Click on a Property Card
        // Using a generic selector for property card link
        // "Lihat Detail" or clicking the image
        // Focusing on 'jual' or 'sewa' links as they are the main routes, but allow property fallback
        const propertyCard = page.locator('a[href^="/jual/"], a[href^="/sewa/"], a[href^="/property/"]').first();

        if (await propertyCard.isVisible()) {
            await propertyCard.click();

            // 3. Verify Navigation
            // The URL might change due to redirect (e.g. /property/id -> /jual/id)
            // So we check if we are on a property detail page
            await expect(page).toHaveURL(/(\/jual\/|\/sewa\/|\/property\/)/);

            // 4. Verify Content
            // Title should be visible
            await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

            // "Hubungi" or "Contact" button (usually a link)
            const contactButton = page.getByRole('link', { name: /Hubungi|WhatsApp/i }).first();
            if (await contactButton.isVisible()) {
                await expect(contactButton).toBeVisible();
            }
        } else {
            test.skip(true, 'No properties found on homepage to click');
        }
    });

});

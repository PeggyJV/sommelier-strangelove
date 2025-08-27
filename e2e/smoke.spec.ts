import { test, expect } from '@playwright/test'

test.describe('Smoke', () => {
  test('home page renders', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Sommelier/i)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})



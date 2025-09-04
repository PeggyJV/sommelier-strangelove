import { test, expect } from "@playwright/test"

test("renders unified button variants", async ({ page }) => {
  await page.goto("/")
  // Smoke check that common CTAs exist and are not clipped
  const primary = page
    .locator("button")
    .filter({ hasText: /Deposit|Connect|Enter/i })
    .first()
  await expect(primary).toBeVisible()
  const bb = await primary.boundingBox()
  expect(bb!.height).toBeGreaterThanOrEqual(44)
})

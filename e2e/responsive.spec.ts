import { test, expect } from "@playwright/test"

const viewports = [
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
]

for (const vp of viewports) {
  test.describe(`responsive @ ${vp.width}x${vp.height}`, () => {
    test.use({ viewport: vp })

    test("no horizontal overflow and primary CTAs visible", async ({
      page,
    }) => {
      await page.goto("/")
      const noHScroll = await page.evaluate(
        () =>
          document.scrollingElement!.scrollWidth ===
          document.scrollingElement!.clientWidth
      )
      expect(noHScroll).toBeTruthy()
      // Rough CTA presence: find any button with text 'Enter' or 'Switch' visible
      const anyCTA = page
        .locator(
          "button:has-text('Enter'), button:has-text('Switch')"
        )
        .first()
      await expect(anyCTA).toBeVisible()
    })
  })
}

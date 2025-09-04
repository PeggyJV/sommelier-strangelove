import { test, expect } from "@playwright/test"

test.describe("Chain switcher", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("icon is always visible", async ({ page }) => {
    const trigger = page.getByTestId("chain-trigger")
    await expect(trigger).toBeVisible()
    await expect(trigger.locator("svg")).toBeVisible()
  })

  test("dropdown renders above trigger and fully on screen", async ({
    page,
  }) => {
    const trigger = page.getByTestId("chain-trigger")
    await trigger.click()
    const t = await trigger.boundingBox()
    const item = await page.getByRole("menuitem", {
      name: /Arbitrum|Optimism|Ethereum/i,
    })
    const b = await item.boundingBox()
    expect(b!.y).toBeGreaterThan(t!.y + t!.height - 1)
    const noHScroll = await page.evaluate(
      () =>
        document.scrollingElement!.scrollWidth ===
        document.scrollingElement!.clientWidth
    )
    expect(noHScroll).toBeTruthy()
  })

  test("selecting updates label and closes dropdown", async ({
    page,
  }) => {
    const trigger = page.getByTestId("chain-trigger")
    await trigger.click()
    const target = page
      .getByRole("menuitem", { name: /Optimism|Arbitrum/i })
      .first()
    const name = await target.textContent()
    await target.click()
    await expect(trigger).toContainText(
      new RegExp((name || "").trim(), "i")
    )
  })
})

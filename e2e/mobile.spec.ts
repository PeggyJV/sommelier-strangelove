import { test, expect } from "@playwright/test"

const routes = [
  "/",
  "/strategies",
  "/strategies/Alpha-stETH",
  "/strategies/Alpha-stETH/manage",
]

const devices: { name: string; width: number; height: number }[] = [
  { name: "iphone12", width: 390, height: 844 },
  { name: "pixel5", width: 393, height: 851 },
  { name: "ipadMini", width: 768, height: 1024 },
]

test.describe("Mobile visual audit", () => {
  for (const d of devices) {
    for (const route of routes) {
      test(`screenshot ${d.name} ${route}`, async ({ page }) => {
        await page.setViewportSize({
          width: d.width,
          height: d.height,
        })
        await page.goto(
          process.env.MOBILE_AUDIT_BASE_URL ||
            "http://localhost:3000" + route
        )
        await page.waitForLoadState("networkidle")
        const safeName =
          route.replace(/\W+/g, "_").replace(/^_+|_+$/g, "") || "home"
        await page.screenshot({
          path: `tests/__screenshots__/mobile/${d.name}__${safeName}.png`,
          fullPage: true,
        })
        expect(true).toBeTruthy()
      })
    }
  }
})

import type { PlaywrightTestConfig } from '@playwright/test'

// Playwright configuration for basic smoke coverage of the Next.js app
// Uses Next.js production server to keep tests representative and fast.
const config: PlaywrightTestConfig = {
  testDir: 'e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['junit', { outputFile: 'test-results/playwright-junit.xml' }], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'pnpm start -p 3000',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
}

export default config



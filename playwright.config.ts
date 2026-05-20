import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: process.env.E2E_URL ?? 'https://sonic74129.github.io/veloris-game/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'iphone-12-webkit',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 844, height: 390 },
      },
    },
    {
      name: 'pixel-5-chromium',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 915, height: 412 },
      },
    },
  ],
});

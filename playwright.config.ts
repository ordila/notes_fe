import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
  testDir: "./e2e",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: process.env.CI
    ? [["html"], ["github"], ["json", { outputFile: "test-results.json" }]]
    : "html",

  use: {
    baseURL: "http://localhost:3000",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    trace: "on-first-retry",

    ...(process.env.CI && {
      actionTimeout: 10_000,
      navigationTimeout: 30_000,
    }),
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: "**/integration.spec.ts",
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: "**/integration.spec.ts",
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: "**/integration.spec.ts",
    },

    {
      name: "integration",
      use: {
        ...devices["Desktop Chrome"],
        actionTimeout: 30_000,
        navigationTimeout: 30_000,
      },
      testMatch: "**/integration.spec.ts",
      fullyParallel: false,
      retries: 2,
      timeout: 60_000,
    },

    ...(process.env.CI
      ? []
      : [
          {
            name: "Mobile Chrome",
            use: { ...devices["Pixel 5"] },
            testIgnore: "**/integration.spec.ts",
          },
          {
            name: "Mobile Safari",
            use: { ...devices["iPhone 12"] },
            testIgnore: "**/integration.spec.ts",
          },
        ]),
  ],

  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 180_000 : 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});

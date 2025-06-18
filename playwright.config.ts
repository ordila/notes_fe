import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Папка з тестами
  testDir: "./e2e",

  /* Запускати тести в файлах паралельно */
  fullyParallel: true,

  /* Не запускати тести якщо один з них провалився */
  forbidOnly: !!process.env.CI,

  /* Повторити тест якщо провалився (тільки в CI) */
  retries: process.env.CI ? 2 : 0,

  /* Кількість одночасних тестів */
  workers: process.env.CI ? 1 : undefined,

  /* Репортер для результатів */
  reporter: "html",

  /* Загальні налаштування для всіх тестів */
  use: {
    /* Base URL для тестів */
    baseURL: "http://localhost:3000",

    /* Скріншоти тільки при провалі */
    screenshot: "only-on-failure",

    /* Відео тільки при провалі */
    video: "retain-on-failure",

    /* Trace при провалі */
    trace: "on-first-retry",
  },

  /* Налаштування проектів для різних браузерів */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Мобільні тести */
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],

  /* Запустити dev сервер перед тестами */
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2 хвилини на запуск
  },
});

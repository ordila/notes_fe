import { test, expect } from "@playwright/test";

test.describe("🎯 Простий працюючий E2E тест з моками", () => {
  test("✅ сторінка завантажується з мокованими даними", async ({ page }) => {
    // Мокуємо GraphQL запит GetNotes
    await page.route("**/graphql", async (route) => {
      const request = route.request();
      const postData = request.postData();

      if (postData?.includes("GetNotes")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              notes: [
                {
                  id: "1",
                  title: "Тестова нотатка",
                  content: "Це тестовий контент нотатки",
                  tags: ["тест", "playwright"],
                  createdAt: "2024-01-01T00:00:00Z",
                  updatedAt: "2024-01-01T00:00:00Z",
                },
              ],
            },
          }),
        });
      } else {
        // Для інших запитів повертаємо пустий успішний результат
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: {} }),
        });
      }
    });

    // Переходимо на головну сторінку
    await page.goto("/");

    // Перевіряємо що заголовок існує
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Система нотаток");

    // Перевіряємо що підзаголовок існує
    await expect(
      page.locator("text=GraphQL + NestJS + Supabase")
    ).toBeVisible();

    // Чекаємо що кнопка "Додати нотатку" з'явилася (тепер вона має з'явитися)
    await expect(
      page.locator('button:has-text("Додати нотатку")')
    ).toBeVisible();

    // Перевіряємо що мокована нотатка відображається
    await expect(page.locator("text=Тестова нотатка")).toBeVisible();

    console.log("✅ Сторінка завантажилася з мокованими даними!");
  });

  test("🔗 можна клікнути на кнопку додавання з моками", async ({ page }) => {
    // Той самий мок
    await page.route("**/graphql", async (route) => {
      const request = route.request();
      const postData = request.postData();

      if (postData?.includes("GetNotes")) {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            data: {
              notes: [],
            },
          }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ data: {} }),
        });
      }
    });

    await page.goto("/");

    // Чекаємо що кнопка завантажилася
    const addButton = page.locator('button:has-text("Додати нотатку")');
    await expect(addButton).toBeVisible();

    // Клікаємо на кнопку
    await addButton.click();

    console.log("✅ Кнопка додавання працює з моками!");
  });

  test("🌐 сторінка відповідає зі статусом 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    console.log("✅ Сторінка відповідає зі статусом 200!");
  });
});

import { test, expect } from "@playwright/test";

test.describe("🎯 Простий працюючий E2E тест з моками", () => {
  test("✅ сторінка завантажується з мокованими даними", async ({ page }) => {
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
                  createdAt: "2024-01-01T12:00:00.000Z",
                  updatedAt: "2024-01-01T12:00:00.000Z",
                  __typename: "Note",
                },
              ],
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

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Система нотаток");

    await expect(
      page.locator("text=GraphQL + NestJS + Supabase")
    ).toBeVisible();

    await expect(
      page.locator('button:has-text("Додати нотатку")')
    ).toBeVisible();

    await expect(page.locator('[data-testid="notes-container"]')).toBeVisible();

    await expect(page.locator("text=Мої нотатки (1)")).toBeVisible();

    await expect(page.locator(".note-card")).toHaveCount(1);
    await expect(page.locator(".note-title")).toBeVisible();
    await expect(page.locator(".note-title")).toContainText("Тестова нотатка");

    await expect(page.locator(".note-content")).toBeVisible();
    await expect(page.locator(".note-content")).toContainText(
      "Це тестовий контент нотатки"
    );

    await expect(page.locator(".note-tags")).toBeVisible();
    await expect(page.locator(".note-tags")).toContainText("#тест #playwright");

    await expect(page.locator(".note-meta small")).toBeVisible();
    await expect(page.locator(".note-meta small")).toContainText(
      "Створено: 01.01.2024"
    );

    console.log("✅ Сторінка завантажилася з мокованими даними!");
  });

  test("🔗 можна клікнути на кнопку додавання з моками", async ({ page }) => {
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

    const addButton = page.locator('button:has-text("Додати нотатку")');
    await expect(addButton).toBeVisible();

    await addButton.click();

    console.log("✅ Кнопка додавання працює з моками!");
  });

  test("🌐 сторінка відповідає зі статусом 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    console.log("✅ Сторінка відповідає зі статусом 200!");
  });
});

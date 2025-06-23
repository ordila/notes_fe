import { test, expect } from "@playwright/test";

test.describe
  .serial("🌐 Інтеграційні E2E тести з реальним продакшн API", () => {
  const BACKEND_URL =
    process.env.BACKEND_URL ||
    "https://notesbe-production.up.railway.app/graphql";
  const GRAPHQL_ENDPOINT = `${BACKEND_URL}`;

  console.log(`🔍 BACKEND_URL: ${BACKEND_URL}`);
  console.log(`🔍 GRAPHQL_ENDPOINT: ${GRAPHQL_ENDPOINT}`);

  const testNote = {
    title: `E2E Тест ${new Date().toISOString()}`,
    content: "Цей тест перевіряє взаємодію з продакшн бекендом",
    tags: ["e2e", "production", "integration"],
  };

  let createdNoteId: string;

  test.beforeAll(async ({ request }) => {
    console.log(`🔍 Тестуємо продакшн API: ${BACKEND_URL}`);

    try {
      const healthCheck = await request.post(GRAPHQL_ENDPOINT, {
        data: {
          query: `
            query TestSupabase {
              testSupabase
            }
          `,
        },
      });

      if (!healthCheck.ok()) {
        throw new Error(`API недоступне: ${healthCheck.status()}`);
      }

      const response = await healthCheck.json();
      console.log(`✅ Продакшн API відповідає: ${response.data?.testSupabase}`);
    } catch (error) {
      console.error(`❌ Помилка підключення до продакшн API:`, error);
      throw error;
    }
  });

  test.afterAll(async ({ request }) => {
    if (createdNoteId) {
      try {
        await request.post(GRAPHQL_ENDPOINT, {
          data: {
            query: `
              mutation DeleteNote($id: ID!) {
                deleteNote(id: $id)
              }
            `,
            variables: { id: createdNoteId },
          },
        });
        console.log(`🧹 Очищено продакшн дані: ${createdNoteId}`);
      } catch (error) {
        console.warn(`⚠️ Не вдалося очистити тестові дані:`, error);
      }
    }
  });

  test("🌐 Продакшн GraphQL API працює", async ({ request }) => {
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `
          query TestSupabase {
            testSupabase
          }
        `,
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.data?.testSupabase).toContain("✅");

    console.log("✅ Продакшн GraphQL API працює!");
  });

  test("📝 Можна створити нотатку в продакшн API", async ({ request }) => {
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `
          mutation CreateNote($input: CreateNoteInput!) {
            createNote(input: $input) {
              id
              title
              content
              tags
              createdAt
              updatedAt
            }
          }
        `,
        variables: {
          input: testNote,
        },
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.errors).toBeUndefined();

    const note = data.data?.createNote;
    expect(note).toBeDefined();
    expect(note.title).toBe(testNote.title);
    expect(note.content).toBe(testNote.content);
    expect(note.tags).toEqual(testNote.tags);
    expect(note.id).toBeDefined();

    createdNoteId = note.id;

    console.log(`✅ Створено нотатку в продакшн: ${note.id}`);
  });

  test("📖 Можна отримати нотатки з продакшн API", async ({ request }) => {
    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `
          query GetNotes {
            notes {
              id
              title
              content
              tags
              createdAt
              updatedAt
            }
          }
        `,
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.errors).toBeUndefined();

    const notes = data.data?.notes;
    expect(Array.isArray(notes)).toBeTruthy();

    expect(createdNoteId).toBeDefined();
    const testNoteExists = notes.some((note: any) => note.id === createdNoteId);
    expect(testNoteExists).toBeTruthy();

    console.log(`✅ Отримано ${notes.length} нотаток з продакшн`);
  });

  test("🌐 Frontend відображає реальні продакшн дані", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Система нотаток");

    await expect(page.locator('[data-testid="notes-container"]')).toBeVisible();

    await page.waitForFunction(
      () => {
        const container = document.querySelector(
          '[data-testid="notes-container"]'
        );
        const header = container?.querySelector(".notes-header h2");
        return header?.textContent && !header.textContent.includes("(0)");
      },
      { timeout: 15000 }
    );

    expect(createdNoteId).toBeDefined();

    const noteCards = page.locator(`.note-card`);
    const count = await noteCards.count();
    expect(count).toBeGreaterThan(0);

    const testNoteCard = page.locator(
      `.note-card:has-text("${testNote.title}")`
    );
    await expect(testNoteCard).toBeVisible();

    await expect(testNoteCard.locator(".note-content")).toContainText(
      testNote.content
    );

    await expect(testNoteCard.locator(".note-tags")).toContainText("#e2e");

    console.log("✅ Frontend правильно відображає продакшн дані!");
  });

  test("📊 Швидкість продакшн API", async ({ request }) => {
    const startTime = Date.now();

    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `
          query GetNotes {
            notes {
              id
              title
            }
          }
        `,
      },
    });

    const responseTime = Date.now() - startTime;

    expect(response.ok()).toBeTruthy();
    expect(responseTime).toBeLessThan(5000);

    console.log(`⚡ Продакшн API відповів за ${responseTime}мс`);
  });

  test("🔄 Можна оновити нотатку в продакшн", async ({ request }) => {
    expect(createdNoteId).toBeDefined();

    const updatedContent = "Оновлений контент для продакшн тесту";

    const response = await request.post(GRAPHQL_ENDPOINT, {
      data: {
        query: `
          mutation UpdateNote($id: ID!, $input: UpdateNoteInput!) {
            updateNote(id: $id, input: $input) {
              id
              title
              content
              updatedAt
            }
          }
        `,
        variables: {
          id: createdNoteId,
          input: {
            content: updatedContent,
          },
        },
      },
    });

    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL помилки:", JSON.stringify(data.errors, null, 2));
      console.error("ID нотатки:", createdNoteId);
    }

    expect(data.errors).toBeUndefined();

    const note = data.data?.updateNote;
    expect(note.content).toBe(updatedContent);

    console.log(`✅ Оновлено нотатку в продакшн: ${note.id}`);
  });
});

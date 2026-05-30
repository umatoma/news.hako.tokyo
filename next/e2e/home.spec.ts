import { expect, test } from "@playwright/test";

test.describe("Home page (/)", () => {
  test("renders header with article count", async ({ page }) => {
    await page.goto("/");
    const count = page.getByTestId("header-article-count");
    await expect(count).toBeVisible();
    await expect(count).toContainText("件");
  });

  test("renders footer with last-updated indicator", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByTestId("footer-last-updated");
    await expect(footer).toBeVisible();
  });

  test("article links open in a new tab with safe rel attributes", async ({
    page,
  }) => {
    await page.goto("/");
    const link = page.getByTestId("article-link").first();
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("target", "_blank");
    const rel = await link.getAttribute("rel");
    expect(rel ?? "").toContain("noopener");
    expect(rel ?? "").toContain("noreferrer");
  });

  test("article link href is an absolute URL", async ({ page }) => {
    await page.goto("/");
    const link = page.getByTestId("article-link").first();
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^https?:\/\//);
  });

  test.describe("source tabs (SRC-01 to SRC-05)", () => {
    test("shows all source tabs with 'all' selected by default", async ({
      page,
    }) => {
      await page.goto("/");

      // SRC-01: 全タブが表示される
      await expect(page.getByTestId("source-tab-all")).toBeVisible();
      await expect(page.getByTestId("source-tab-zenn")).toBeVisible();
      await expect(page.getByTestId("source-tab-hatena")).toBeVisible();
      await expect(page.getByTestId("source-tab-googlenews")).toBeVisible();
      await expect(page.getByTestId("source-tab-togetter")).toBeVisible();

      // SRC-04: 初回表示は「すべて」が選択状態
      await expect(page.getByTestId("source-tab-all")).toHaveAttribute(
        "aria-selected",
        "true",
      );
    });

    test("clicking a source tab filters articles without changing URL", async ({
      page,
    }) => {
      await page.goto("/");

      const urlBefore = page.url();

      // SRC-02: タブクリックで URL が変化しない
      await page.getByTestId("source-tab-zenn").click();
      expect(page.url()).toBe(urlBefore);

      // クリック後、zenn タブが選択状態になる
      await expect(page.getByTestId("source-tab-zenn")).toHaveAttribute(
        "aria-selected",
        "true",
      );

      // SRC-02 + SRC-03: 表示記事はすべて zenn ソースのバッジを持つか、記事なしなら空表示
      const articleLinks = page.getByTestId("article-link");
      const emptyMessage = page.getByTestId("empty-state-message");
      const articleCount = await articleLinks.count();

      if (articleCount > 0) {
        // 各記事に zenn のソースバッジが含まれることを確認
        for (let i = 0; i < articleCount; i++) {
          const item = articleLinks.nth(i);
          const ancestor = item.locator("xpath=ancestor::li[1]");
          await expect(
            ancestor.getByTestId("source-badge-zenn"),
          ).toBeVisible();
        }
      } else {
        // SRC-05: 記事がない場合は空表示
        await expect(emptyMessage).toBeVisible();
      }
    });
  });
});

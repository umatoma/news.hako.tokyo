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
});

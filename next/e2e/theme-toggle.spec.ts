import { expect, test } from "@playwright/test";

// テーマ切替の E2E。
// - 永続化（Requirement 2.1/2.2）: ダーク選択 → localStorage 保存 + <html>.dark 付与 → リロード後も維持。
// - FOUC 不在（Requirement 3.1/3.2）: 保存値が dark のとき初期 HTML パース時点から <html>.dark が同期適用され、
//   prefers-color-scheme に依存せず保存値で実効テーマが決まる（ライト→ダークの遅延切替が起きない）。

const DARK_BACKGROUND = "rgb(10, 10, 10)"; // globals.css .dark の --background #0a0a0a

test.describe("Theme toggle (THEME-2.1/2.2, THEME-3.1/3.2)", () => {
  test("selecting dark persists across reload (2.1/2.2)", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByTestId("theme-toggle");
    await expect(toggle).toBeVisible();

    // ダークを選択する。
    await page.getByTestId("theme-toggle-option-dark").click();

    // 選択直後: aria-pressed・<html>.dark・localStorage が dark。
    await expect(page.getByTestId("theme-toggle-option-dark")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("theme")))
      .toBe("dark");

    // リロードしても保存値からダークが維持される。
    await page.reload();

    await expect(page.locator("html")).toHaveClass(/\bdark\b/);
    await expect(page.getByTestId("theme-toggle-option-dark")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect
      .poll(() => page.evaluate(() => window.localStorage.getItem("theme")))
      .toBe("dark");
  });

  test("no FOUC: stored dark applies synchronously on initial load, independent of OS preference (3.1/3.2)", async ({
    page,
  }) => {
    // OS をライト選好に固定。保存値が優先され dark になることを担保する。
    await page.emulateMedia({ colorScheme: "light" });

    // ナビゲーション前に保存値 dark を注入（FOUC スクリプトが読む localStorage を先回りで設定）。
    await page.addInitScript(() => {
      window.localStorage.setItem("theme", "dark");
    });

    await page.goto("/", { waitUntil: "commit" });

    // 描画完了を待たず（commit 直後）に <html>.dark が既に適用されていること
    // = 初期同期スクリプトでパース時点から付与されている（ライト→ダークの遅延切替なし）。
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    // ロード完了後も維持され、ちらつき後にライトへ戻ったりしないこと。
    await page.waitForLoadState("load");
    await expect(page.locator("html")).toHaveClass(/\bdark\b/);

    // 実効配色がダーク値であること（body 背景がダーク）。
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      DARK_BACKGROUND,
    );

    // prefers-color-scheme: light でも保存値 dark が優先されていることの確認。
    const prefersDark = await page.evaluate(
      () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    expect(prefersDark).toBe(false);
  });
});

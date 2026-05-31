// テーマの型・定数・純粋ヘルパー。
// ブラウザ API（localStorage / matchMedia）には依存せず、OS のダーク選好は
// 引数 `prefersDark` で受け取る参照透過なモジュール。

export type Theme = "light" | "dark" | "system";
export type EffectiveTheme = "light" | "dark";

export const THEME_OPTIONS: readonly Theme[] = ["light", "dark", "system"] as const;
export const THEME_STORAGE_KEY = "theme";

/**
 * 任意入力を有効な Theme に正規化する。
 * 不正値・null・undefined は既定の "system" にフォールバックする。
 * 戻り値は必ず THEME_OPTIONS のいずれか（全域性）。
 */
export function parseTheme(value: string | null | undefined): Theme {
  if (value === "light" || value === "dark" || value === "system") {
    return value;
  }
  return "system";
}

/**
 * Theme と OS のダーク選好から実効テーマ（light/dark）を決定する。
 * "system" のときは prefersDark に従い、それ以外は theme をそのまま実効値とする。
 */
export function resolveEffectiveTheme(theme: Theme, prefersDark: boolean): EffectiveTheme {
  if (theme === "system") {
    return prefersDark ? "dark" : "light";
  }
  return theme;
}

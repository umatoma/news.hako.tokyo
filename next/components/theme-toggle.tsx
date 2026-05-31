"use client";

import { useEffect, useSyncExternalStore } from "react";

import {
  parseTheme,
  resolveEffectiveTheme,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
} from "@/lib/theme";
import type { Theme } from "@/lib/theme";

// テーマ切替 UI（Client Component）。
// - THEME_OPTIONS をネイティブ <button> 群として描画し、現在選択を aria 状態で可視化（5.2/5.3）。
// - 選択時に localStorage へ永続化し、実効テーマを <html> の .dark へ即時反映（1.2-1.5, 2.1）。
// - マウント時に保存値を parseTheme で正規化して state 初期化（FOUC スクリプト適用済み DOM に冪等）。
// - theme === "system" のときのみ matchMedia の change を購読し、cleanup で解除（4.1/4.2）。
// - localStorage / matchMedia アクセスは try/catch でガードし、失敗時も切替操作は機能継続。

// DOM 操作に必要な最小インターフェース。テストでスタブ注入できるよう抽象化。
interface ToggleableClassList {
  toggle(name: string, force?: boolean): boolean;
}
interface ThemeDocument {
  documentElement: { classList: ToggleableClassList };
}

// localStorage の最小インターフェース。
interface ThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const MEDIA_QUERY = "(prefers-color-scheme: dark)";
const DEFAULT_THEME: Theme = "system";

/**
 * 実効テーマを <html> の .dark クラスへ反映する。
 * resolveEffectiveTheme の結果に応じて classList.toggle(force) を呼ぶため冪等。
 * FOUC スクリプトで既に適用済みでも結果は変わらない。
 */
export function applyTheme(
  theme: Theme,
  doc: ThemeDocument,
  prefersDark: boolean,
): void {
  const effective = resolveEffectiveTheme(theme, prefersDark);
  doc.documentElement.classList.toggle("dark", effective === "dark");
}

/**
 * storage から保存テーマを読み出し parseTheme で正規化する。
 * 例外（プライベートモード等）や未保存・不正値は既定 "system" へフォールバックし、例外を伝播しない。
 */
export function readStoredTheme(storage: ThemeStorage): Theme {
  try {
    return parseTheme(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

/**
 * 選択テーマを storage へ保存する。
 * 例外は握りつぶし、永続化失敗時もセッション内の切替操作は機能継続させる。
 */
export function persistTheme(theme: Theme, storage: ThemeStorage): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // 永続化失敗は致命ではない（DOM 反映は別途行う）。
  }
}

// OS のダーク選好を安全に取得する（matchMedia 非対応・例外時は false）。
function getPrefersDark(): boolean {
  try {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia(MEDIA_QUERY).matches;
  } catch {
    return false;
  }
}

const THEME_LABEL: Record<Theme, string> = {
  light: "ライト",
  dark: "ダーク",
  system: "システム",
};

// localStorage を選択テーマの単一の真実源として扱う最小 pub/sub ストア。
// useSyncExternalStore で購読することで、SSR/初回クライアントは既定スナップショット、
// マウント後は保存値スナップショットへ自然に切り替わり、effect 内 setState を避ける。
const themeSubscribers = new Set<() => void>();

function subscribeTheme(onChange: () => void): () => void {
  themeSubscribers.add(onChange);
  return () => {
    themeSubscribers.delete(onChange);
  };
}

function notifyThemeChange(): void {
  for (const subscriber of themeSubscribers) {
    subscriber();
  }
}

// クライアントスナップショット: localStorage の正規化済みテーマ。
function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }
  try {
    return readStoredTheme(window.localStorage);
  } catch {
    return DEFAULT_THEME;
  }
}

// サーバースナップショット: 常に既定（SSR 整合・FOUC スクリプトが DOM 側を担保）。
function getServerThemeSnapshot(): Theme {
  return DEFAULT_THEME;
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  // マウント時 / theme 変更時: 実効テーマを DOM へ冪等反映。
  // FOUC スクリプト適用済みでも classList.toggle(force) のため二重適用しても安全。
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    applyTheme(theme, document, getPrefersDark());
  }, [theme]);

  // system のときのみ OS カラースキーム変更を購読し DOM 反映。cleanup で解除（4.1/4.2）。
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") {
      return;
    }
    if (typeof window.matchMedia !== "function") {
      return;
    }
    let mql: MediaQueryList;
    try {
      mql = window.matchMedia(MEDIA_QUERY);
    } catch {
      return;
    }
    const handleChange = (event: MediaQueryListEvent) => {
      applyTheme("system", document, event.matches);
    };
    mql.addEventListener("change", handleChange);
    return () => {
      mql.removeEventListener("change", handleChange);
    };
  }, [theme]);

  const handleSelect = (next: Theme) => {
    if (typeof window !== "undefined") {
      persistTheme(next, window.localStorage);
      applyTheme(next, document, getPrefersDark());
    }
    // ストアへ反映を通知して再レンダリング（次の getThemeSnapshot で next を読む）。
    notifyThemeChange();
  };

  return (
    <div
      role="group"
      aria-label="テーマ切替"
      data-testid="theme-toggle"
      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 p-0.5 dark:border-zinc-800"
    >
      {THEME_OPTIONS.map((option) => {
        const isSelected = theme === option;
        return (
          <button
            key={option}
            type="button"
            data-testid={`theme-toggle-option-${option}`}
            aria-pressed={isSelected}
            onClick={() => handleSelect(option)}
            className={[
              "rounded px-2 py-1 text-xs font-medium transition-colors",
              isSelected
                ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200",
            ].join(" ")}
          >
            {THEME_LABEL[option]}
          </button>
        );
      })}
    </div>
  );
}

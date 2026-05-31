import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import {
  applyTheme,
  persistTheme,
  readStoredTheme,
  ThemeToggle,
} from "@/components/theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

// theme-toggle.tsx のコンポーネントテスト（環境: node）。
// vitest の環境は node（jsdom 不在）のため、対話・副作用は
// コンポーネントが内部利用する純粋境界ヘルパー（applyTheme /
// readStoredTheme / persistTheme）へスタブ DOM・スタブ storage を
// 注入して観測する。描画・aria 状態は renderToStaticMarkup で検証する。

// classList.toggle(name, force) を最小再現するスタブ DOM 要素。
function makeStubHtml(initialDark = false) {
  const classes = new Set<string>();
  if (initialDark) {
    classes.add("dark");
  }
  return {
    documentElement: {
      classList: {
        toggle(name: string, force?: boolean) {
          const shouldHave = force ?? !classes.has(name);
          if (shouldHave) {
            classes.add(name);
          } else {
            classes.delete(name);
          }
          return shouldHave;
        },
        contains(name: string) {
          return classes.has(name);
        },
      },
    },
  };
}

// 例外を投げないインメモリ storage スタブ。
function makeStubStorage(initial?: Record<string, string>) {
  const store = new Map<string, string>(Object.entries(initial ?? {}));
  return {
    getItem(key: string) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
}

// 常に例外を投げる storage スタブ（プライベートモード等を模擬）。
function makeThrowingStorage() {
  return {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {
      throw new Error("blocked");
    },
  };
}

describe("ThemeToggle 描画（1.1 / 5.2 / 5.3）", () => {
  it("ライト・ダーク・システムの3つのネイティブ button を描画する（1.1, 5.3）", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);
    const buttonCount = (html.match(/<button/g) ?? []).length;
    expect(buttonCount).toBe(3);
    expect(html).toContain('data-testid="theme-toggle-option-light"');
    expect(html).toContain('data-testid="theme-toggle-option-dark"');
    expect(html).toContain('data-testid="theme-toggle-option-system"');
  });

  it("初期レンダリング（SSR）は既定 system を現在選択として aria 状態で示す（5.2）", () => {
    const html = renderToStaticMarkup(<ThemeToggle />);
    // system のボタンに aria-pressed="true"、他は "false"
    const systemPressed = /data-testid="theme-toggle-option-system"[^>]*aria-pressed="true"|aria-pressed="true"[^>]*data-testid="theme-toggle-option-system"/;
    expect(systemPressed.test(html)).toBe(true);
    expect(html).toContain('aria-pressed="false"');
  });
});

describe("applyTheme（1.2-1.5: 実効テーマを .dark へ冪等反映）", () => {
  it("dark 選択で .dark を付与する", () => {
    const doc = makeStubHtml(false);
    applyTheme("dark", doc as never, false);
    expect(doc.documentElement.classList.contains("dark")).toBe(true);
  });

  it("light 選択で .dark を除去する", () => {
    const doc = makeStubHtml(true);
    applyTheme("light", doc as never, true);
    expect(doc.documentElement.classList.contains("dark")).toBe(false);
  });

  it("system 選択は prefersDark に従う（true→dark / false→light）", () => {
    const docDark = makeStubHtml(false);
    applyTheme("system", docDark as never, true);
    expect(docDark.documentElement.classList.contains("dark")).toBe(true);

    const docLight = makeStubHtml(true);
    applyTheme("system", docLight as never, false);
    expect(docLight.documentElement.classList.contains("dark")).toBe(false);
  });

  it("既に適用済みの DOM に対して冪等（二重適用しても結果は同じ）", () => {
    const doc = makeStubHtml(true);
    applyTheme("dark", doc as never, false);
    applyTheme("dark", doc as never, false);
    expect(doc.documentElement.classList.contains("dark")).toBe(true);
  });
});

describe("readStoredTheme（2.2-2.4: 復元と正規化・例外ガード）", () => {
  it("保存値 dark を復元する", () => {
    const storage = makeStubStorage({ [THEME_STORAGE_KEY]: "dark" });
    expect(readStoredTheme(storage as never)).toBe("dark");
  });

  it("未保存なら system へフォールバック（2.3）", () => {
    const storage = makeStubStorage();
    expect(readStoredTheme(storage as never)).toBe("system");
  });

  it("不正値は system へ正規化（2.4）", () => {
    const storage = makeStubStorage({ [THEME_STORAGE_KEY]: "sepia" });
    expect(readStoredTheme(storage as never)).toBe("system");
  });

  it("storage が例外を投げても system を返し、例外を伝播しない", () => {
    const storage = makeThrowingStorage();
    expect(() => readStoredTheme(storage as never)).not.toThrow();
    expect(readStoredTheme(storage as never)).toBe("system");
  });
});

describe("persistTheme（2.1: 永続化・例外ガード）", () => {
  it("選択値を THEME_STORAGE_KEY へ保存する", () => {
    const storage = makeStubStorage();
    persistTheme("dark", storage as never);
    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("storage が例外を投げても伝播しない（切替自体は機能継続）", () => {
    const storage = makeThrowingStorage();
    expect(() => persistTheme("light", storage as never)).not.toThrow();
  });
});

describe("選択操作の観測（完了条件: 永続化 + .dark 切替）", () => {
  it("ダーク選択相当の操作で localStorage 保存と .dark 付与が同時に観測できる", () => {
    const storage = makeStubStorage();
    const doc = makeStubHtml(false);

    // コンポーネントが選択ハンドラ内で行う 2 つの副作用を直接実行
    persistTheme("dark", storage as never);
    applyTheme("dark", doc as never, false);

    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(doc.documentElement.classList.contains("dark")).toBe(true);
  });

  it("ライト選択相当の操作で localStorage 保存と .dark 除去が観測できる", () => {
    const storage = makeStubStorage({ [THEME_STORAGE_KEY]: "dark" });
    const doc = makeStubHtml(true);

    persistTheme("light", storage as never);
    applyTheme("light", doc as never, true);

    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(doc.documentElement.classList.contains("dark")).toBe(false);
  });
});

// matchMedia 非対応・未定義環境でも例外を投げないことの確認（Error Handling）
describe("matchMedia 非対応時のガード（4.x / Error Handling）", () => {
  it("applyTheme は matchMedia に依存せず prefersDark 引数のみで動作する", () => {
    // matchMedia が未定義（node 環境）でも applyTheme は引数のみで完結する
    expect(typeof (globalThis as { matchMedia?: unknown }).matchMedia).toBe(
      "undefined",
    );
    const doc = makeStubHtml(false);
    expect(() => applyTheme("system", doc as never, false)).not.toThrow();
  });

  it("vi が利用可能（テストランナーの health check）", () => {
    expect(typeof vi.fn).toBe("function");
  });
});

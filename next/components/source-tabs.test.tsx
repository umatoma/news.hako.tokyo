import { describe, expect, it } from "vitest";

import type { ArticleListItemView } from "@/lib/articles";
import {
  filterArticlesBySource,
  SOURCE_LABEL,
  SOURCE_TABS,
} from "@/lib/articles";

// SourceTabs コンポーネントが依存するロジックの統合確認
// - SOURCE_TABS: タブ定義が正しい構造であることを確認
// - filterArticlesBySource: SourceTabs 内で使われるフィルタの挙動確認

function makeView(
  sourceId: ArticleListItemView["sourceId"],
  id: string,
): ArticleListItemView {
  return {
    id,
    title: `Article ${id}`,
    url: `https://example.com/${id}`,
    sourceId,
    sourceLabel: SOURCE_LABEL[sourceId],
    publishedAtIso: "2026-04-25T07:00:00+09:00",
    publishedAtDisplay: "2026年4月25日 07:00",
  };
}

describe("SourceTabs コンポーネントのロジック依存テスト", () => {
  describe("SOURCE_TABS 構造（タブ定義）", () => {
    it("先頭要素が { id: 'all', label: 'すべて' } である", () => {
      expect(SOURCE_TABS[0]).toEqual({ id: "all", label: "すべて" });
    });

    it("要素数が5（all + 4ソース）", () => {
      expect(SOURCE_TABS).toHaveLength(5);
    });

    it("順序が [all, zenn, hatena, googlenews, togetter]", () => {
      expect(SOURCE_TABS.map((t) => t.id)).toEqual([
        "all",
        "zenn",
        "hatena",
        "googlenews",
        "togetter",
      ]);
    });
  });

  describe("filterArticlesBySource（SourceTabs 内のフィルタ）", () => {
    const views = [
      makeView("zenn", "z1"),
      makeView("hatena", "h1"),
      makeView("zenn", "z2"),
      makeView("togetter", "t1"),
    ];

    it("all のとき全件を返す", () => {
      const result = filterArticlesBySource(views, "all");
      expect(result).toHaveLength(4);
    });

    it("特定ソースのとき該当ソースのみを返す", () => {
      const result = filterArticlesBySource(views, "zenn");
      expect(result).toHaveLength(2);
      expect(result.every((v) => v.sourceId === "zenn")).toBe(true);
    });

    it("該当なしのとき空配列を返す（SRC-05 ケース）", () => {
      const result = filterArticlesBySource(views, "googlenews");
      expect(result).toEqual([]);
    });

    it("入力配列を変異させない", () => {
      const input = [makeView("zenn", "z1")];
      const snapshot = [...input];
      filterArticlesBySource(input, "zenn");
      expect(input).toEqual(snapshot);
    });
  });
});

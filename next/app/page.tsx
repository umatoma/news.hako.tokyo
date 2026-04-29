import { ArticleList } from "@/components/article-list";
import { EmptyState } from "@/components/empty-state";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  articleRepository,
  computeDateThreshold,
  computePageStats,
  filterArticlesWithinDays,
  sortArticlesForDisplay,
  toListItemView,
} from "@/lib/articles";

const DISPLAY_WINDOW_DAYS = 3;
const PREFETCH_MARGIN_DAYS = 1;

export default async function Home() {
  const now = new Date();
  const thresholdDate = computeDateThreshold(
    DISPLAY_WINDOW_DAYS + PREFETCH_MARGIN_DAYS,
    now,
  );
  const candidates = await articleRepository.getArticlesPublishedSince(thresholdDate);
  const recent = filterArticlesWithinDays(candidates, DISPLAY_WINDOW_DAYS, now);
  const sorted = sortArticlesForDisplay(recent);
  const stats = computePageStats(sorted);
  const views = sorted.map(toListItemView);

  return (
    <>
      <Header stats={stats} />
      <main className="mx-auto w-full max-w-3xl flex-1 bg-white dark:bg-black">
        {views.length === 0 ? <EmptyState /> : <ArticleList views={views} />}
      </main>
      <Footer stats={stats} />
    </>
  );
}

import { ArticleList } from "@/components/article-list";
import { EmptyState } from "@/components/empty-state";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  articleRepository,
  computePageStats,
  filterArticlesWithinDays,
  sortArticlesForDisplay,
  toListItemView,
} from "@/lib/articles";

const DISPLAY_WINDOW_DAYS = 3;

export default async function Home() {
  const articles = await articleRepository.getAllArticles();
  const recent = filterArticlesWithinDays(articles, DISPLAY_WINDOW_DAYS);
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

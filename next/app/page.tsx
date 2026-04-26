import { ArticleList } from "@/components/article-list";
import { EmptyState } from "@/components/empty-state";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  articleRepository,
  computePageStats,
  sortArticlesForDisplay,
  toListItemView,
} from "@/lib/articles";

export default async function Home() {
  const articles = await articleRepository.getAllArticles();
  const sorted = sortArticlesForDisplay(articles);
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

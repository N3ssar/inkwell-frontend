import Link from "next/link";
import { Article } from "@/types/article";
import ArticleCard from "@/components/articles/ArticleCard";

async function getArticles() {
  const apiURL = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate=*`;
  if (!apiURL) return [];
  try {
    const response = await fetch(apiURL, { next: { revalidate: 60 } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data as Article[];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="cat-articles">
      <div className="container">
        <header className="cat-articles__header">
          <div className="cat-articles__title-row">
            <h1 className="cat-articles__title">All Articles</h1>
            <p className="cat-articles__subtitle">
              Browse all published articles.
            </p>
          </div>
          <div className="cat-articles__divider" aria-hidden="true" />
        </header>

        {articles.length === 0 ? (
          <div className="cat-articles__empty">
            <p className="cat-articles__empty-title">No articles yet</p>
          </div>
        ) : (
          <>
            <p className="cat-articles__count">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </p>

            <ul className="cat-articles__grid" role="list">
              {articles.map((article) => (
                <li key={article.id}>
                  <ArticleCard 
                    article={article} 
                    href={`/articles/${article.SLug}`} 
                    categoryName={article.category?.Name} 
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
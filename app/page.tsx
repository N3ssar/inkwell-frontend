import Link from "next/link";
import { Article } from "@/types/article";
import ArticleCard from "@/components/articles/ArticleCard";

async function getLatestArticles() {
  const apiURL = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?populate=*&sort=createdAt:desc&pagination[limit]=6`;
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

export default async function Home() {
  const articles = await getLatestArticles();

  return (
    <div className="home-page">
      {/* ── Hero Section ── */}
      <section className="home-page__hero">
        <div className="home-page__hero-glow" aria-hidden="true" />
        <div className="container">
          <div className="home-page__hero-content">
            <h1 className="home-page__hero-title">
              Inkwell <span className="home-page__hero-highlight">Magazine</span>
            </h1>
            <p className="home-page__hero-subtitle">
              A premium digital publication exploring technology, culture, history, and science through long-form editorial content.
            </p>
            <div className="home-page__hero-actions">
              <Link href="/articles" className="home-page__btn-primary">
                Read Latest Articles
              </Link>
              <Link href="/categories" className="home-page__btn-secondary">
                Browse Topics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest Articles Section ── */}
      <section className="home-page__latest">
        <div className="container">
          <div className="home-page__section-header">
            <h2 className="home-page__section-title">Latest Articles</h2>
            <Link href="/articles" className="home-page__section-link">
              View all →
            </Link>
          </div>
          
          {articles.length === 0 ? (
            <div className="cat-articles__empty">
              <p className="cat-articles__empty-title">No articles yet</p>
            </div>
          ) : (
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
          )}
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

import { Article } from "@/types/article";
import CategoryDetails from "@/components/categories/CategoryDetails";
import ArticleCard from "@/components/articles/ArticleCard";

async function getArticlesByCategory(categoryName: string) {
    const apiURL = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/articles?filters[category][Name][$eq]=${categoryName}&populate=*`;
    if (!apiURL) {
        console.error('NEXT_PUBLIC_STRAPI_API_URL is not defined. Using fallback articles');
        return [];
    }
    try {
        const response = await fetch(apiURL, {
            next: {
                revalidate: 60,
            },
        });
        if (!response.ok) {
            console.error('Failed to fetch articles by category. Status:', response.status);
            return [];
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching articles by category:', error);
        return [];
    }
}

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

// ── Helpers ───────────────────────────────────────────────
function formatCategoryName(raw: string): string {
  return raw
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Page ──────────────────────────────────────────────────
export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;
    const articles: Article[] = await getArticlesByCategory(category);
    const displayName = formatCategoryName(category);
    const apiBase = (process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "").replace(/\/$/, "");

    return (
        <div className="cat-articles">
            <div className="container">

                {/* ── Header ── */}
                <CategoryDetails title={displayName} />

                {/* ── Articles grid / empty state ── */}
                {articles.length === 0 ? (
                    <div className="cat-articles__empty">
                        <div className="cat-articles__empty-icon" aria-hidden="true">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="cat-articles__empty-title">No articles yet</p>
                        <p className="cat-articles__empty-text">
                            No articles found in <strong>{displayName}</strong> yet. Check back soon.
                        </p>
                        <Link href="/categories" className="cat-articles__empty-link">
                            Browse other categories →
                        </Link>
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
                                      href={`/categories/${category}/${article.SLug}`} 
                                      categoryName={displayName} 
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

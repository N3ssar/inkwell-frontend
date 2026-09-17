import Link from "next/link";
import Image from "next/image";

import { ArticleDetail } from "@/types/article";
import ArticleBlocks from "@/components/articles/ArticleBlocks";

// ── Data fetching ─────────────────────────────────────────
async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const apiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  try {
    const response = await fetch(
      `${apiURL}/api/articles?filters[SLug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data?.data?.[0] ?? null;
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// ── Props ─────────────────────────────────────────────────
interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// ── Helpers ───────────────────────────────────────────────
function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Page ──────────────────────────────────────────────────
export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const apiBase = (process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "").replace(/\/$/, "");

  // ── Not found ──
  if (!article) {
    return (
      <div className="article-page">
        <div className="container">
          <div className="article-page__not-found">
            <div className="article-page__not-found-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="article-page__not-found-title">Article not found</p>
            <p className="article-page__not-found-text">
              This article doesn&apos;t exist or may have been removed.
            </p>
            <Link href="/articles" className="article-page__not-found-link">
              ← Back to articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Cover image URL ──
  const imagePath =
    article.Covor?.formats?.large?.url ??
    article.Covor?.url ??
    null;
  const coverUrl = imagePath
    ? imagePath.startsWith("http") ? imagePath : `${apiBase}${imagePath}`
    : null;

  const author = article.users_permissions_user;
  const authorInitials = author ? getInitials(author.username) : null;

  return (
    <div className="article-page">

      {/* ── Hero cover ── */}
      {coverUrl && (
        <div className="article-page__hero">
          <Image
            src={coverUrl}
            alt={article.Covor?.alternativeText ?? article.Title}
            fill
            priority
            sizes="100vw"
            className="article-page__hero-img"
          />
          <div className="article-page__hero-overlay" aria-hidden="true" />
        </div>
      )}

      <div className="container">

        {/* ── Breadcrumb ── */}
        <nav className="article-page__breadcrumb" aria-label="Breadcrumb">
          <Link href="/articles" className="article-page__breadcrumb-link">
            Articles
          </Link>
          <span className="article-page__breadcrumb-sep" aria-hidden="true">/</span>
          <span className="article-page__breadcrumb-current" aria-current="page">
            {article.Title}
          </span>
        </nav>

        {/* ── Article header ── */}
        <header className="article-page__header">
          {article.category && (
            <span className="article-page__category-tag">
              {article.category.Name}
            </span>
          )}

          <h1 className="article-page__title">{article.Title}</h1>

          {article.Description && (
            <p className="article-page__description">{article.Description}</p>
          )}

          {/* Author + date row */}
          {(author || article.createdAt) && (
            <div className="article-page__meta">
              {author && (
                <Link href={`/users/${author.id}`} className="article-page__author">
                  <span className="article-page__author-avatar" aria-hidden="true">
                    {authorInitials}
                  </span>
                  <span className="article-page__author-name">{author.username}</span>
                </Link>
              )}
              {author && article.createdAt && (
                <span className="article-page__meta-dot" aria-hidden="true">·</span>
              )}
              {article.createdAt && (
                <time className="article-page__date" dateTime={article.createdAt}>
                  {formatDate(article.createdAt)}
                </time>
              )}
            </div>
          )}
        </header>

        <div className="article-page__divider" aria-hidden="true" />

        {/* ── Article body ── */}
        <div className="article-page__body">
          {article.Content && article.Content.length > 0
            ? <ArticleBlocks blocks={article.Content} apiBase={apiBase} />
            : <p>{article.Description}</p>
          }
        </div>

        {/* ── Footer ── */}
        <footer className="article-page__footer">
          <Link href="/articles" className="article-page__back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to articles
          </Link>

          {/* Author card */}
          {author && (
            <div className="article-page__author-card">
              <span className="article-page__author-card-avatar" aria-hidden="true">
                {authorInitials}
              </span>
              <div className="article-page__author-card-info">
                <p className="article-page__author-card-label">Written by</p>
                <Link href={`/users/${author.id}`} className="article-page__author-card-name">
                  {author.username}
                </Link>
                {author.Bio && (
                  <p className="article-page__author-card-bio">{author.Bio}</p>
                )}
              </div>
            </div>
          )}
        </footer>

      </div>
    </div>
  );
}

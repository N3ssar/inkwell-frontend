import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  href: string;
  categoryName?: string;
}

export default function ArticleCard({ article, href, categoryName }: ArticleCardProps) {
  const apiBase = (process.env.NEXT_PUBLIC_STRAPI_API_URL ?? "").replace(/\/$/, "");

  const imagePath =
    article.Covor?.formats?.medium?.url ??
    article.Covor?.url ??
    null;

  const coverUrl = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${apiBase}${imagePath}`
    : null;

  const displayCategory = categoryName || article.category?.Name || "Article";

  return (
    <Link href={href} className="cat-articles__card">
      {/* Cover image */}
      <div className="cat-articles__cover">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={article.Covor?.alternativeText ?? article.Title}
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 33vw"
            className="cat-articles__cover-img"
          />
        ) : (
          <div className="cat-articles__cover-placeholder" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="cat-articles__card-body">
        <span className="cat-articles__card-tag">{displayCategory}</span>

        <h2 className="cat-articles__card-title">{article.Title}</h2>

        {article.Description && (
          <p className="cat-articles__card-desc">
            {article.Description}
          </p>
        )}

        <span className="cat-articles__card-cta" aria-hidden="true">
          Read article →
        </span>
      </div>
    </Link>
  );
}

import Link from "next/link";

interface CategoryDetailsProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}

export default function CategoryDetails({ 
  title, 
  description = "Explore articles related to this category.", 
  backHref = "/categories", 
  backLabel = "Categories" 
}: CategoryDetailsProps) {
  return (
    <header className="cat-articles__header">
      <nav className="cat-articles__breadcrumb" aria-label="Breadcrumb">
        <Link href={backHref} className="cat-articles__back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {backLabel}
        </Link>
      </nav>

      <div className="cat-articles__title-row">
        <span className="cat-articles__eyebrow" aria-hidden="true">Topic</span>
        <h1 className="cat-articles__title">{title}</h1>
        {description && (
          <p className="cat-articles__subtitle">
            {description}
          </p>
        )}
      </div>

      <div className="cat-articles__divider" aria-hidden="true" />
    </header>
  );
}

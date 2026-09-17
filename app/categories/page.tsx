import Link from "next/link";

export const metadata = {
  title: "Categories — Inkwell",
  description: "Explore Inkwell articles by topic — from technology and science to culture and history.",
};

// ── Strapi response types ─────────────────────────────────
type Category = {
  id: number;
  documentId: string;
  Name: string;
  Description?: string;
};

type CategoriesResponse = {
  data: Category[];
};

// ── Category icon map ─────────────────────────────────────
// Maps a lowercase keyword in the category name to an SVG path
const CATEGORY_ICONS: Record<string, { d: string; viewBox?: string }> = {
  tech: {
    d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  },
  science: {
    d: "M9 3v11.5a3.5 3.5 0 0 0 7 0V3M6 3h12M5 21h14",
  },
  history: {
    d: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  },
  culture: {
    d: "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
  },
  politics: {
    d: "M3 6l3 1m0 0-3 9a5.002 5.002 0 0 0 6.001 0M6 7l3 9M6 7l6-2m6 2 3-1m-3 1-3 9a5.002 5.002 0 0 0 6.001 0M18 7l3 9m-3-9-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
  default: {
    d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  },
};

function getCategoryIcon(name: string) {
  const key = name.toLowerCase();
  for (const [keyword, icon] of Object.entries(CATEGORY_ICONS)) {
    if (keyword !== "default" && key.includes(keyword)) return icon;
  }
  return CATEGORY_ICONS.default;
}

// ── Category accent colour map ────────────────────────────
const CATEGORY_ACCENT: Record<string, string> = {
  tech: "var(--cat-tech)",
  science: "var(--cat-science)",
  history: "var(--cat-history)",
  culture: "var(--cat-culture)",
  politics: "var(--cat-politics)",
};

function getCategoryAccent(name: string): string {
  const key = name.toLowerCase();
  for (const [keyword, color] of Object.entries(CATEGORY_ACCENT)) {
    if (key.includes(keyword)) return color;
  }
  return "var(--cat-default)";
}

// ── Data fetching ─────────────────────────────────────────
async function getCategories(): Promise<CategoriesResponse> {
  const apiURL = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/categories`;
  try {
    const res = await fetch(apiURL, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { data: [] };
  }
}

// ── Page ──────────────────────────────────────────────────
export default async function Categories() {
  const response = await getCategories();
  const categories: Category[] = response?.data ?? [];

  return (
    <div className="categories-page">
      <div className="container">

        {/* ── Page header ── */}
        <header className="categories-page__header">
          <h1 className="categories-page__title">Categories</h1>
          <p className="categories-page__subtitle">
            Explore our articles by topic — find the subjects that interest you most.
          </p>
        </header>

        {/* ── Grid / Empty state ── */}
        {categories.length === 0 ? (
          <div className="categories-page__empty">
            <div className="categories-page__empty-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A2 2 0 0 1 3 12V7a4 4 0 0 1 4-4z" />
              </svg>
            </div>
            <p className="categories-page__empty-title">No categories yet</p>
            <p className="categories-page__empty-text">
              Topics will appear here once they&apos;re added.
            </p>
          </div>
        ) : (
          <ul className="categories-page__grid" role="list">
            {categories.map((cat) => {
              const icon = getCategoryIcon(cat.Name);
              const accent = getCategoryAccent(cat.Name);
              return (
                <Link href={`/categories/${cat.Name}`} key={cat.id}>
                
                  <article
                    className="categories-page__card"
                    style={{ "--cat-accent": accent } as React.CSSProperties}
                  >
                    {/* Icon bubble */}
                    <div className="categories-page__icon" aria-hidden="true">
                      <svg
                        width="22"
                        height="22"
                        viewBox={icon.viewBox ?? "0 0 24 24"}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={icon.d} />
                      </svg>
                    </div>

                    {/* Text */}
                    <div className="categories-page__content">
                      <h2 className="categories-page__name">{cat.Name}</h2>
                      {cat.Description && (
                        <p className="categories-page__description">
                          {cat.Description}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <span className="categories-page__arrow" aria-hidden="true">→</span>
                  </article>
                </Link>
              );
            })}
          </ul>
        )}

      </div>
    </div>
  );
}

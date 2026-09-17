import Link from "next/link";
import { type User } from '../page';

// Extended type to include extra fields returned by the API
type UserDetail = User & {
  confirmed?: boolean;
  createdAt?: string;
  Bio?: string;
};

async function getUserById(id: string): Promise<UserDetail> {
  const apiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  try {
    const response = await fetch(`${apiURL}/api/users/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch user with id: ${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return {} as UserDetail;
  }
}

interface UserProps {
  params: Promise<{ id: string }>;
}

// ── Helpers ───────────────────────────────────────────────
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Page ──────────────────────────────────────────────────
export default async function User({ params }: UserProps) {
  const { id } = await params;
  const user = await getUserById(id);

  // Handle not-found / empty response gracefully
  if (!user.username) {
    return (
      <div className="user-detail user-detail--not-found">
        <div className="container">
          <div className="user-detail__not-found">
            <span className="user-detail__not-found-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </span>
            <p className="user-detail__not-found-title">Author not found</p>
            <p className="user-detail__not-found-text">
              This profile doesn&apos;t exist or may have been removed.
            </p>
            <Link href="/users" className="user-detail__back-link">
              ← Back to Authors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = getInitials(user.username);

  return (
    <div className="user-detail">
      <div className="container">

        {/* ── Back link ── */}
        <nav className="user-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href="/users" className="user-detail__back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Authors
          </Link>
        </nav>

        {/* ── Profile card ── */}
        <article className="user-detail__card">

          {/* Header band */}
          <div className="user-detail__header">
            <div className="user-detail__avatar" aria-hidden="true">
              {initials}
            </div>

            <div className="user-detail__headline">
              <h1 className="user-detail__name">{user.username}</h1>

              {user.confirmed && (
                <span className="user-detail__verified" title="Verified author">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* ── Body ── */}
          <div className="user-detail__body">

            {/* Bio */}
            {user.Bio && (
              <section className="user-detail__section">
                <h2 className="user-detail__section-label">About</h2>
                <p className="user-detail__bio">{user.Bio}</p>
              </section>
            )}

            {/* Meta row */}
            <section className="user-detail__section">
              <h2 className="user-detail__section-label">Details</h2>
              <dl className="user-detail__meta">

                <div className="user-detail__meta-item">
                  <dt className="user-detail__meta-key">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Email
                  </dt>
                  <dd className="user-detail__meta-value">
                    <a href={`mailto:${user.email}`} className="user-detail__email-link">
                      {user.email}
                    </a>
                  </dd>
                </div>

                <div className="user-detail__meta-item">
                  <dt className="user-detail__meta-key">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Member since
                  </dt>
                  <dd className="user-detail__meta-value">
                    {formatDate(user.createdAt)}
                  </dd>
                </div>

              </dl>
            </section>

          </div>
        </article>

      </div>
    </div>
  );
}

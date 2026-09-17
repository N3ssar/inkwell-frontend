import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Authors — Inkwell",
  description: "Meet the writers and contributors behind Inkwell.",
};

async function getUsers() {
  const apiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  try {
    const response = await fetch(`${apiURL}/api/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export type User = {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar?: { url: string };
};

function UserAvatar({ user }: { user: User }) {
  const initial = user.username?.[0]?.toUpperCase() ?? "?";
  const avatarUrl = user.avatar?.url;

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={user.username}
        width={72}
        height={72}
        className="users-page__avatar-img"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    );
  }

  return (
    <span className="users-page__avatar-fallback" aria-hidden="true">
      {initial}
    </span>
  );
}

export default async function UsersPage() {
  const users: User[] = await getUsers();

  return (
    <div className="users-page">
      <div className="container">
        {/* ── Page header ── */}
        <header className="users-page__header">
          <h1 className="users-page__title">Authors</h1>
          <p className="users-page__subtitle">
            Meet the writers and contributors behind Inkwell.
          </p>
        </header>

        {/* ── Grid / Empty state ── */}
        {users.length === 0 ? (
          <div className="users-page__empty">
            <div className="users-page__empty-icon" aria-hidden="true">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="users-page__empty-title">No authors yet</p>
            <p className="users-page__empty-text">
              Check back soon — contributors will appear here.
            </p>
          </div>
        ) : (
          <ul className="users-page__grid" role="list">
            {users.map((user) => (
              <li key={user.id}>
                <Link href={`/users/${user.id}`} className="users-page__card">
                  <div className="users-page__avatar">
                    <UserAvatar user={user} />
                  </div>
                  <div className="users-page__info">
                    <span className="users-page__name">{user.username}</span>
                    <span className="users-page__email">{user.email}</span>
                    {user.bio && (
                      <p className="users-page__bio">{user.bio}</p>
                    )}
                  </div>
                  <span className="users-page__arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
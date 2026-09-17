import Link from 'next/link';

/* -----------------------------------------------
   Static navigation links for the footer
------------------------------------------------ */

const FOOTER_LINKS = [
  { label: 'Articles',   href: '/articles' },
  { label: 'Categories', href: '/categories' },
  { label: 'Users',      href: '/users' },
];

const LINKEDIN_URL =
  'https://www.linkedin.com/in/muhammad-ahmad-nassar/';

/* -----------------------------------------------
   Component
------------------------------------------------ */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand + Description */}
        <div className="footer__brand">
          <Link href="/" className="footer__brand-name" aria-label="Inkwell — go to homepage">
            Ink<span>well</span>
          </Link>
          <p className="footer__description">
            A dark digital magazine covering technology, history,
            culture, and science — written for curious minds.
          </p>
        </div>

        {/* Navigation */}
        <nav className="footer__nav" aria-label="Footer navigation">
          <p className="footer__nav-heading">Explore</p>
          <ul className="footer__nav-list" role="list">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="footer__nav-link">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={LINKEDIN_URL}
                className="footer__nav-link footer__nav-link--external"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile (opens in new tab)"
              >
                LinkedIn ↗
              </a>
            </li>
          </ul>
        </nav>

      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <p className="footer__copyright">
          &copy; {year} Inkwell. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

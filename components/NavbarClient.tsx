'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { NavItem } from './Navbar';

/* -----------------------------------------------
   Helper Components
------------------------------------------------ */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="M16.5 16.5L21 21" />
    </svg>
  );
}

/* -----------------------------------------------
   Props
------------------------------------------------ */

interface NavbarClientProps {
  navItems: NavItem[];
  siteName: string;
}

/* -----------------------------------------------
   Component
------------------------------------------------ */

export default function NavbarClient({
  navItems,
  siteName
}: NavbarClientProps) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  /* Close mobile menu when route changes */

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  /* Prevent body scroll when mobile menu is open */

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* Check if link is external */

  const isExternal = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://');

  /* Check active route */

  const isActive = (href: string) => {
    if (isExternal(href)) {
      return false;
    }

    if (href === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">

        {/* Brand */}

        <Link
          href="/"
          className="navbar__brand"
          aria-label="Inkwell — go to homepage"
        >
          <span className="navbar__brand-name">
            {siteName.slice(0,3)}
            <span>{siteName.slice(3)}</span>
          </span>
        </Link>

        {/* Desktop Navigation */}

        <nav
          className="navbar__nav"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const external = isExternal(item.href);

            if (external) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="navbar__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`navbar__link${
                  isActive(item.href)
                    ? ' navbar__link--active'
                    : ''
                }`}
                aria-current={
                  isActive(item.href)
                    ? 'page'
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}

        <div className="navbar__actions">

          <button
            className="navbar__search-btn"
            aria-label="Open search"
            type="button"
          >
            <SearchIcon />
          </button>

          <Link
            href="/subscribe"
            className="navbar__cta"
          >
            Subscribe
          </Link>

          {/* Mobile Toggle */}

          <button
            className="navbar__toggle"
            aria-label={
              isOpen
                ? 'Close menu'
                : 'Open menu'
            }
            aria-expanded={isOpen}
            aria-controls="navbar-mobile-menu"
            type="button"
            onClick={() => setIsOpen((value) => !value)}
          >
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
            <span className="navbar__toggle-bar" />
          </button>
        </div>

      </div>

      {/* Mobile Navigation */}

      <div
        id="navbar-mobile-menu"
        className="navbar__mobile"
        data-open={isOpen}
        aria-hidden={!isOpen}
      >
        <nav
          className="navbar__mobile-inner"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => {
            const external = isExternal(item.href);

            if (external) {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="navbar__mobile-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`navbar__mobile-link${
                  isActive(item.href)
                    ? ' navbar__mobile-link--active'
                    : ''
                }`}
                aria-current={
                  isActive(item.href)
                    ? 'page'
                    : undefined
                }
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}

          <div
            className="navbar__mobile-divider"
            role="separator"
          />

          <Link
            href="/subscribe"
            className="navbar__mobile-cta"
            onClick={() => setIsOpen(false)}
          >
            Subscribe — it&apos;s free
          </Link>

        </nav>
      </div>
    </header>
  );
}
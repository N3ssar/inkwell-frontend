import NavbarClient from './NavbarClient';

export interface NavItem {
  id: number;
  label: string;
  href: string;
  order?: number;
}

/* -----------------------------------------------
   Fallback Navigation Items
------------------------------------------------ */

const FALLBACK_NAV_ITEMS: NavItem[] = [
  {
    id: 1,
    label: 'Categories',
    href: '/categories',
    order: 1,
  },
  {
    id: 2,
    label: 'Articles',
    href: '/articles',
    order: 2,
  },
  {
    id: 3,
    label: 'Users',
    href: '/users',
    order: 3,
  },
  {
    id: 4,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/muhammad-ahmad-nassar/',
    order: 4,
  },
];
const FALLBACK_SITE_SETTINGS = { siteName: 'Inkwell'}

/* -----------------------------------------------
   Fetch Navigation Items From Strapi
------------------------------------------------ */

async function getNavigationItems(): Promise<NavItem[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    if (!apiUrl) {
      console.warn(
        'NEXT_PUBLIC_STRAPI_API_URL is not defined. Using fallback navigation.'
      );

      return FALLBACK_NAV_ITEMS;
    }

    const response = await fetch(
      `${apiUrl}/api/navigation-items`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch navigation items. Status: ${response.status}`
      );

      return FALLBACK_NAV_ITEMS;
    }

    const data = await response.json();

    /*
      Supports both Strapi v4 and newer Strapi response structures.
    */

    const navItems: NavItem[] = (data.data ?? [])
      .map((item: any) => {
        const attributes = item.attributes ?? item;

        return {
          id: item.id,
          label: attributes.label,
          href: attributes.href,
          order: attributes.order,
        };
      })
      .filter(
        (item: NavItem) =>
          typeof item.id === 'number' &&
          typeof item.label === 'string' &&
          item.label.trim().length > 0 &&
          typeof item.href === 'string' &&
          item.href.trim().length > 0
      );

    if (navItems.length === 0) {
      console.warn(
        'No valid navigation items found in Strapi. Using fallback navigation.'
      );

      return FALLBACK_NAV_ITEMS;
    }

    return navItems;
  } catch (error) {
    console.error(
      'Failed to fetch navigation items from Strapi:',
      error
    );

    return FALLBACK_NAV_ITEMS;
  }
}
/* -----------------------------------------------
  getSiteSettings
------------------------------------------------ */
async function getSiteSettings() {
  try {
    const apiURL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    if (!apiURL) {
      console.warn('NEXT_PUBLIC_STRAPI_API_URL is not defined. Using fallback Site Settings');

      return FALLBACK_SITE_SETTINGS;
    }
    const response = await fetch(`${apiURL}/api/site-setting`, {
      next: {
        revalidate: 300,
      },
    });
    if (!response.ok) {
      console.error(
        `Failed to fetch site settings. Status: ${response.status}`
      );
      return FALLBACK_SITE_SETTINGS;
    }
    const data = await response.json();
    return data.data;  
  } catch (error) {
    console.error('Failed to fetch Site Settings from Strapi:', error);

    return FALLBACK_SITE_SETTINGS;
  }
}

/* -----------------------------------------------
   Server Component
------------------------------------------------ */

export default async function Navbar() {
  const navItems = await getNavigationItems();
  const {Site_Name} = await getSiteSettings();

  return <NavbarClient siteName={Site_Name}  navItems={navItems} />;
}
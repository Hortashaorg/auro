import { Menu, Nav } from "@comp/atoms/navigation/index.ts";
import { Link } from "@comp/atoms/buttons/index.ts";
import { MenuSelect } from "@comp/molecules/navigation/index.ts";
import { type FC, getGlobalContext } from "@kalena/framework";
import { Breadcrumbs } from "@comp/molecules/navigation/index.ts";
import { calculateBreadcrumbSegments } from "@queries/other/breadcrumbs.ts";
import { Icon, Text, Title } from "@comp/atoms/typography/index.ts";
import { IconButton } from "@comp/atoms/buttons/index.ts";

interface NavLink {
  href: string;
  external?: boolean;
  text: string;
  condition: boolean;
}

interface NavSelect {
  text: string;
  condition: boolean;
  children: NavLink[];
}

export const Navbar = async () => {
  const context = getGlobalContext();
  const gameId = context.req.param("gameId");

  const breadcrumbSegments = await calculateBreadcrumbSegments();

  const currentPath = new URL(context.req.url).pathname;
  const isAdminPath = gameId ? context.req.routePath.includes("/admin") : false;

  const pageLinks: (NavLink | NavSelect)[] = [
    {
      href: "/",
      text: "Home",
      condition: !gameId,
    },
    {
      href: "/games",
      text: "Games",
      condition: context.var.isLoggedIn && !gameId,
    },
    {
      href: `/games/${gameId}`,
      text: "Overview",
      condition: context.var.isLoggedIn && !!gameId && !isAdminPath,
    },
    {
      href: `/games/${gameId}/resources`,
      text: "Resources",
      condition: context.var.isLoggedIn && !!gameId && !isAdminPath,
    },
    {
      href: `/games/${gameId}/leaderboard`,
      text: "Leaderboard",
      condition: context.var.isLoggedIn && !!gameId && !isAdminPath,
    },
    {
      href: `/games/${gameId}/action-log`,
      text: "Action Log",
      condition: context.var.isLoggedIn && !!gameId && !isAdminPath,
    },
    {
      href: `/games/${gameId}/admin`,
      text: "Admin",
      condition: context.var.isLoggedIn && !!gameId && isAdminPath,
    },
    {
      text: "Configuration",
      condition: context.var.isLoggedIn && !!gameId && isAdminPath,
      children: [
        {
          href: `/games/${gameId}/admin/locations`,
          text: "Locations",
          condition: true,
        },
        {
          href: `/games/${gameId}/admin/actions`,
          text: "Actions",
          condition: true,
        },
        {
          href: `/games/${gameId}/admin/resources`,
          text: "Resources",
          condition: true,
        },
        {
          href: `/games/${gameId}/admin/items`,
          text: "Items",
          condition: true,
        },
      ],
    },
  ];

  const userLinks: (NavLink | NavSelect)[] = [
    {
      text: "Account",
      condition: context.var.isLoggedIn,
      children: [
        {
          href: "/profile",
          text: "Profile",
          condition: true,
        },
        {
          href: context.var.logoutUrl,
          text: "Logout",
          external: true,
          condition: true,
        },
      ],
    },
    {
      href: context.var.loginUrl,
      text: "Login",
      external: true,
      condition: !context.var.isLoggedIn,
    },
  ];

  return (
    <header className="flex flex-col" x-data="{ mobileMenuOpen: false }">
      <Nav id="section-navbar" className="flex items-center">
        <Menu className="h-full hidden md:flex">
          <TopMenuItems items={pageLinks} currentPath={currentPath} />
        </Menu>

        <Menu x-data="themeData" className="h-full gap-2 hidden md:flex">
          <IconButton
            aria-label="Toggle dark mode"
            x-on:click="themeToggle"
          >
            <Text>
              <Icon icon="sun" x-show="isDarkMode" size="size-7" x-cloak />
              <Icon icon="moon" x-show="!isDarkMode" size="size-7" x-cloak />
            </Text>
          </IconButton>
          <TopMenuItems items={userLinks} currentPath={currentPath} />
        </Menu>

        <div className="md:hidden flex-grow"></div>
        <Menu x-data="themeData" className="h-full gap-2 md:hidden">
          <IconButton
            aria-label="Toggle dark mode"
            x-on:click="themeToggle"
          >
            <Text>
              <Icon icon="sun" x-show="isDarkMode" size="size-7" x-cloak />
              <Icon icon="moon" x-show="!isDarkMode" size="size-7" x-cloak />
            </Text>
          </IconButton>
          <IconButton
            aria-label="Open menu"
            x-on:click="mobileMenuOpen = !mobileMenuOpen"
          >
            <Icon icon="menu" size="size-7" />
          </IconButton>
        </Menu>
      </Nav>

      <Menu
        x-data="{ name: '' }"
        variant="vertical"
        x-show="mobileMenuOpen"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 scale-95"
        x-transition:enter-end="opacity-100 scale-100"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 scale-100"
        x-transition:leave-end="opacity-0 scale-95"
        x-cloak
        className="fixed inset-0 z-50 flex min-h-screen bg-surface dark:bg-surface-dark md:hidden"
      >
        <div className="flex justify-between items-center mb-4">
          <Title>Menu</Title>
          <IconButton
            aria-label="Close menu"
            x-on:click="mobileMenuOpen = false"
            background="surface"
            backgroundHover="surfaceAlt"
          >
            <Icon icon="x" size="size-7" />
          </IconButton>
        </div>
        <Breadcrumbs segments={breadcrumbSegments} className="mb-4" />
        <MobileMenuItems items={pageLinks} currentPath={currentPath} />

        <hr className="border-2 dark:border-surface-dark-alt border-surface-alt my-4" />

        <MobileMenuItems items={userLinks} currentPath={currentPath} />
      </Menu>

      <div className="w-full py-2.5 px-5 hidden md:flex">
        <Breadcrumbs segments={breadcrumbSegments} />
      </div>
    </header>
  );
};

type TopMenuItemsProps = {
  items: (NavLink | NavSelect)[];
  currentPath: string;
};
const TopMenuItems: FC<TopMenuItemsProps> = ({ items, currentPath }) => {
  const isActive = (path: string) => currentPath === path;

  return (
    <>
      {items.map((link) => {
        if (!link.condition) return null;

        if ("children" in link) {
          return (
            <MenuSelect
              key={link.text}
              name={link.text}
              textHover="strong"
              activeStyle="surface"
              active={link.children.some((child) => isActive(child.href))}
            >
              {link.children.map((child) => (
                <Link
                  key={child.text}
                  href={child.href!}
                  size="md"
                  external={!!child.external}
                  background="surfaceAlt"
                  backgroundHover="surface"
                  active={isActive(child.href)}
                  activeStyle="surface"
                  variant="menuItem"
                >
                  {child.text}
                </Link>
              ))}
            </MenuSelect>
          );
        }

        return (
          <Link
            key={link.text}
            href={link.href!}
            external={!!link.external}
            size="md"
            activeStyle="surface"
            textHover="strong"
            active={isActive(link.href!)}
          >
            {link.text}
          </Link>
        );
      })}
    </>
  );
};

type MobileMenuItemsProps = {
  items: (NavLink | NavSelect)[];
  currentPath: string;
};

const MobileMenuItems: FC<MobileMenuItemsProps> = ({ items, currentPath }) => {
  const isActive = (path: string) => currentPath === path;

  return (
    <>
      {items.map((link) => {
        if (!link.condition) return null;

        if ("children" in link) {
          return (
            <MenuSelect
              key={link.text}
              name={link.text}
              backgroundHover="surfaceAlt"
              variant="fullWidth"
              open={link.children.some((child) => isActive(child.href))}
            >
              {link.children.map((child) => (
                <Link
                  key={child.text}
                  href={child.href}
                  external={!!child.external}
                  size="md"
                  active={isActive(child.href)}
                  backgroundHover="surfaceAlt"
                  activeStyle="surfaceAlt"
                >
                  {child.text}
                </Link>
              ))}
            </MenuSelect>
          );
        }

        return (
          <Link
            key={link.text}
            href={link.href}
            external={!!link.external}
            active={isActive(link.href!)}
            activeStyle="surfaceAlt"
            backgroundHover="surfaceAlt"
            size="md"
            x-on:click="mobileMenuOpen = false"
          >
            {link.text}
          </Link>
        );
      })}
    </>
  );
};

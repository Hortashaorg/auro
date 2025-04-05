import { Menu, Nav } from "@comp/atoms/navigation/index.ts";
import { Link } from "@comp/atoms/buttons/index.ts";
import { MenuSelect } from "@comp/molecules/navigation/index.ts";
import { FC, getGlobalContext } from "@kalena/framework";
import { Breadcrumbs } from "@comp/molecules/navigation/index.ts";
import { calculateBreadcrumbSegments } from "@queries/other/breadcrumbs.ts";
import { Icon, Text, Title } from "@comp/atoms/typography/index.ts";

interface NavLink {
  href: string;
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
  const serverId = context.req.param("serverId");

  const breadcrumbSegments = await calculateBreadcrumbSegments();

  const currentPath = new URL(context.req.url).pathname;
  const isAdminPath = serverId
    ? context.req.routePath.includes("/admin")
    : false;

  const pageLinks: (NavLink | NavSelect)[] = [
    {
      href: "/",
      text: "Home",
      condition: !serverId,
    },
    {
      href: "/servers",
      text: "Servers",
      condition: context.var.isLoggedIn && !serverId,
    },
    {
      href: `/servers/${serverId}`,
      text: "Overview",
      condition: context.var.isLoggedIn && !!serverId && !isAdminPath,
    },
    {
      href: `/servers/${serverId}/resources`,
      text: "Resources",
      condition: context.var.isLoggedIn && !!serverId && !isAdminPath,
    },
    {
      href: `/servers/${serverId}/leaderboard`,
      text: "Leaderboard",
      condition: context.var.isLoggedIn && !!serverId && !isAdminPath,
    },
    {
      href: `/servers/${serverId}/admin`,
      text: "Admin",
      condition: context.var.isLoggedIn && !!serverId && isAdminPath,
    },
    {
      text: "Configuration",
      condition: context.var.isLoggedIn && !!serverId && isAdminPath,
      children: [
        {
          href: `/servers/${serverId}/admin/locations`,
          text: "Locations",
          condition: true,
        },
        {
          href: `/servers/${serverId}/admin/actions`,
          text: "Actions",
          condition: true,
        },
        {
          href: `/servers/${serverId}/admin/resources`,
          text: "Resources",
          condition: true,
        },
        {
          href: `/servers/${serverId}/admin/items`,
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
          condition: true,
        },
      ],
    },
    {
      href: context.var.loginUrl,
      text: "Login",
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
          <button
            type="button"
            aria-label="Toggle dark mode"
            x-on:click="themeToggle"
            className="px-2 py-2 hover:bg-surface dark:hover:bg-surface-dark bg-surface-alt dark:bg-surface-dark-alt rounded-full cursor-pointer"
          >
            <Text>
              <Icon icon="sun" x-show="isDarkMode" size="size-7" x-cloak />
              <Icon icon="moon" x-show="!isDarkMode" size="size-7" x-cloak />
            </Text>
          </button>
          <TopMenuItems items={userLinks} currentPath={currentPath} />
        </Menu>

        <div className="md:hidden flex-grow"></div>
        <Menu x-data="themeData" className="h-full gap-2 md:hidden">
          <button
            type="button"
            aria-label="Toggle dark mode"
            x-on:click="themeToggle"
            className="px-2 py-2 hover:bg-surface dark:hover:bg-surface-dark bg-surface-alt dark:bg-surface-dark-alt rounded-full cursor-pointer"
          >
            <Text>
              <Icon icon="sun" x-show="isDarkMode" size="size-7" x-cloak />
              <Icon icon="moon" x-show="!isDarkMode" size="size-7" x-cloak />
            </Text>
          </button>
          <button
            type="button"
            aria-label="Open menu"
            x-on:click="mobileMenuOpen = !mobileMenuOpen"
            className="px-2 py-2 hover:bg-surface dark:hover:bg-surface-dark bg-surface-alt dark:bg-surface-dark-alt rounded-full cursor-pointer"
          >
            <Icon icon="menu" size="size-7" />
          </button>
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
          <button
            type="button"
            aria-label="Close menu"
            x-on:click="mobileMenuOpen = false"
            className="px-2 py-2 hover:bg-surface-alt dark:hover:bg-surface-dark-alt bg-surface dark:bg-surface-dark rounded-full cursor-pointer"
          >
            <Icon icon="x" size="size-7" />
          </button>
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
            href={link.href!}
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

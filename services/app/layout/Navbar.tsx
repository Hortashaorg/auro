import { Menu, Nav } from "@comp/atoms/navigation/index.ts";
import { Link } from "@comp/atoms/buttons/index.ts";
import { MenuSelect } from "@comp/molecules/navigation/index.ts";
import { getGlobalContext } from "@kalena/framework";
import { Breadcrumbs } from "@comp/molecules/navigation/index.ts";
import { calculateBreadcrumbSegments } from "@queries/other/breadcrumbs.ts";
import { Icon, Text } from "@comp/atoms/typography/index.ts";

interface NavLink {
  href: string;
  text: string;
  condition: boolean;
}

export const Navbar = async () => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId");

  const breadcrumbSegments = await calculateBreadcrumbSegments();

  const currentPath = context.req.path;
  const isActive = (path: string) => currentPath.includes(path);
  const isAdminPath = serverId
    ? context.req.routePath.includes("/admin")
    : false;

  const navLinks: NavLink[] = [
    // Home Link
    {
      href: "/",
      text: "Home",
      condition: !serverId,
    },
    // Servers Link
    {
      href: "/servers",
      text: "Servers",
      condition: context.var.isLoggedIn && !serverId,
    },
    // Server Overview (Player)
    {
      href: `/servers/${serverId}`,
      text: "Overview",
      condition: context.var.isLoggedIn && !!serverId && !isAdminPath,
    },
    // Server Resources (Player)
    {
      href: `/servers/${serverId}/resources`,
      text: "Resources",
      condition: context.var.isLoggedIn && !!serverId && !isAdminPath,
    },
    // Server Leaderboard (Player)
    {
      href: `/servers/${serverId}/leaderboard`,
      text: "Leaderboard",
      condition: context.var.isLoggedIn && !!serverId && !isAdminPath,
    },
    // Admin Overview
    {
      href: `/servers/${serverId}/admin`,
      text: "Admin",
      condition: context.var.isLoggedIn && !!serverId && isAdminPath,
    },
    // Admin Locations
    {
      href: `/servers/${serverId}/admin/locations`,
      text: "Locations",
      condition: context.var.isLoggedIn && !!serverId && isAdminPath,
    },
    // Admin Actions
    {
      href: `/servers/${serverId}/admin/actions`,
      text: "Actions",
      condition: context.var.isLoggedIn && !!serverId && isAdminPath,
    },
    // Admin Resources
    {
      href: `/servers/${serverId}/admin/resources`,
      text: "Resources",
      condition: context.var.isLoggedIn && !!serverId && isAdminPath,
    },
    // Admin Items
    {
      href: `/servers/${serverId}/admin/items`,
      text: "Items",
      condition: context.var.isLoggedIn && !!serverId && isAdminPath,
    },
  ];

  return (
    <header className="flex flex-col">
      <Nav id="section-navbar" className="flex items-center">
        <Menu className="h-full">
          {navLinks.map((link) =>
            link.condition && (
              <Link
                key={link.text}
                href={link.href}
                size="md"
                activeStyle="background"
                active={isActive(link.href)}
              >
                {link.text}
              </Link>
            )
          )}
        </Menu>

        <Menu x-data="themeData" className="h-full gap-2">
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
          {context.var.isLoggedIn
            ? (
              <MenuSelect name="Account" variant="single" flow="left">
                <Link
                  href="/profile"
                  size="md"
                  display="block"
                  background="alt"
                >
                  Profile
                </Link>
                <Link
                  href={context.var.logoutUrl}
                  size="md"
                  display="block"
                  background="alt"
                >
                  Logout
                </Link>
              </MenuSelect>
            )
            : (
              <Link
                href={context.var.loginUrl}
                size="md"
              >
                Login
              </Link>
            )}
        </Menu>
      </Nav>

      <div className="w-full py-2.5 px-5">
        <Breadcrumbs segments={breadcrumbSegments} />
      </div>
    </header>
  );
};

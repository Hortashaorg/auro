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
  const isActive = (path: string) => currentPath === path;
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

  // Define links for the account menu
  const userLinks: (NavLink | NavSelect)[] = [
    // Account Dropdown (if logged in)
    {
      text: "Account",
      condition: context.var.isLoggedIn,
      children: [
        {
          href: "/profile",
          text: "Profile",
          condition: true, // Handled by parent
        },
        {
          href: context.var.logoutUrl,
          text: "Logout",
          condition: true, // Handled by parent
        },
      ],
    },
    // Login Link (if logged out)
    {
      href: context.var.loginUrl,
      text: "Login",
      condition: !context.var.isLoggedIn,
    },
  ];

  return (
    <header className="flex flex-col">
      <Nav id="section-navbar" className="flex items-center">
        <Menu className="h-full">
          {pageLinks.map((link) => {
            if (!link.condition) return null;

            if ("children" in link) {
              return (
                <MenuSelect key={link.text} name={link.text} variant="single">
                  {link.children.map((child) => (
                    <Link
                      key={child.text}
                      href={child.href!}
                      size="md"
                      display="block"
                      background="alt"
                      active={isActive(child.href!)}
                      activeStyle="background"
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
                activeStyle="background"
                active={isActive(link.href!)}
              >
                {link.text}
              </Link>
            );
          })}
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
          {userLinks.map((link) => {
            if (!link.condition) return null;

            if ("children" in link) {
              return (
                <MenuSelect key={link.text} name={link.text} variant="single">
                  {link.children.map((child) => (
                    <Link
                      key={child.text}
                      href={child.href!}
                      size="md"
                      display="block"
                      background="alt"
                      active={isActive(child.href!)}
                      activeStyle="background"
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
                activeStyle="background"
                active={isActive(link.href!)}
              >
                {link.text}
              </Link>
            );
          })}
        </Menu>
      </Nav>

      <div className="w-full py-2.5 px-5">
        <Breadcrumbs segments={breadcrumbSegments} />
      </div>
    </header>
  );
};

import { Menu, Nav } from "@comp/atoms/navigation/index.ts";
import { Link } from "@comp/atoms/buttons/index.ts";
import { MenuSelect } from "@comp/molecules/navigation/index.ts";
import { getGlobalContext } from "@kalena/framework";
import { Breadcrumbs } from "@comp/molecules/navigation/index.ts";
import { calculateBreadcrumbSegments } from "@queries/other/breadcrumbs.ts";
import { Icon, Text } from "@comp/atoms/typography/index.ts";

export const Navbar = async () => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId");

  const breadcrumbSegments = await calculateBreadcrumbSegments();

  const currentPath = context.req.path;
  const isActive = (path: string) => currentPath.includes(path);
  const isAdminPath = context.req.routePath.includes("/admin");

  return (
    <header className="flex flex-col">
      <Nav id="section-navbar" className="flex items-center">
        <Menu className="h-full">
          {!serverId && (
            <Link
              href="/"
              size="md"
              activeStyle="background"
              active={currentPath === "/"}
            >
              Home
            </Link>
          )}
          {context.var.isLoggedIn && !serverId && (
            <Link
              href="/servers"
              size="md"
              activeStyle="background"
              active={currentPath === "/servers"}
            >
              Servers
            </Link>
          )}
          {context.var.isLoggedIn && serverId && !isAdminPath && (
            <>
              <Link
                href={`/servers/${serverId}`}
                size="md"
                activeStyle="background"
                active={currentPath === `/servers/${serverId}`}
              >
                Overview
              </Link>
              <Link
                href={`/servers/${serverId}/resources`}
                size="md"
                activeStyle="background"
                active={currentPath === `/servers/${serverId}/resources`}
              >
                Resources
              </Link>
              <Link
                href={`/servers/${serverId}/leaderboard`}
                size="md"
                activeStyle="background"
                active={currentPath === `/servers/${serverId}/leaderboard`}
              >
                Leaderboard
              </Link>
            </>
          )}
          {context.var.isLoggedIn && isAdminPath && (
            <>
              <Link
                href={`/servers/${serverId}/admin/locations`}
                size="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/admin/locations`)}
              >
                Locations
              </Link>
              <Link
                href={`/servers/${serverId}/admin/actions`}
                size="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/admin/actions`)}
              >
                Actions
              </Link>
              <Link
                href={`/servers/${serverId}/admin/resources`}
                size="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/admin/resources`)}
              >
                Resources
              </Link>
              <Link
                href={`/servers/${serverId}/admin/items`}
                size="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/admin/items`)}
              >
                Items
              </Link>
            </>
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

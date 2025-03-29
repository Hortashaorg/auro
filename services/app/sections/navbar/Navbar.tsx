import { Menu, Nav } from "@comp/wrappers/index.ts";
import { Link } from "@comp/atoms/buttons/index.ts";
import { MenuSelect } from "@comp/form/index.ts";
import { getGlobalContext } from "@kalena/framework";
import { serverAndUser } from "@queries/serverAndUser.ts";
import { Breadcrumbs } from "@comp/molecules/navigation/index.ts";
import { calculateBreadcrumbSegments } from "@queries/breadcrumbs.ts";
import { Text } from "@comp/atoms/typography/index.ts";

export const Navbar = async () => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId");
  const email = context.var.email;

  const data = serverId && email ? await serverAndUser(serverId, email) : null;

  const isServer = !!data;
  const isAdmin = isServer && data.user.type === "admin";
  const isPlayer = isServer && data.user.type === "player";

  const breadcrumbSegments = await calculateBreadcrumbSegments();

  const currentPath = context.req.path;
  const isActive = (path: string) => currentPath.includes(path);

  return (
    <header className="flex flex-col">
      <Nav id="section-navbar" className="h-14 flex items-center">
        <Menu className="h-full">
          {!isServer && (
            <Link
              href="/"
              variant="default"
              padding="md"
              activeStyle="background"
              active={currentPath === "/"}
            >
              Home
            </Link>
          )}
          {context.var.isLoggedIn && !isServer && (
            <Link
              href="/servers"
              variant="default"
              padding="md"
              activeStyle="background"
              active={currentPath === "/servers"}
            >
              Servers
            </Link>
          )}
          {context.var.isLoggedIn && isServer && (
            <Link
              href={`/servers/${serverId}`}
              variant="default"
              padding="md"
              activeStyle="background"
              active={currentPath === `/servers/${serverId}`}
            >
              Overview
            </Link>
          )}
          {context.var.isLoggedIn && isPlayer && (
            <Link
              href={`/servers/${serverId}/leaderboard`}
              variant="default"
              padding="md"
              activeStyle="background"
              active={currentPath === `/servers/${serverId}/leaderboard`}
            >
              Leaderboard
            </Link>
          )}
          {context.var.isLoggedIn && isAdmin && (
            <>
              <Link
                href={`/servers/${serverId}/locations`}
                variant="default"
                padding="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/locations`)}
              >
                Locations
              </Link>
              <Link
                href={`/servers/${serverId}/actions`}
                variant="default"
                padding="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/actions`)}
              >
                Actions
              </Link>
              <Link
                href={`/servers/${serverId}/resources`}
                variant="default"
                padding="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/resources`)}
              >
                Resources
              </Link>
              <Link
                href={`/servers/${serverId}/items`}
                variant="default"
                padding="md"
                activeStyle="background"
                active={isActive(`/servers/${serverId}/items`)}
              >
                Items
              </Link>
            </>
          )}
        </Menu>

        <Menu x-data="themeData" className="h-full gap-2">
          <button
            type="button"
            x-on:click="themeToggle"
            className="px-2 py-2 hover:bg-surface dark:hover:bg-surface-dark bg-surface-alt dark:bg-surface-dark-alt rounded-full cursor-pointer"
          >
            <Text>
              <i data-lucide="sun" x-show="isDarkMode" x-cloak></i>
              <i data-lucide="moon" x-show="!isDarkMode" x-cloak></i>
            </Text>
          </button>
          {context.var.isLoggedIn
            ? (
              <MenuSelect name="Account" variant="single" flow="left">
                <Link
                  href="/profile"
                  variant="subtle"
                  padding="sm"
                  display="block"
                  className="text-center"
                >
                  Profile
                </Link>
                <Link
                  href={context.var.logoutUrl}
                  variant="subtle"
                  padding="sm"
                  display="block"
                  className="text-center"
                >
                  Logout
                </Link>
              </MenuSelect>
            )
            : (
              <Link
                href={context.var.loginUrl}
                variant="default"
                padding="md"
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

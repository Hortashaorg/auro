import { Header } from "@comp/navigation/Header.tsx";
import { Link } from "@comp/navigation/Link.tsx";
import { Menu } from "@comp/navigation/Menu.tsx";
import { NavButton } from "@comp/navigation/NavButton.tsx";
import { Select } from "@comp/navigation/Select.tsx";
import { getGlobalContext } from "@kalena/framework";
import { serverAndUser } from "@queries/serverAndUser.ts";
import { Breadcrumbs } from "@comp/navigation/Breadcrumbs.tsx";
import { calculateBreadcrumbSegments } from "@queries/breadcrumbs.ts";

export const Navbar = async () => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId");
  const email = context.var.email;

  const data = serverId && email ? await serverAndUser(serverId, email) : null;

  const isServer = !!data;
  const isAdmin = isServer && data.user.type === "admin";

  // Calculate breadcrumb segments for navigation
  const breadcrumbSegments = await calculateBreadcrumbSegments();

  return (
    <div className="flex flex-col w-full">
      <div className="bg-background-900 text-text-50 border-b border-border-700">
        <div className="container mx-auto">
          <Header id="section-navbar" className="h-14 flex items-center">
            <Menu className="h-full">
              {context.var.isLoggedIn && isServer && (
                <Link href={`/servers/${serverId}`} variant="navLink">
                  Overview
                </Link>
              )}
              {context.var.isLoggedIn && isAdmin && (
                <>
                  <Link
                    href={`/servers/${serverId}/locations`}
                    variant="navLink"
                  >
                    Locations
                  </Link>
                  <Link
                    href={`/servers/${serverId}/actions`}
                    variant="navLink"
                  >
                    Actions
                  </Link>
                  <Link
                    href={`/servers/${serverId}/resources`}
                    variant="navLink"
                  >
                    Resources
                  </Link>
                  <Link
                    href={`/servers/${serverId}/items`}
                    variant="navLink"
                  >
                    Items
                  </Link>
                </>
              )}
            </Menu>

            <Menu x-data="themeData" className="h-full">
              <NavButton
                x-on:click="themeToggle"
                x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
              />
              {context.var.isLoggedIn
                ? (
                  <Select name="Profile" variant="single" flow="left">
                    <Link href="/servers" variant="dropdownLink">
                      Servers
                    </Link>
                    <Link href={context.var.logoutUrl} variant="dropdownLink">
                      Logout
                    </Link>
                  </Select>
                )
                : (
                  <Link
                    href={context.var.loginUrl}
                    variant="dropdownLink"
                  >
                    Login
                  </Link>
                )}
            </Menu>
          </Header>
        </div>
      </div>

      <div className="w-full bg-background-800 text-text-200 border-b border-border-700">
        <div className="container mx-auto py-2.5">
          <Breadcrumbs segments={breadcrumbSegments} />
        </div>
      </div>
    </div>
  );
};

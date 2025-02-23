import { Header } from "@comp/navigation/Header.tsx";
import { Link } from "@comp/navigation/Link.tsx";
import { Menu } from "@comp/navigation/Menu.tsx";
import { NavButton } from "@comp/navigation/NavButton.tsx";
import { Select } from "@comp/navigation/Select.tsx";
import { getGlobalContext } from "@kalena/framework";
import { serverAndUser } from "@queries/serverAndUser.ts";

export const Navbar = async () => {
  const context = getGlobalContext();
  const serverId = context.req.param("serverId");
  const email = context.var.email;

  const data = serverId && email ? await serverAndUser(serverId, email) : null;

  const isServer = !!data;
  const isAdmin = isServer && data.user.type === "admin";

  return (
    <Header id="section-navbar">
      <Menu>
        {context.var.isLoggedIn && isServer && (
          <Link href={`/servers/${serverId}`} variant="dropdownLink">
            Overview
          </Link>
        )}
        {context.var.isLoggedIn && isAdmin && (
          <Link href={`/servers/${serverId}/locations`} variant="dropdownLink">
            Locations
          </Link>
        )}
        {context.var.isLoggedIn && !isServer && (
          <Link href="/servers" variant="dropdownLink">Servers</Link>
        )}
      </Menu>

      <Menu x-data="themeData">
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
  );
};

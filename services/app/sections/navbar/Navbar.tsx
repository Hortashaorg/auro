import { Header } from "@comp/navigation/Header.tsx";
import { Link } from "@comp/navigation/Link.tsx";
import { Menu } from "@comp/navigation/Menu.tsx";
import { NavButton } from "@comp/navigation/NavButton.tsx";
import { Select } from "@comp/navigation/Select.tsx";
import { getGlobalContext } from "@kalena/framework";

export const Navbar = () => {
  const context = getGlobalContext();

  return (
    <Header id="section-navbar">
      {context.var.isLoggedIn && (
        <Menu>
          <Link href="/servers" variant="dropdownLink">Servers</Link>
        </Menu>
      )}

      <Menu x-data="themeData">
        <NavButton
          x-on:click="themeToggle"
          x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
        />
        {context.var.isLoggedIn
          ? (
            <Select name="Profile" variant="single" flow="left">
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

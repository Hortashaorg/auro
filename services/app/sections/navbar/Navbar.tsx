import { Header } from "@kalena/components/navigation";
import { Link } from "@kalena/components/navigation";
import { Menu } from "@kalena/components/navigation";
import { NavButton } from "@kalena/components/navigation";
import { Select } from "@kalena/components/navigation";
import { getGlobalContext } from "@package/framework";

export const Navbar = () => {
  const context = getGlobalContext();

  return (
    <Header id="section-navbar">
      {context.var.isLoggedIn
        ? (
          <Menu>
            <Select name="Admin" variant="double" flow="right">
              <Link href="/admin/locations" variant="dropdownLink">
                Locations
              </Link>
              <Link href="/admin/skills" variant="dropdownLink">Skills</Link>
              <Link href="/admin/currencies" variant="dropdownLink">
                Currencies
              </Link>
              <Link href="/admin/items" variant="dropdownLink">Items</Link>
            </Select>
            <Link href="/servers" variant="dropdownLink">Servers</Link>
          </Menu>
        )
        : (
          <Menu>
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
              <Link href="/profile" variant="dropdownLink">Profile</Link>
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

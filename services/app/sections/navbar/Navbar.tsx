import { Header } from "@sections/navbar/components/Header.tsx";
import { Link } from "@sections/navbar/components/Link.tsx";
import { Menu } from "@sections/navbar/components/Menu.tsx";
import { NavButton } from "@sections/navbar/components/NavButton.tsx";
import { Select } from "@sections/navbar/components/Select.tsx";
import { getContext } from "@context/index.ts";

export const Navbar = () => {
  const context = getContext();
  const isLoggedIn = !!context.account;

  return (
    <Header>
      {isLoggedIn && (
        <Menu>
          <Select name="Admin" variant="double" flow="right">
            <Link href="/servers" variant="dropdownLink">Servers</Link>
            <Link href="/admin/locations" variant="dropdownLink">
              Locations
            </Link>
            <Link href="/admin/skills" variant="dropdownLink">Skills</Link>
            <Link href="/admin/currencies" variant="dropdownLink">
              Currencies
            </Link>
            <Link href="/admin/items" variant="dropdownLink">Items</Link>
          </Select>
        </Menu>
      )}
      <Menu></Menu>
      <Menu x-data="themeData">
        <NavButton
          x-on:click="themeToggle"
          x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
        />
        {isLoggedIn
          ? (
            <Select name="Profile" variant="single" flow="left">
              <Link href="/profile" variant="dropdownLink">Profile</Link>
              <Link href="/logout" variant="dropdownLink">Logout</Link>
            </Select>
          )
          : (
            <Link
              href={`${Deno.env.get("GOOGLE_LOGIN_BASE_URL")}?client_id=${
                Deno.env.get("GOOGLE_CLIENT_ID")
              }&redirect_uri=${context.url.origin}/login&response_type=code&scope=email&access_type=offline&prompt=consent`}
              variant="dropdownLink"
            >
              Login
            </Link>
          )}
      </Menu>
    </Header>
  );
};

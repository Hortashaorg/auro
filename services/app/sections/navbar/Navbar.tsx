import { Header } from "@sections/navbar/components/Header.tsx";
import { Menu } from "@sections/navbar/components/Menu.tsx";
import { Select } from "@sections/navbar/components/Select.tsx";
import { Link } from "@sections/navbar/components/Link.tsx";
import { NavButton } from "@sections/navbar/components/NavButton.tsx";

export const Navbar = () => {
  return (
    <Header>
      <Menu>
        <Select name="Admin" variant="double" flow="right">
          <Link href="/admin/locations" variant="dropdownLink">Locations</Link>
          <Link href="/admin/skills" variant="dropdownLink">Skills</Link>
          <Link href="/admin/currencies" variant="dropdownLink">
            Currencies
          </Link>
          <Link href="/admin/items" variant="dropdownLink">Items</Link>
        </Select>
      </Menu>
      <Menu x-data="themeData">
        <NavButton
          x-on:click="themeToggle"
          x-text="isDarkMode ? 'Light Theme' : 'Dark Theme'"
        >
        </NavButton>
        <Select
          name="Profile"
          variant="single"
          flow="left"
        >
          <Link href="/profile" variant="dropdownLink">
            profile
          </Link>
        </Select>
      </Menu>
    </Header>
  );
};

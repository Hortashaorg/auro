import { Header } from "@sections/navbar/components/Header.tsx";
import { Menu } from "@sections/navbar/components/Menu.tsx";
import { Select } from "@sections/navbar/components/Select.tsx";
import { Link } from "@sections/navbar/components/Link.tsx";
import { NavButton } from "@sections/navbar/components/NavButton.tsx";

export const Navbar = () => {
  return (
    <Header>
      <Menu>
        <Select name="Tools" variant="single" flow="right">
          <Link href="/tools/raw-data-tool" variant="dropdownLink">
            Raw Data Tool
          </Link>
          <Link href="/tools/invoke" variant="dropdownLink">Invoke Tool</Link>
          <Link href="/tools/manage-state" variant="dropdownLink">
            Manage-state Tool
          </Link>
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
          id="avatar"
        >
          <Link href="/profile" variant="dropdownLink">
            profile
          </Link>
        </Select>
      </Menu>
    </Header>
  );
};

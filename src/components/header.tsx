import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import { useMatch } from "react-router-dom";

/**
 * Defines the structure of a menu item.
 */
type MenuItem = {
  /** Unique identifier for the item */
  id: string;
  /** URL to navigate to */
  href: string;
  /** Label to display for the item */
  label: string;
};

/** List of menu items */
const menuItems: MenuItem[] = [
  { id: "unoptimised", label: "Unoptimised", href: "/" },
  { id: "add-memo", label: "Add Memo", href: "/add-memo" },
  { id: "reduce-renders", label: "Reduce Renders", href: "/reduce-renders" },
  {
    id: "reduce-computation",
    label: "Reduce Computation",
    href: "/reduce-computation",
  },
  {
    id: "optimise-updates",
    label: "Optimise Updates",
    href: "/optimise-updates",
  },
  { id: "optimise-memory", label: "Optimise Memory", href: "/optimise-memory" },
];

/**
 * Defines the props for a navigation link.
 */
type NavLinkProps = Omit<MenuItem, "id">;

/**
 * Renders a navigation link.
 * @param props - Props for the navigation link.
 * @returns The navigation link component.
 */
const NavLink = ({ href, label }: NavLinkProps) => {
  const match = useMatch(href);

  return (
    <NavbarItem isActive={!!match}>
      <Link color={match ? undefined : "foreground"} href={href}>
        {label}
      </Link>
    </NavbarItem>
  );
};

/**
 * Renders a menu link within the navbar menu.
 * @param props - Props for the menu link.
 * @returns The menu link component.
 */
const NavMenuLink = ({ href, label }: NavLinkProps) => {
  const match = useMatch(href);

  return (
    <NavbarMenuItem isActive={!!match}>
      <Link color={match ? undefined : "foreground"} href={href}>
        {label}
      </Link>
    </NavbarMenuItem>
  );
};

/**
 * Renders the header component containing the navigation bar.
 * @returns The header component.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar position="static" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="md:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      {/* Desktop */}
      <NavbarContent className="hidden md:flex flex-1 gap-4" justify="center">
        {menuItems.map((e) => (
          <NavLink key={e.id} href={e.href} label={e.label} />
        ))}
      </NavbarContent>

      {/* Mobile */}
      <NavbarMenu>
        {menuItems.map((e) => (
          <NavMenuLink key={e.id} href={e.href} label={e.label} />
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

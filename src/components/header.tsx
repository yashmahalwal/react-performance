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

type MenuItem = {
  id: string;
  href: string;
  label: string;
};

const menuItems: MenuItem[] = [
  { id: "unoptimised", label: "Unoptimised", href: "/" },
  { id: "add-memo", label: "Add Memo", href: "/add-memo" },
  { id: "reduce-renders", label: "Reduce Renders", href: "/reduce-renders" },
  {
    id: "optimise-calculations",
    label: "Optimise Calculations",
    href: "/optimise-calculations",
  },
  {
    id: "optimise-updates",
    label: "Optimise Updates",
    href: "/optimise-updates",
  },
  { id: "optimise-memory", label: "Optimise Memory", href: "/optimise-memory" },
];

type NavLinkProps = Omit<MenuItem, "id">;

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

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <Navbar position="static" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="md:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="hidden md:flex flex-1 gap-4" justify="center">
        {menuItems.map((e) => (
          <NavLink key={e.id} href={e.href} label={e.label} />
        ))}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((e) => (
          <NavMenuLink key={e.id} href={e.href} label={e.label} />
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

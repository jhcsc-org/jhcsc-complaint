import { useLogout, useMenu } from "@refinedev/core";
import { NavLink } from "react-router-dom";
import { Button } from "../ui/button";

export const Menu = () => {
  const { mutate: logout } = useLogout();
  const { menuItems } = useMenu();

  return (
    <nav className="menu">
      <ul className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <div key={item.key}>
            <NavLink to={item.route ?? "/"}>{item.label}</NavLink>
          </div>
        ))}
      </ul>
      <Button onClick={() => logout()}>Logout</Button>
    </nav>
  );
};

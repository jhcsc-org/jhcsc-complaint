import { useBreadcrumb, useLogout, useMenu } from "@refinedev/core";
import { CircleDotDashedIcon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { mutate: logout } = useLogout();
  const { menuItems } = useMenu();
  const { breadcrumbs } = useBreadcrumb();
  return (
    <div className="flex min-h-screen py-4 lg:pr-4">
      <nav className="justify-between hidden w-64 lg:flex lg:flex-col">
        <div>
          <div className="flex items-center gap-2 px-6 pt-2 pb-4">
            <CircleDotDashedIcon className="w-6 h-6" />
            <h1 className="text-lg font-bold">complaint.</h1>
          </div>
          <Separator />
          <ul className="px-4 mt-4">
            {menuItems.map((item) => (
              <NavLink key={item.label} className="text-sm font-medium" to={item.route ?? "/"}>
                <li className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted-foreground/25">
                  {item.icon}
                  {item.label}
                </li>
              </NavLink>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Separator className="w-full -mx-10" />
          <div className="w-full px-4 pt-2">
            <Popover>
              <PopoverTrigger className="w-full h-16 rounded-lg hover:bg-muted-foreground/25">
                <div className="flex items-center gap-4 px-2 py-2">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-left">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent align="start">Place content for the popover here.</PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>
      <div className="flex-1 mx-4 border rounded-xl dark:border-border/25 border-border/50 bg-card lg:mx-0">
        <main className="mx-auto py-14 max-w-7xl sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableType } from "@/types/dev.types";
import { BaseKey, useGetIdentity, useLogout, useMenu, useOne } from "@refinedev/core";
import { User } from "@supabase/supabase-js";
import { CircleDotDashedIcon } from "lucide-react";
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

const roleRoutes: Record<string, string[]> = {
  citizen: ['/', '/create'],
  lupon_member: ['/lupon/manage', '/lupon/complaints', '/lupon/complaints/show/', '/lupon/citizens'],
  admin: ['/admin/manage', '/admin/complaints'],
};

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const { mutate: logout } = useLogout();
  const { menuItems } = useMenu();
  const { data: user } = useGetIdentity<User>();
  const userId = user?.id;
  const { data: userRole, isLoading: isUserRoleLoading } = useOne<TableType<"user_profile"> & BaseKey>({
    id: userId,
    resource: "user_profile",
    queryOptions: {
      enabled: !!userId,
    }
  });

  const [role, setRole] = useState<string | undefined | null>();
  const full_name = `${user?.user_metadata.first_name} ${user?.user_metadata.middle_name ? `${user.user_metadata.middle_name} ` : ''}${user?.user_metadata.last_name}`;

  const location = useLocation();
  const navigate = useNavigate();

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => roleRoutes[role!]?.includes(item.route || ""));
  }, [menuItems, role]);

  useEffect(() => {
    if (
      role &&
      !roleRoutes[role]?.includes(location.pathname) &&
      !location.pathname.startsWith('/lupon/show/')
    ) {
      const defaultRoute = roleRoutes[role][0];
      navigate(defaultRoute);
    }
  }, [role, location.pathname, navigate, roleRoutes]);

  useEffect(() => {
    if (userRole !== undefined) {
      setRole(userRole.data.role_name)
    }
  }, [userRole?.data])

  return (
    <div className="flex min-h-screen py-4 lg:pr-4">
      <nav className="fixed top-0 left-0 justify-between hidden w-64 h-full py-5 lg:flex lg:flex-col bg-background">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 px-6 pt-2 pb-4">
            <CircleDotDashedIcon className="w-6 h-6" />
            <h1 className="text-lg font-bold">complain-ant.</h1>
          </div>
          <Separator />
          <ul className="px-4 pb-4 mt-4">
            {!isUserRoleLoading && filteredMenuItems.map((item) => (
              <NavLink key={item.label} className="my-6 text-sm font-medium" to={item.route ?? "/"}>
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
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full h-16 rounded-lg hover:bg-muted-foreground/25">
                <div className="flex items-center gap-2 px-2 py-2">
                  <Avatar>
                    <AvatarImage src="https://pbs.twimg.com/media/EmiRsAVVcAAsiVm.jpg:large" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium text-left">{full_name}</p>
                    <p className="text-xs text-left text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <div className="flex-1 mx-4 border rounded-xl dark:border-border/25 border-border/50 bg-card lg:mx-0 lg:ml-64">
        <main className="mx-auto py-14 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

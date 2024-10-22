// Layout.tsx
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { TableType } from "@/types/dev.types";
import {
  BaseKey,
  useGetIdentity,
  useLogout,
  useMenu,
  useOne,
  useSubscription,
} from "@refinedev/core";
import { User } from "@supabase/supabase-js";
import {
  ChevronsUpDown,
  LogOut
} from "lucide-react";
import React, { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const roleRoutes: Record<string, string[]> = {
  citizen: ["/", "/create", "/updates"],
  lupon_member: [
    "/lupon/manage",
    "/lupon/complaints",
    "/lupon/complaints/show/",
    "/lupon/citizens",
    "/lupon/reports",
  ],
  admin: [
    "/admin/manage",
    "/admin/complaints",
    "/admin/manage/lupons",
    "/admin/manage/lupons/edit",
    "/admin/manage/lupons/add",
  ],
};

interface LayoutProps extends PropsWithChildren { }

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { mutate: logout } = useLogout();
  const { menuItems } = useMenu();
  const { data: user } = useGetIdentity<User>();
  const userId = user?.id;

  const { data: userRole, isLoading: isUserRoleLoading } = useOne<
    TableType<"user_profile"> & BaseKey
  >({
    id: userId,
    resource: "user_profile",
    queryOptions: {
      enabled: !!userId,
    },
  });

  const [role, setRole] = useState<string | undefined | null>();
  const fullName = `${user?.user_metadata.first_name} ${user?.user_metadata.middle_name ? `${user.user_metadata.middle_name} ` : ""
    }${user?.user_metadata.last_name}`;

  const location = useLocation();
  const navigate = useNavigate();

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) =>
      roleRoutes[role!]?.includes(item.route || "")
    );
  }, [menuItems, role]);

  useSubscription({
    channel: "channel-name",
    types: ["*"],
    enabled: true,
    onLiveEvent: (event) => {
      console.log(event);
    },
    dataProviderName: "default",
  });

  useEffect(() => {
    if (
      role &&
      role !== 'admin' &&
      !roleRoutes[role]?.includes(location.pathname) &&
      !location.pathname.startsWith("/lupon/show/") &&
      !location.pathname.startsWith("/show/")
    ) {
      const defaultRoute = roleRoutes[role][0];
      navigate(defaultRoute);
    }
  }, [role, location.pathname, navigate]);

  useEffect(() => {
    if (userRole !== undefined) {
      setRole(userRole.data.role_name);
    }
  }, [userRole?.data]);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* Sidebar Header */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex flex-row items-center justify-center pt-4" >
              <div className="flex flex-row items-center justify-center">
                <h1 className="text-lg font-bold text-center">JHCSC Barangay</h1>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent>
          {/* Navigation Group */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {!isUserRoleLoading ?
                filteredMenuItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.route || "/"}
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted-foreground/25 ${isActive ? "bg-muted-foreground/25" : ""
                          }`
                        }
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )) :
                (<>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <div
                        className={
                          `flex items-center gap-2 px-2 py-1 rounded-md bg-muted-foreground/5`
                        }
                      >
                        <SidebarMenuSkeleton />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </>)}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="w-8 h-8 rounded-lg">
                      <AvatarImage
                        src={user?.user_metadata.avatar_url || ""}
                        alt={fullName}
                      />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-sm leading-tight text-left">
                      <span className="font-semibold truncate">
                        {fullName}
                      </span>
                      <span className="text-xs truncate">
                        {user?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="w-8 h-8 rounded-lg">
                        <AvatarImage
                          src={user?.user_metadata.avatar_url || ""}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-sm leading-tight text-left">
                        <span className="font-semibold truncate">
                          {fullName}
                        </span>
                        <span className="text-xs truncate">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-4 size-5" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1">
        <main className="px-6 py-8 mx-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

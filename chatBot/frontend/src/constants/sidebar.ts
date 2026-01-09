import React from "react";
import { CloudHail, Activity, Home, Users, Inbox } from "lucide-react";
import { CycloneIcon, FloodIcon, LandslideIcon } from "../components/icons/Sidebar-Icons";
type SidebarItem = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const sidebarUserItems: SidebarItem[] = [
  {
    href: "/dashboard",
    label: "Home",
    icon: Home,
  },
  {
    href: "/dashboard/rainfall",
    label: "Rainfall",
    icon: CloudHail,
  },
  {
    href: "/dashboard/earthquakes",
    label: "Earthquake",
    icon: Activity,
  },
  {
    href: "/dashboard/floods",
    label: "Flood",
    icon: FloodIcon,
  },
  {
    href: "/dashboard/landslides",
    label: "Landslide",
    icon: LandslideIcon,
  },
  {
    href: "/dashboard/cyclones",
    label: "Cyclone",
    icon: CycloneIcon,
  },
];
const sidebarAdminItems: SidebarItem[] = [
  {
    href: "/admin",
    label: "Home",
    icon: Home,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/inbox",
    label: "Inbox",
    icon: Inbox
  }
];
export { sidebarUserItems, sidebarAdminItems };

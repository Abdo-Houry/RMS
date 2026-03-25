import * as React from "react"
import { Home, FileText, User, GalleryVerticalEnd } from 'lucide-react'
import {
  Scale,
  Tag,
  Cpu,
  Soup,
  Package,
  FolderTree,
  Shield
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { TeamSwitcher } from "./team-switcher"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { useLocation } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import { useUserRole } from "@/hooks/useUserRole";
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { PERMISSIONS } from "@/constants/permissions";
import { usePermissions } from "@/hooks/usePermissions";
// This is sample data.


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { hasPermission } = usePermissions();

  const data = {
    user: {
      name: "RMS",
      email: localStorage.getItem("username") as string,
      avatar: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNiNDRhMWQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS11dGVuc2lscy1pY29uIGx1Y2lkZS11dGVuc2lscyI+PHBhdGggZD0iTTMgMnY3YzAgMS4xLjkgMiAyIDJoNGEyIDIgMCAwIDAgMi0yVjIiLz48cGF0aCBkPSJNNyAydjIwIi8+PHBhdGggZD0iTTIxIDE1VjJhNSA1IDAgMCAwLTUgNXY2YzAgMS4xLjkgMiAyIDJoM1ptMCAwdjciLz48L3N2Zz4=",
    },
    teams: [
      {
        name: "RMS",
        logo: GalleryVerticalEnd,
        plan: "sidebar.team.plan",
      },
    ],
    // navMain: [
    //   {
    //     title: "sidebar.nav.home",
    //     url: "/",
    //     icon: Home,
    //     isActive: true,
    //   },
    //   {
    //     title: "sidebar.nav.articles",
    //     url: "/article",
    //     icon: FileText,
    //   },
    //   {
    //     title: "sidebar.nav.articleCategories",
    //     url: "/categories",
    //     icon: FolderTree,
    //   },
    //   {
    //     title: "sidebar.nav.ingredient",
    //     url: "/ingredient",
    //     icon: Package,
    //   },
    //   {
    //     title: "sidebar.nav.brands",
    //     url: "/brands",
    //     icon: Shield,
    //   },
    //   {
    //     title: "sidebar.nav.units",
    //     url: "/units",
    //     icon: Scale,
    //   },
    //   {
    //     title: "sidebar.nav.mealCategories",
    //     url: "/categories-meal",
    //     icon: Tag,
    //   },
    //   {
    //     title: "sidebar.nav.machines",
    //     url: "/machines",
    //     icon: Cpu,
    //   },
    //   {
    //     title: "sidebar.nav.meals",
    //     url: "/meals",
    //     icon: Soup,
    //   },
    //   {
    //     title: "sidebar.nav.users",
    //     url: "/users",
    //     icon: User,
    //   },
    // ]
    navMain: [
      {
        title: "sidebar.nav.home",
        url: "/",
        icon: Home,
      },
      {
        title: "sidebar.nav.articles",
        url: "/article",
        icon: FileText,
        permission: PERMISSIONS.ARTICLES.SHOW,
      },
      {
        title: "sidebar.nav.articleCategories",
        url: "/categories",
        icon: FolderTree,
        permission: PERMISSIONS.ARTICLE_CATEGORIES.SHOW,
      },
      {
        title: "sidebar.nav.ingredient",
        url: "/ingredient",
        icon: Package,
        permission: PERMISSIONS.INGREDIENTS.SHOW,
      },
      {
        title: "sidebar.nav.brands",
        url: "/brands",
        icon: Shield,
        permission: PERMISSIONS.BRANDS.SHOW,
      },
      {
        title: "sidebar.nav.units",
        url: "/units",
        icon: Scale,
        permission: PERMISSIONS.UNITS.SHOW,
      },
      {
        title: "sidebar.nav.mealCategories",
        url: "/categories-meal",
        icon: Tag,
        permission: PERMISSIONS.MEAL_CATEGORIES.SHOW,
      },
      {
        title: "sidebar.nav.meals",
        url: "/meals",
        icon: Soup,
        permission: PERMISSIONS.MEALS.SHOW,
      },
      {
        title: "sidebar.nav.machines",
        url: "/machines",
        icon: Cpu,
        permission: PERMISSIONS.MACHINES.SHOW,
      },
      {
        title: "sidebar.nav.users",
        url: "/users",
        icon: User,
        permission: PERMISSIONS.USERS.SHOW,
      },
    ]

  }
  const location = useLocation();
  const { t } = useTranslation()
  // @ts-ignore
  const { isStaff, isLoading: roleLoading } = useUserRole();
  // const navMainWithActive = data.navMain.map(item => ({
  //   ...item,
  //   isActive: location.pathname === item.url
  // }));
  // @ts-ignore

  const { direction } = useSelector((state: RootState) => state.language)
  // const filteredNavMain = data.navMain.filter(item => {
  //   if (isStaff && item.url === "/users") {
  //     return false;
  //   }
  //   return true;
  // });
  const filteredNavMain = data.navMain.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  const navMainWithActive = filteredNavMain.map(item => ({
    ...item,
    title: typeof item.title === 'string' ? t(item.title) : item.title,
    isActive: location.pathname === item.url
  }));
  data.user.email = isStaff ? t('sidebar.user.staff') : t('sidebar.user.admin');
  // translate team plan
  data.teams = data.teams.map(team => ({ ...team, plan: team.plan ? t(team.plan) : team.plan }));
  const isRTL = document.documentElement.dir === "rtl";

  return (
    <Sidebar collapsible="icon"
      //  side={direction === "rtl" ? "right" : "left"}
      side={isRTL ? "right" : "left"}
      {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainWithActive} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ChartBar,
  ArrowRight01Icon,
  LayoutDashboard,
  Settings,
  TestTubeIcon,
  Users,
} from "@hugeicons/core-free-icons"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { dsAppBrand } from "./app-navigation"

const navigationGroups = [
  {
    label: "Nền tảng",
    items: [
      { title: "Tổng quan", url: "/demo/dashboard", icon: LayoutDashboard },
      {
        title: "Người dùng",
        url: "/demo/users",
        icon: Users,
        items: [
          { title: "Tất cả người dùng", url: "/demo/users" },
          { title: "Vai trò", url: "/demo/users/roles" },
          { title: "Quyền truy cập", url: "/demo/users/permissions" },
          { title: "Lời mời", url: "/demo/users/invitations" },
        ],
      },
      { title: "Cài đặt", url: "/demo/settings", icon: Settings },
      { title: "Báo cáo", url: "/demo/reports", icon: ChartBar },
    ],
  },
  {
    label: "Thí nghiệm CBM",
    items: [
      {
        title: "Kế hoạch CBM",
        url: "/thi-nghiem-cbm/ke-hoach-cbm",
        icon: TestTubeIcon,
      },
    ],
  },
] as const

const sidebarUser = {
  name: "shadcn",
  email: "m@example.com",
  avatarSrc: "/avatars/shadcn.jpg",
  avatarFallback: "CN",
} as const

function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { isMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Link href={dsAppBrand.href} aria-label="Về trang tổng quan">
                <div className="flex size-8 min-w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary">
                  <Image
                    src={dsAppBrand.logoSrc}
                    alt={dsAppBrand.logoAlt}
                    width={24}
                    height={24}
                    className="block size-6 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-heading font-medium">
                    {dsAppBrand.name}
                  </span>
                  <span className="truncate text-xs">
                    {dsAppBrand.description}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    pathname.startsWith(`${item.url}/`)

                  if ("items" in item) {
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={isActive}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={isActive}
                              tooltip={item.title}
                            >
                              <HugeiconsIcon
                                icon={item.icon}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                              <span>{item.title}</span>
                              <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                strokeWidth={2}
                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                aria-hidden="true"
                              />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem) => {
                                const isSubItemActive =
                                  pathname === subItem.url

                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubItemActive}
                                    >
                                      <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )
                              })}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    )
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.url}>
                          <HugeiconsIcon
                            icon={item.icon}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={sidebarUser.avatarSrc}
                      alt={sidebarUser.name}
                    />
                    <AvatarFallback className="rounded-lg">
                      {sidebarUser.avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {sidebarUser.name}
                    </span>
                    <span className="truncate text-xs">
                      {sidebarUser.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={sidebarUser.avatarSrc}
                        alt={sidebarUser.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {sidebarUser.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {sidebarUser.name}
                      </span>
                      <span className="truncate text-xs">
                        {sidebarUser.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Sparkles aria-hidden="true" />
                  Nâng cấp gói Pro
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BadgeCheck aria-hidden="true" />
                  Tài khoản
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard aria-hidden="true" />
                  Thanh toán
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell aria-hidden="true" />
                  Thông báo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut aria-hidden="true" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export { AppSidebar }

"use client"

import * as React from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { DSButton } from "@/components/ds/button"
import { DSGlobalSearch } from "@/components/ds/global-search"
import { DSHelpMenu } from "@/components/ds/help-menu"
import { DSIconButtonTooltip } from "@/components/ds/icon-button-tooltip"
import {
  DSNotificationPopover,
  type DSNotification,
} from "@/components/ds/notification-popover"
import { dsAppRootBreadcrumb } from "@/components/ds/app-navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type DSAppHeaderBreadcrumb = {
  label: string
  href?: string
}

type DSAppHeaderProps = React.ComponentProps<"header"> & {
  pageTitle: React.ReactNode
  actions?: React.ReactNode
  breadcrumbs?: readonly DSAppHeaderBreadcrumb[]
  globalSearchPlaceholder?: string
  globalSearchValue?: string
  recentSearchKeywords?: string[]
  notifications?: readonly DSNotification[]
  notificationViewAllHref?: string
  onMarkAllNotificationsRead?: () => void
  onNotificationClick?: (id: string) => void
  onGlobalSearchChange?: (value: string) => void
  onGlobalSearchSubmit?: (keyword: string) => void
  sticky?: boolean
}

const defaultNotifications: DSNotification[] = [
  {
    id: "workflow-policy",
    title: "Cần phê duyệt rà soát chính sách",
    description: "Ba kiểm soát hệ thống đang chờ người rà soát xử lý.",
    time: "4 phút trước",
    unread: true,
    type: "warning",
  },
  {
    id: "user-import",
    title: "Import người dùng hoàn tất",
    description: "Import hàng loạt đã xử lý 128 tài khoản.",
    time: "18 phút trước",
    unread: true,
    type: "success",
  },
  {
    id: "monthly-report",
    title: "Báo cáo tháng đã sẵn sàng",
    description: "Tổng hợp vận hành của hệ thống đã có thể xem.",
    time: "1 giờ trước",
    unread: false,
    type: "info",
  },
]

const defaultRecentSearchKeywords = [
  "người dùng",
  "tài khoản đang hoạt động",
  "tài chính",
  "người rà soát bảo mật",
  "lời mời đang chờ",
  "nhật ký kiểm toán",
  "báo cáo",
  "quyền truy cập",
  "quản trị",
  "người dùng không hoạt động",
  "lịch sử import",
  "cài đặt hệ thống",
  "thanh toán",
]

function DSAppHeader({
  pageTitle,
  actions,
  breadcrumbs,
  globalSearchPlaceholder = "Tìm kiếm trong hệ thống...",
  globalSearchValue,
  recentSearchKeywords = defaultRecentSearchKeywords,
  notifications,
  notificationViewAllHref,
  onMarkAllNotificationsRead,
  onNotificationClick,
  onGlobalSearchChange,
  onGlobalSearchSubmit,
  sticky = false,
  className,
  ...props
}: DSAppHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    React.useCallback(() => () => undefined, []),
    () => true,
    () => false
  )
  const [localNotifications, setLocalNotifications] = React.useState<
    DSNotification[]
  >(() => [...(notifications ?? defaultNotifications)])
  const resolvedNotifications = notifications ?? localNotifications
  const isDark = mounted && resolvedTheme === "dark"
  const resolvedBreadcrumbs = React.useMemo(() => {
    if (!breadcrumbs?.length) {
      return breadcrumbs
    }

    const firstBreadcrumb = breadcrumbs[0]
    const alreadyHasRoot =
      firstBreadcrumb?.label === dsAppRootBreadcrumb.label &&
      firstBreadcrumb?.href === dsAppRootBreadcrumb.href

    return alreadyHasRoot
      ? breadcrumbs
      : [dsAppRootBreadcrumb, ...breadcrumbs]
  }, [breadcrumbs])

  const markAllNotificationsRead = () => {
    if (!notifications) {
      setLocalNotifications((current) =>
        current.map((notification) => ({ ...notification, unread: false }))
      )
    }

    onMarkAllNotificationsRead?.()
  }

  const markNotificationRead = (id: string) => {
    if (!notifications) {
      setLocalNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, unread: false } : notification
        )
      )
    }

    onNotificationClick?.(id)
  }

  const toggleTheme = () => {
    if (!mounted) {
      return
    }

    setTheme(isDark ? "light" : "dark")
  }

  return (
    <header
      data-slot="ds-app-header"
      className={cn(
        "z-30 flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6 lg:px-8",
        sticky &&
          "sticky top-0 z-30 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2">
        <DSIconButtonTooltip label="Mở/đóng thanh bên">
          <SidebarTrigger className="-ml-1 shrink-0" />
        </DSIconButtonTooltip>
        {resolvedBreadcrumbs?.length ? (
          <nav
            aria-label="Điều hướng phân cấp"
            className="min-w-0 font-heading text-base font-medium"
          >
            <ol className="flex min-w-0 items-center gap-1.5">
              {resolvedBreadcrumbs.map((item, index) => {
                const isLast = index === resolvedBreadcrumbs.length - 1

                return (
                  <li
                    className="flex min-w-0 items-center gap-1.5"
                    key={`${item.href ?? item.label}-${index}`}
                  >
                    {isLast || !item.href ? (
                      <span
                        aria-current={isLast ? "page" : undefined}
                        className="truncate text-foreground"
                      >
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        className="truncate text-muted-foreground transition-colors hover:text-foreground"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    )}
                    {!isLast ? (
                      <span
                        className="shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      >
                        /
                      </span>
                    ) : null}
                  </li>
                )
              })}
            </ol>
          </nav>
        ) : (
          <div className="min-w-0 truncate font-heading text-base font-medium">
            {pageTitle}
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <DSGlobalSearch
          aria-label="Tìm kiếm trong hệ thống"
          className="hidden w-64 md:block"
          inputClassName="h-8"
          onSearchSubmit={onGlobalSearchSubmit}
          onValueChange={onGlobalSearchChange}
          placeholder={globalSearchPlaceholder}
          recentKeywords={recentSearchKeywords}
          value={globalSearchValue}
        />
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
        <DSHelpMenu />
        <DSNotificationPopover
          notifications={resolvedNotifications}
          onMarkAllRead={markAllNotificationsRead}
          onNotificationClick={markNotificationRead}
          viewAllHref={notificationViewAllHref}
        />
        {mounted ? (
          <DSIconButtonTooltip label="Chuyển giao diện">
            <DSButton
              aria-label={
                isDark
                  ? "Chuyển sang giao diện sáng"
                  : "Chuyển sang giao diện tối"
              }
              onClick={toggleTheme}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              {isDark ? (
                <Sun aria-hidden="true" />
              ) : (
                <Moon aria-hidden="true" />
              )}
            </DSButton>
          </DSIconButtonTooltip>
        ) : (
          <DSIconButtonTooltip label="Chuyển giao diện">
            <DSButton
              aria-label="Đổi giao diện"
              disabled
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Moon aria-hidden="true" />
            </DSButton>
          </DSIconButtonTooltip>
        )}
      </div>
    </header>
  )
}

export { DSAppHeader }
export type { DSAppHeaderBreadcrumb, DSAppHeaderProps }

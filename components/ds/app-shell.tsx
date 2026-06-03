"use client"

import * as React from "react"

import {
  DSAppHeader,
  type DSAppHeaderBreadcrumb,
} from "@/components/ds/app-header"
import { AppSidebar } from "@/components/ds/app-sidebar"
import type { DSNotification } from "@/components/ds/notification-popover"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { usePersistentSidebarState } from "@/hooks/use-persistent-sidebar-state"
import { cn } from "@/lib/utils"

type DSAppShellProps = React.ComponentProps<typeof SidebarProvider> & {
  pageTitle: React.ReactNode
  actions?: React.ReactNode
  breadcrumbs?: readonly DSAppHeaderBreadcrumb[]
  globalSearchPlaceholder?: string
  globalSearchValue?: string
  recentSearchKeywords?: string[]
  headerSticky?: boolean
  notifications?: readonly DSNotification[]
  notificationViewAllHref?: string
  onMarkAllNotificationsRead?: () => void
  onNotificationClick?: (id: string) => void
  onGlobalSearchChange?: (value: string) => void
  onGlobalSearchSubmit?: (keyword: string) => void
}

function DSAppShell({
  pageTitle,
  actions,
  breadcrumbs,
  globalSearchPlaceholder,
  globalSearchValue,
  recentSearchKeywords,
  headerSticky = false,
  notifications,
  notificationViewAllHref,
  onMarkAllNotificationsRead,
  onNotificationClick,
  onGlobalSearchChange,
  onGlobalSearchSubmit,
  children,
  className,
  ...props
}: DSAppShellProps) {
  const { open, setOpen } = usePersistentSidebarState()

  return (
    <SidebarProvider
      data-slot="ds-app-shell"
      className={cn("h-svh overflow-hidden overscroll-none bg-muted/30", className)}
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden overscroll-none bg-muted/30">
        <div className="flex h-svh min-w-0 flex-col overflow-hidden overscroll-none">
          <DSAppHeader
            actions={actions}
            breadcrumbs={breadcrumbs}
            globalSearchPlaceholder={globalSearchPlaceholder}
            globalSearchValue={globalSearchValue}
            recentSearchKeywords={recentSearchKeywords}
            notifications={notifications}
            notificationViewAllHref={notificationViewAllHref}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
            onNotificationClick={onNotificationClick}
            onGlobalSearchChange={onGlobalSearchChange}
            onGlobalSearchSubmit={onGlobalSearchSubmit}
            pageTitle={pageTitle}
            sticky={headerSticky}
          />
          <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { DSAppShell }
export type { DSAppShellProps }

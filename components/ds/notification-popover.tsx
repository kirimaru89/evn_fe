"use client"

import * as React from "react"
import Link from "next/link"
import { Bell } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSIconButtonTooltip } from "./icon-button-tooltip"
import { DSNotificationBadge } from "./notification-badge"
import { DSStateEmpty } from "./state-empty"

type DSNotification = {
  id: string
  title: string
  description?: string
  time?: string
  unread?: boolean
  href?: string
  type?: "info" | "success" | "warning" | "error"
}

type DSNotificationPopoverProps = {
  notifications: readonly DSNotification[]
  onMarkAllRead?: () => void
  onNotificationClick?: (id: string) => void
  viewAllHref?: string
}

const notificationTypeDotClass = {
  info: "bg-primary",
  success: "bg-primary",
  warning: "bg-muted-foreground",
  error: "bg-destructive",
} as const

function getNotificationLabel(unreadCount: number) {
  if (unreadCount === 0) {
    return "Thông báo"
  }

  return `Thông báo, ${unreadCount > 9 ? "9+" : unreadCount} chưa đọc`
}

function DSNotificationPopover({
  notifications,
  onMarkAllRead,
  onNotificationClick,
  viewAllHref,
}: DSNotificationPopoverProps) {
  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length
  const notificationLabel = getNotificationLabel(unreadCount)

  const renderNotificationContent = (notification: DSNotification) => (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "mt-1 size-2 shrink-0 rounded-full",
          notification.unread
            ? notificationTypeDotClass[notification.type ?? "info"]
            : "bg-muted-foreground/30"
        )}
      />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm",
            notification.unread ? "font-medium text-foreground" : "text-foreground"
          )}
        >
          {notification.title}
        </span>
        {notification.description ? (
          <span className="mt-0.5 block line-clamp-2 text-xs text-muted-foreground">
            {notification.description}
          </span>
        ) : null}
        {notification.time ? (
          <span className="mt-1 block text-xs text-muted-foreground">
            {notification.time}
          </span>
        ) : null}
      </span>
    </>
  )

  return (
    <Popover>
      <DSIconButtonTooltip label="Thông báo">
        <PopoverTrigger asChild>
          <DSButton
            aria-label={notificationLabel}
            className="relative"
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <span className="relative">
              <Bell aria-hidden="true" />
              <DSNotificationBadge count={unreadCount} />
            </span>
          </DSButton>
        </PopoverTrigger>
      </DSIconButtonTooltip>
      <PopoverContent align="end" className="w-96 max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            <h2 className="font-heading text-sm font-semibold">
              Thông báo
            </h2>
            <p className="text-xs text-muted-foreground">
              {unreadCount === 0
                ? "Không có thông báo chưa đọc"
                : `${unreadCount} chưa đọc`}
            </p>
          </div>
          {unreadCount > 0 ? (
            <DSButton
              onClick={onMarkAllRead}
              size="sm"
              type="button"
              variant="ghost"
            >
              Đánh dấu tất cả là đã đọc
            </DSButton>
          ) : null}
        </div>
        <div className="max-h-96 overflow-y-auto p-2">
          {notifications.length ? (
            <div className="grid gap-1">
              {notifications.map((notification) =>
                notification.href ? (
                  <Link
                    key={notification.id}
                    className={cn(
                      "flex gap-3 rounded-md px-2 py-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      notification.unread && "bg-muted/50"
                    )}
                    href={notification.href}
                    onClick={() => onNotificationClick?.(notification.id)}
                  >
                    {renderNotificationContent(notification)}
                  </Link>
                ) : (
                  <button
                    key={notification.id}
                    type="button"
                    className={cn(
                      "flex w-full gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      notification.unread && "bg-muted/50"
                    )}
                    onClick={() => onNotificationClick?.(notification.id)}
                  >
                    {renderNotificationContent(notification)}
                  </button>
                )
              )}
            </div>
          ) : (
            <DSStateEmpty
              className="min-h-44 border-0 bg-transparent"
              title="Không có thông báo"
              description="Thông báo gần đây của hệ thống sẽ hiển thị tại đây."
            />
          )}
        </div>
        {viewAllHref ? (
          <div className="border-t border-border p-2">
            <DSButton asChild className="w-full" variant="outline">
              <Link href={viewAllHref}>Xem tất cả thông báo</Link>
            </DSButton>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}

export { DSNotificationPopover }
export type { DSNotification, DSNotificationPopoverProps }

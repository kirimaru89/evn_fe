import * as React from "react"

import { DSBadge } from "./badge"
import { dsStatusColorClasses } from "./tokens"
import { cn } from "@/lib/utils"

type DSStatus =
  | "active"
  | "pending"
  | "warning"
  | "error"
  | "success"
  | "neutral"
  | "inactive"

type DSStatusBadgeProps = Omit<
  React.ComponentProps<typeof DSBadge>,
  "variant"
> & {
  status: DSStatus
  showDot?: boolean
}

const statusConfig = {
  active: {
    label: "Đang hoạt động",
    variant: "default",
    className: "",
    dotClassName: "bg-primary-foreground",
  },
  pending: {
    label: "Đang chờ",
    variant: "outline",
    className: dsStatusColorClasses.pending.badge,
    dotClassName: dsStatusColorClasses.pending.dot,
  },
  warning: {
    label: "Cảnh báo",
    variant: "outline",
    className: "border-destructive/40 text-destructive",
    dotClassName: "bg-destructive",
  },
  error: {
    label: "Lỗi",
    variant: "destructive",
    className: "",
    dotClassName: "bg-destructive",
  },
  success: {
    label: "Hoàn tất",
    variant: "outline",
    className: "border-primary/40 text-primary",
    dotClassName: "bg-primary",
  },
  neutral: {
    label: "Trung lập",
    variant: "ghost",
    className: "",
    dotClassName: "bg-muted-foreground",
  },
  inactive: {
    label: "Không hoạt động",
    variant: "outline",
    className: "text-muted-foreground",
    dotClassName: "bg-muted-foreground",
  },
} as const

function DSStatusBadge({
  status,
  showDot = true,
  className,
  children,
  ...props
}: DSStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <DSBadge
      data-slot="ds-status-badge"
      variant={config.variant}
      aria-label={`Trạng thái ${config.label}`}
      className={cn(config.className, className)}
      {...props}
    >
      {showDot ? (
        <span
          className={cn("size-1.5 rounded-full", config.dotClassName)}
          aria-hidden="true"
        />
      ) : null}
      {children ?? config.label}
    </DSBadge>
  )
}

export { DSStatusBadge }
export type { DSStatus, DSStatusBadgeProps }

import * as React from "react"

import { cn } from "@/lib/utils"
import { DSBadge } from "./badge"

type DSStateErrorProps = React.ComponentProps<"div"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

function DSStateError({
  title = "Không thể tải dữ liệu",
  description = "Yêu cầu không thành công. Hãy thử lại hoặc liên hệ quản trị viên nếu sự cố tiếp diễn.",
  action,
  className,
  ...props
}: DSStateErrorProps) {
  return (
    <div
      data-slot="ds-state-error"
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex min-h-32 flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-6 text-center",
        className
      )}
      {...props}
    >
      <DSBadge variant="destructive">Đã xảy ra lỗi</DSBadge>
      <div className="grid gap-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}

export { DSStateError }
export type { DSStateErrorProps }

import * as React from "react"

import { cn } from "@/lib/utils"
import { DSSpinner } from "./spinner"

type DSStateLoadingProps = React.ComponentProps<"div"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  statusText?: string
}

function DSStateLoading({
  title = "Đang tải dữ liệu",
  description = "Vui lòng chờ trong khi hệ thống lấy dữ liệu mới nhất.",
  statusText = "Đang tải",
  className,
  ...props
}: DSStateLoadingProps) {
  return (
    <div
      data-slot="ds-state-loading"
      role="status"
      aria-live="polite"
      aria-label={statusText}
      className={cn(
        "flex min-h-32 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-6 text-center",
        className
      )}
      {...props}
    >
      <DSSpinner className="text-muted-foreground" />
      <div className="grid gap-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export { DSStateLoading }
export type { DSStateLoadingProps }

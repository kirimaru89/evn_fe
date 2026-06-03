import * as React from "react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type DSStateEmptyProps = Omit<React.ComponentProps<"div">, "title"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
}

function DSStateEmpty({
  title = "Chưa có dữ liệu",
  description = "Điều chỉnh bộ lọc hoặc tạo bản ghi mới để tiếp tục.",
  action,
  icon,
  className,
  ...props
}: DSStateEmptyProps) {
  return (
    <Empty
      data-slot="ds-state-empty"
      className={cn("min-h-32 border border-border bg-card p-6", className)}
      {...props}
    >
      <EmptyHeader>
        {icon ? <EmptyMedia variant="icon">{icon}</EmptyMedia> : null}
        <EmptyTitle>{title}</EmptyTitle>
        {description ? (
          <EmptyDescription>{description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {action ? <EmptyContent>{action}</EmptyContent> : null}
    </Empty>
  )
}

export { DSStateEmpty }
export type { DSStateEmptyProps }

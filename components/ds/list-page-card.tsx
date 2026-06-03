import * as React from "react"

import {
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
} from "@/components/ds/card"
import { cn } from "@/lib/utils"

type DSListPageCardProps = React.ComponentProps<typeof DSCard> & {
  title: string
  description?: string
  showDescription?: boolean
  scrollMode?: "page" | "table"
  actions?: React.ReactNode
  toolbar?: React.ReactNode
  children: React.ReactNode
}

function DSListPageCard({
  title,
  description,
  showDescription = false,
  scrollMode = "page",
  actions,
  toolbar,
  children,
  className,
  ...props
}: DSListPageCardProps) {
  return (
    <DSCard
      data-slot="ds-list-page-card"
      data-scroll-mode={scrollMode}
      className={cn(
        "gap-4",
        scrollMode === "table" && "h-full min-h-0",
        className
      )}
      {...props}
    >
      <DSCardHeader
        className={cn("gap-4", scrollMode === "table" && "shrink-0")}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className={cn("min-w-0", showDescription && description && "space-y-1")}>
            <DSCardTitle className="font-heading text-2xl font-medium tracking-normal sm:text-3xl">
              {title}
            </DSCardTitle>
            {showDescription && description ? (
              <DSCardDescription className="max-w-3xl text-sm leading-6">
                {description}
              </DSCardDescription>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {actions}
            </div>
          ) : null}
        </div>
        {toolbar ? <div className="pt-1">{toolbar}</div> : null}
      </DSCardHeader>
      <DSCardContent
        className={cn(scrollMode === "table" && "min-h-0 flex-1")}
      >
        {children}
      </DSCardContent>
    </DSCard>
  )
}

export { DSListPageCard }
export type { DSListPageCardProps }

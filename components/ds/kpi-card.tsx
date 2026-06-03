import * as React from "react"

import { cn } from "@/lib/utils"
import { DSBadge } from "./badge"
import {
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
} from "./card"
import { DSStateEmpty } from "./state-empty"
import { DSStateError } from "./state-error"

type DSKpiTone = "positive" | "neutral" | "warning" | "negative"

type DSKpiCardProps = React.ComponentProps<typeof DSCard> & {
  title: string
  value?: React.ReactNode
  description?: React.ReactNode
  trend?: React.ReactNode
  tone?: DSKpiTone
  loading?: boolean
  empty?: boolean
  error?: React.ReactNode
  disabled?: boolean
}

const trendVariantByTone = {
  positive: "default",
  neutral: "secondary",
  warning: "outline",
  negative: "destructive",
} as const

function DSKpiCard({
  title,
  value,
  description,
  trend,
  tone = "neutral",
  loading = false,
  empty = false,
  error,
  disabled = false,
  className,
  ...props
}: DSKpiCardProps) {
  if (error) {
    return (
      <DSCard
        data-slot="ds-kpi-card"
        aria-disabled={disabled}
        className={cn(disabled && "opacity-60", className)}
        {...props}
      >
        <DSCardHeader className="pb-2">
          <DSCardDescription>{title}</DSCardDescription>
        </DSCardHeader>
        <DSCardContent>
          <DSStateError
            className="min-h-24 border-0 bg-transparent p-0"
            title="Chỉ số không khả dụng"
            description={error}
          />
        </DSCardContent>
      </DSCard>
    )
  }

  if (empty) {
    return (
      <DSCard
        data-slot="ds-kpi-card"
        aria-disabled={disabled}
        className={cn(disabled && "opacity-60", className)}
        {...props}
      >
        <DSCardHeader className="pb-2">
          <DSCardDescription>{title}</DSCardDescription>
        </DSCardHeader>
        <DSCardContent>
          <DSStateEmpty
            className="min-h-24 border-0 bg-transparent p-0"
            title="Chưa có dữ liệu chỉ số"
            description={description}
          />
        </DSCardContent>
      </DSCard>
    )
  }

  return (
    <DSCard
      data-slot="ds-kpi-card"
      aria-busy={loading}
      aria-disabled={disabled}
      className={cn(disabled && "opacity-60", className)}
      {...props}
    >
      <DSCardHeader className="pb-2">
        <DSCardDescription>{title}</DSCardDescription>
        <DSCardTitle className="font-heading text-2xl font-medium">
          {loading ? (
            <span
              className="block h-8 w-28 animate-pulse rounded-md bg-muted"
              aria-hidden="true"
            />
          ) : (
            value
          )}
        </DSCardTitle>
      </DSCardHeader>
      {(description || trend) && (
        <DSCardContent className="flex items-center justify-between gap-3">
          {description ? (
            <span className="text-sm text-muted-foreground">
              {loading ? (
                <span
                  className="block h-4 w-32 animate-pulse rounded-md bg-muted"
                  aria-hidden="true"
                />
              ) : (
                description
              )}
            </span>
          ) : (
            <span />
          )}
          {trend && !loading ? (
            <DSBadge variant={trendVariantByTone[tone]}>{trend}</DSBadge>
          ) : null}
        </DSCardContent>
      )}
    </DSCard>
  )
}

export { DSKpiCard }
export type { DSKpiCardProps, DSKpiTone }

"use client"

import * as React from "react"
import { EllipsisVertical, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSIconButtonTooltip } from "./icon-button-tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type DSBulkAction = {
  key: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  variant?: "default" | "destructive"
  quick?: boolean
  disabled?: boolean
}

type DSBulkActionBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  selectedCount: number
  actions?: readonly DSBulkAction[]
  onClearSelection: () => void
  clearLabel?: string
  moreLabel?: string
}

const destructiveMenuItemClassName =
  "text-destructive! focus:text-destructive! data-[highlighted]:text-destructive! [&_svg]:text-destructive!"

function DSBulkActionIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {icon}
    </span>
  )
}

function DSBulkActionBar({
  selectedCount,
  actions = [],
  onClearSelection,
  clearLabel = "Bỏ chọn tất cả",
  moreLabel = "Mở menu thao tác hàng loạt",
  className,
  ...props
}: DSBulkActionBarProps) {
  const quickActions = actions.filter(
    (action) => action.quick && action.variant !== "destructive"
  )
  const normalActions = actions.filter((action) => action.variant !== "destructive")
  const destructiveActions = actions.filter(
    (action) => action.variant === "destructive"
  )

  const renderMenuAction = (action: DSBulkAction) => {
    const isDestructive = action.variant === "destructive"

    return (
      <DropdownMenuItem
        key={action.key}
        className={cn(isDestructive && destructiveMenuItemClassName)}
        disabled={action.disabled}
        onClick={action.onClick}
        variant={action.variant}
      >
        <span className={cn(isDestructive && "text-destructive")}>
          <DSBulkActionIcon icon={action.icon} />
        </span>
        <span className={cn(isDestructive && "text-destructive")}>
          {action.label}
        </span>
      </DropdownMenuItem>
    )
  }

  return (
    <div
      data-slot="ds-bulk-action-bar"
      className={cn(
        "flex min-h-[3.75rem] flex-row flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-3">
        <DSIconButtonTooltip label={clearLabel}>
          <DSButton
            aria-label={clearLabel}
            onClick={onClearSelection}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </DSButton>
        </DSIconButtonTooltip>
        <p className="truncate text-sm font-medium">{selectedCount} đã chọn</p>
      </div>
      {actions.length ? (
        <div className="flex items-center gap-1">
          <div
            aria-hidden="true"
            className="mx-1 h-6 w-px bg-border"
          />
          {quickActions.map((action) => (
            <DSButton
              key={action.key}
              aria-label={action.label}
              className="h-9 px-2"
              disabled={action.disabled}
              leftIcon={action.icon}
              onClick={action.onClick}
              type="button"
              variant="secondary"
            >
              {action.label}
            </DSButton>
          ))}
          <DropdownMenu>
            <DSIconButtonTooltip label={moreLabel}>
              <DropdownMenuTrigger asChild>
                <DSButton
                  aria-label={moreLabel}
                  size="icon"
                  type="button"
                  variant="secondary"
                >
                  <EllipsisVertical aria-hidden="true" />
                </DSButton>
              </DropdownMenuTrigger>
            </DSIconButtonTooltip>
            <DropdownMenuContent align="end" className="w-56">
              {normalActions.map(renderMenuAction)}
              {destructiveActions.length ? (
                <>
                  <DropdownMenuSeparator />
                  {destructiveActions.map(renderMenuAction)}
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  )
}

export { DSBulkActionBar }
export type { DSBulkAction, DSBulkActionBarProps }

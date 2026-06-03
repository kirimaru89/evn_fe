"use client"

import * as React from "react"
import Link from "next/link"
import { EllipsisVertical } from "lucide-react"

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

type DSTableRowAction = {
  key: string
  label: string
  icon: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: "default" | "destructive"
  quick?: boolean
  disabled?: boolean
}

type DSTableRowActionsProps = {
  actions: readonly DSTableRowAction[]
  align?: "end" | "start"
  disabled?: boolean
  moreLabel?: string
}

function stopRowInteraction(event: React.SyntheticEvent) {
  event.stopPropagation()
}

function ActionIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {icon}
    </span>
  )
}

const destructiveMenuItemClassName =
  "text-destructive! focus:text-destructive! data-[highlighted]:text-destructive! [&_svg]:text-destructive!"

function DSTableRowActions({
  actions,
  align = "end",
  disabled = false,
  moreLabel = "Mở menu thao tác",
}: DSTableRowActionsProps) {
  const quickActions = actions.filter(
    (action) => action.quick && action.variant !== "destructive"
  )
  const normalActions = actions.filter((action) => action.variant !== "destructive")
  const destructiveActions = actions.filter(
    (action) => action.variant === "destructive"
  )
  const hasActions = actions.length > 0

  if (!hasActions) {
    return null
  }

  const renderQuickAction = (action: DSTableRowAction) => {
    const isDisabled = disabled || action.disabled
    const commonProps = {
      "aria-label": action.label,
      "data-row-action": true,
      disabled: isDisabled,
      onClick: (event: React.MouseEvent) => {
        stopRowInteraction(event)
        if (!isDisabled) {
          action.onClick?.()
        }
      },
      onKeyDown: stopRowInteraction,
      size: "icon-sm" as const,
      type: "button" as const,
      variant: "ghost" as const,
      className: cn(
        "size-8",
        action.variant === "destructive" &&
          "text-destructive hover:text-destructive"
      ),
    }

    if (action.href && !isDisabled) {
      return (
        <DSIconButtonTooltip key={action.key} label={action.label}>
          <DSButton
            asChild
            aria-label={action.label}
            className={commonProps.className}
            data-row-action
            size="icon-sm"
            variant="ghost"
          >
            <Link
              href={action.href}
              onClick={stopRowInteraction}
              onKeyDown={stopRowInteraction}
            >
              <ActionIcon icon={action.icon} />
            </Link>
          </DSButton>
        </DSIconButtonTooltip>
      )
    }

    return (
      <DSIconButtonTooltip key={action.key} label={action.label}>
        <DSButton {...commonProps}>
          <ActionIcon icon={action.icon} />
        </DSButton>
      </DSIconButtonTooltip>
    )
  }

  const renderMenuAction = (action: DSTableRowAction) => {
    const isDisabled = disabled || action.disabled
    const isDestructive = action.variant === "destructive"
    const content = (
      <>
        <span className={cn(isDestructive && "text-destructive")}>
          <ActionIcon icon={action.icon} />
        </span>
        <span className={cn(isDestructive && "text-destructive")}>
          {action.label}
        </span>
      </>
    )

    if (action.href && !isDisabled) {
      return (
        <DropdownMenuItem
          key={action.key}
          asChild
          data-row-action
          className={cn(isDestructive && destructiveMenuItemClassName)}
          variant={action.variant}
        >
          <Link
            href={action.href}
            onClick={stopRowInteraction}
            onKeyDown={stopRowInteraction}
          >
            {content}
          </Link>
        </DropdownMenuItem>
      )
    }

    return (
      <DropdownMenuItem
        key={action.key}
        className={cn(isDestructive && destructiveMenuItemClassName)}
        data-row-action
        disabled={isDisabled}
        onClick={(event) => {
          stopRowInteraction(event)
          action.onClick?.()
        }}
        onKeyDown={stopRowInteraction}
        variant={action.variant}
      >
        {content}
      </DropdownMenuItem>
    )
  }

  return (
    <div
      data-row-action
      className={cn(
        "flex items-center gap-1",
        align === "end" ? "justify-end" : "justify-start"
      )}
      onClick={stopRowInteraction}
      onKeyDown={stopRowInteraction}
    >
      {quickActions.length ? (
        <div className="hidden items-center gap-1 group-hover/row:flex group-focus-within/row:flex">
          {quickActions.map(renderQuickAction)}
        </div>
      ) : null}
      <DropdownMenu>
        <DSIconButtonTooltip label={moreLabel}>
          <DropdownMenuTrigger asChild>
            <DSButton
              aria-label={moreLabel}
              data-row-action
              disabled={disabled}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <EllipsisVertical aria-hidden="true" className="size-4" />
            </DSButton>
          </DropdownMenuTrigger>
        </DSIconButtonTooltip>
        <DropdownMenuContent align={align} className="w-52">
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
  )
}

export { DSTableRowActions }
export type { DSTableRowAction, DSTableRowActionsProps }

import * as React from "react"

import { cn } from "@/lib/utils"

function DSPage({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="ds-page"
      className={cn("min-h-full bg-background text-foreground", className)}
      {...props}
    />
  )
}

type DSPageHeaderProps = React.ComponentProps<"header"> & {
  actionsAlign?: "top" | "center"
  density?: "default" | "compact"
  // Compact mode hides descriptions/dividers by default; use these for rare overrides.
  showDescription?: boolean
  showDivider?: boolean
  titleSize?: "default" | "compact"
}

function DSPageHeader({
  actionsAlign,
  className,
  density = "default",
  showDescription,
  showDivider,
  titleSize,
  ...props
}: DSPageHeaderProps) {
  const shouldShowDescription =
    showDescription ?? density === "default"
  const shouldShowDivider = showDivider ?? density === "default"
  const resolvedTitleSize = titleSize ?? density

  return (
    <header
      data-slot="ds-page-header"
      className={cn(
        "flex flex-col xl:flex-row xl:justify-between",
        !actionsAlign && "xl:items-end",
        actionsAlign === "top" && "xl:items-start",
        actionsAlign === "center" && "xl:items-center",
        density === "default" && "gap-6 pb-6",
        density === "compact" && "gap-3 pb-0",
        density === "compact" && !actionsAlign && "xl:items-center",
        shouldShowDivider && "border-b border-border",
        !shouldShowDescription && "[&_[data-slot=ds-page-description]]:hidden",
        resolvedTitleSize === "compact" &&
          "[&_[data-slot=ds-page-title]]:text-2xl [&_[data-slot=ds-page-title]]:sm:text-3xl",
        className
      )}
      {...props}
    />
  )
}

function DSPageTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="ds-page-title"
      className={cn(
        "font-heading text-3xl font-medium tracking-normal sm:text-4xl",
        className
      )}
      {...props}
    />
  )
}

function DSPageDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="ds-page-description"
      className={cn(
        "max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base",
        className
      )}
      {...props}
    />
  )
}

function DSPageActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ds-page-actions"
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        className
      )}
      {...props}
    />
  )
}

type DSPageBodyProps = React.ComponentProps<"div"> & {
  width?: "default" | "full"
}

function DSPageBody({
  className,
  width = "default",
  ...props
}: DSPageBodyProps) {
  return (
    <div
      data-slot="ds-page-body"
      className={cn(
        "flex w-full flex-col gap-6 px-4 py-5 sm:px-6",
        width === "default" && "mx-auto max-w-7xl",
        width === "full" && "max-w-none",
        className
      )}
      {...props}
    />
  )
}

export {
  DSPage,
  DSPageActions,
  DSPageBody,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
}
export type { DSPageBodyProps, DSPageHeaderProps }

import * as React from "react"

import { cn } from "@/lib/utils"

function DSStack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ds-stack"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function DSGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ds-grid"
      className={cn("grid gap-4 md:grid-cols-2", className)}
      {...props}
    />
  )
}

function DSActionBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="ds-action-bar"
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

export { DSActionBar, DSGrid, DSStack }

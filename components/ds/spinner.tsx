import * as React from "react"

import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type DSSpinnerProps = Omit<React.ComponentProps<typeof Spinner>, "aria-label"> & {
  label?: string
  size?: "sm" | "md" | "lg"
}

const spinnerSizeClass = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
} as const

function DSSpinner({
  className,
  label,
  size = "md",
  ...props
}: DSSpinnerProps) {
  return (
    <Spinner
      data-slot="ds-spinner"
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn(spinnerSizeClass[size], className)}
      {...props}
    />
  )
}

export { DSSpinner }
export type { DSSpinnerProps }

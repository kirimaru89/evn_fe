import * as React from "react"

import { cn } from "@/lib/utils"

function DSSection({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="ds-section"
      className={cn("grid gap-4", className)}
      {...props}
    />
  )
}

export { DSSection }

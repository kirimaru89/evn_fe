import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function DSBadge({ className, ...props }: React.ComponentProps<typeof Badge>) {
  return (
    <Badge data-slot="ds-badge" className={cn(className)} {...props} />
  )
}

export { DSBadge }

import * as React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function DSInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input data-slot="ds-input" className={cn(className)} {...props} />
  )
}

export { DSInput }

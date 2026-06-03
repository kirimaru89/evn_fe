import * as React from "react"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

function DSTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea data-slot="ds-textarea" className={cn(className)} {...props} />
  )
}

export { DSTextarea }

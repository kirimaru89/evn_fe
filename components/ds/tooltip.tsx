"use client"

import * as React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DSTooltipProps = React.ComponentProps<typeof TooltipContent> & {
  content: React.ReactNode
  children: React.ReactNode
}

function DSTooltip({ content, children, ...props }: DSTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...props}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { DSTooltip }
export type { DSTooltipProps }

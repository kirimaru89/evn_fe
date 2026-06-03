"use client"

import * as React from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type DSIconButtonTooltipProps = {
  label: string
  children: React.ReactNode
  side?: "top" | "bottom" | "left" | "right"
  delayDuration?: number
}

function DSIconButtonTooltip({
  label,
  children,
  side = "top",
  delayDuration = 0,
}: DSIconButtonTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align="center">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { DSIconButtonTooltip }
export type { DSIconButtonTooltipProps }

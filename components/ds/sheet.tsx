"use client"

import * as React from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type DSSheetProps = React.ComponentProps<typeof Sheet> & {
  trigger?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  side?: React.ComponentProps<typeof SheetContent>["side"]
  contentClassName?: string
}

function DSSheet({
  trigger,
  title,
  description,
  children,
  footer,
  side = "right",
  contentClassName,
  ...props
}: DSSheetProps) {
  return (
    <Sheet {...props}>
      {trigger ? <SheetTrigger asChild>{trigger}</SheetTrigger> : null}
      <SheetContent side={side} className={cn(contentClassName)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? (
            <SheetDescription>{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="grid gap-4 px-4">{children}</div>
        {footer ? <SheetFooter>{footer}</SheetFooter> : null}
      </SheetContent>
    </Sheet>
  )
}

export { DSSheet }
export type { DSSheetProps }

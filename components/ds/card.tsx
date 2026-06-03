import * as React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

function DSCard({ className, ...props }: React.ComponentProps<typeof Card>) {
  return <Card data-slot="ds-card" className={cn(className)} {...props} />
}

function DSCardHeader({
  className,
  ...props
}: React.ComponentProps<typeof CardHeader>) {
  return (
    <CardHeader
      data-slot="ds-card-header"
      className={cn(className)}
      {...props}
    />
  )
}

function DSCardTitle({
  className,
  ...props
}: React.ComponentProps<typeof CardTitle>) {
  return (
    <CardTitle
      data-slot="ds-card-title"
      className={cn(className)}
      {...props}
    />
  )
}

function DSCardDescription({
  className,
  ...props
}: React.ComponentProps<typeof CardDescription>) {
  return (
    <CardDescription
      data-slot="ds-card-description"
      className={cn(className)}
      {...props}
    />
  )
}

function DSCardContent({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      data-slot="ds-card-content"
      className={cn(className)}
      {...props}
    />
  )
}

function DSCardFooter({
  className,
  ...props
}: React.ComponentProps<typeof CardFooter>) {
  return (
    <CardFooter
      data-slot="ds-card-footer"
      className={cn(className)}
      {...props}
    />
  )
}

export {
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardFooter,
  DSCardHeader,
  DSCardTitle,
}

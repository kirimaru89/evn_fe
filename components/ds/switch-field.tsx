"use client"

import * as React from "react"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type DSSwitchFieldProps = Omit<React.ComponentProps<typeof Switch>, "id"> & {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
}

function DSSwitchField({
  id,
  label,
  description,
  error,
  className,
  ...props
}: DSSwitchFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ")

  return (
    <div
      data-slot="ds-switch-field"
      className={cn("group/field flex items-start justify-between gap-4", className)}
    >
      <div className="grid gap-1">
        <label className="text-sm font-medium" htmlFor={id}>
          {label}
        </label>
        {description ? (
          <p className="text-sm text-muted-foreground" id={descriptionId}>
            {description}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-destructive" id={errorId}>
            {error}
          </p>
        ) : null}
      </div>
      <Switch
        id={id}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </div>
  )
}

export { DSSwitchField }
export type { DSSwitchFieldProps }

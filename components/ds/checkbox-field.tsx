"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type DSCheckboxFieldProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "id"
> & {
  id: string
  label: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
}

function DSCheckboxField({
  id,
  label,
  description,
  error,
  className,
  ...props
}: DSCheckboxFieldProps) {
  const descriptionId = description ? `${id}-description` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ")

  return (
    <div
      data-slot="ds-checkbox-field"
      className={cn("group/field grid gap-2", className)}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : undefined}
          {...props}
        />
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
      </div>
    </div>
  )
}

export { DSCheckboxField }
export type { DSCheckboxFieldProps }

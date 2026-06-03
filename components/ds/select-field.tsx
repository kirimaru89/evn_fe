"use client"

import * as React from "react"

import { DSFormField } from "@/components/ds/form-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type DSSelectFieldOption = {
  label: string
  value: string
}

type DSSelectFieldProps = Omit<
  React.ComponentProps<typeof Select>,
  "children" | "onValueChange"
> & {
  id?: string
  label: string
  required?: boolean
  description?: string
  error?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: DSSelectFieldOption[]
  disabled?: boolean
}

function DSSelectField({
  id: providedId,
  label,
  required = false,
  description,
  error,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Chọn một tùy chọn",
  options,
  disabled = false,
  ...props
}: DSSelectFieldProps) {
  const generatedId = React.useId()
  const id = providedId ?? generatedId

  return (
    <DSFormField
      description={description}
      error={error}
      htmlFor={id}
      label={label}
      required={required}
    >
      {(fieldProps) => (
        <Select
          defaultValue={defaultValue}
          disabled={disabled}
          onValueChange={onValueChange}
          value={value}
          {...props}
        >
          <SelectTrigger className="w-full" {...fieldProps}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </DSFormField>
  )
}

export { DSSelectField }
export type { DSSelectFieldOption, DSSelectFieldProps }

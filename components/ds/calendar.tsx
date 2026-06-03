"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSFormField } from "./form-field"

type DSCalendarProps = React.ComponentProps<typeof Calendar>

type DSDatePickerProps = {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  disabled?: boolean
  label?: string
  description?: string
  error?: string
  id?: string
  className?: string
}

function DSCalendar({ className, ...props }: DSCalendarProps) {
  return (
    <Calendar
      data-slot="ds-calendar"
      className={cn(className)}
      {...props}
    />
  )
}

function DSDatePickerControl({
  id,
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled = false,
  describedBy,
  invalid,
}: {
  id: string
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
  disabled?: boolean
  describedBy?: string
  invalid?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DSButton
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
          leftIcon={<CalendarIcon />}
          type="button"
          variant="outline"
        >
          {value ? format(value, "dd/MM/yyyy") : placeholder}
        </DSButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <DSCalendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  )
}

function DSDatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  disabled = false,
  label,
  description,
  error,
  id,
  className,
}: DSDatePickerProps) {
  const generatedId = React.useId()
  const pickerId = id ?? generatedId

  if (!label) {
    return (
      <div className={className}>
        <DSDatePickerControl
          id={pickerId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    )
  }

  return (
    <DSFormField
      className={className}
      htmlFor={pickerId}
      label={label}
      description={description}
      error={error}
    >
      {(fieldProps) => (
        <DSDatePickerControl
          id={fieldProps.id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          describedBy={fieldProps["aria-describedby"]}
          invalid={fieldProps["aria-invalid"]}
        />
      )}
    </DSFormField>
  )
}

export { DSCalendar, DSDatePicker }
export type { DSCalendarProps, DSDatePickerProps }

"use client"

import * as React from "react"
import { CalendarIcon, CheckIcon, ChevronDownIcon } from "lucide-react"
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSDatePicker } from "./calendar"

type DSDateRangeFilterRange = {
  from?: Date
  to?: Date
}

type DSDateRangeFilterProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
  customRange?: DSDateRangeFilterRange
  onCustomRangeChange?: (range: DSDateRangeFilterRange) => void
  placeholder?: string
  disabled?: boolean
}

const currentYear = new Date().getFullYear()

const presetOptions = [
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày qua", value: "last-7-days" },
  { label: "30 ngày qua", value: "last-30-days" },
  { label: `Năm nay (${currentYear})`, value: "this-year" },
  { label: `Năm trước (${currentYear - 1})`, value: "last-year" },
] as const

const customOption = { label: "Khoảng ngày tùy chỉnh", value: "custom" } as const

function formatDate(value?: Date) {
  if (!value) {
    return ""
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(value)
}

function getSelectedLabel(value: string, customRange?: DSDateRangeFilterRange) {
  if (value === "custom" && customRange?.from && customRange.to) {
    return `${formatDate(customRange.from)} đến ${formatDate(customRange.to)}`
  }

  if (value === customOption.value) {
    return customOption.label
  }

  return presetOptions.find((option) => option.value === value)?.label
}

function DSDateRangeFilter({
  label,
  value,
  onValueChange,
  customRange,
  onCustomRangeChange,
  placeholder,
  disabled = false,
}: DSDateRangeFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [customExpanded, setCustomExpanded] = React.useState(
    value === customOption.value
  )
  const [draftRange, setDraftRange] = React.useState<DSDateRangeFilterRange>(
    customRange ?? {}
  )
  const selectedLabel =
    getSelectedLabel(value, customRange) ?? placeholder ?? "Chọn khoảng thời gian"
  const triggerLabel = `${label}: ${selectedLabel}`

  const updateOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      setCustomExpanded(value === customOption.value)
      setDraftRange(customRange ?? {})
    }

    setOpen(nextOpen)
  }

  const applyPreset = (nextValue: string) => {
    onValueChange(nextValue)
    setCustomExpanded(false)
    setOpen(false)
  }

  const applyCustomRange = () => {
    onCustomRangeChange?.(draftRange)
    onValueChange("custom")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={updateOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label={`Lọc theo ${label}`}
          className="flex h-9 w-full items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-left text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:bg-muted dark:bg-input/30 dark:hover:bg-input/50 sm:w-56 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          disabled={disabled}
          type="button"
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <CalendarIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="truncate">{triggerLabel}</span>
          </span>
          <HugeiconsIcon
            aria-hidden="true"
            icon={UnfoldMoreIcon}
            strokeWidth={2}
            className="pointer-events-none size-4 shrink-0 text-muted-foreground"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-1">
        <div className="grid gap-1">
          {presetOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "relative flex w-full items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-left text-sm outline-none transition-colors hover:bg-foreground/10 focus-visible:bg-foreground/10 focus-visible:text-accent-foreground",
                value === option.value && "font-medium"
              )}
              onClick={() => applyPreset(option.value)}
            >
              <CheckIcon
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-2 size-4 shrink-0 text-muted-foreground",
                  value !== option.value && "opacity-0"
                )}
              />
              <span>{option.label}</span>
            </button>
          ))}
          <button
            type="button"
            aria-expanded={customExpanded}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-sm py-1.5 pr-8 pl-2 text-left text-sm outline-none transition-colors hover:bg-foreground/10 focus-visible:bg-foreground/10 focus-visible:text-accent-foreground",
              value === customOption.value && "font-medium"
            )}
            onClick={() => {
              setCustomExpanded((current) => !current)
              setDraftRange(customRange ?? {})
            }}
          >
            <span>{customOption.label}</span>
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                customExpanded && "rotate-180"
              )}
            />
          </button>
          {customExpanded ? (
            <div className="mx-1 mt-1 grid gap-3 rounded-md border bg-muted/30 p-3">
              <DSDatePicker
                label="Từ ngày"
                value={draftRange.from}
                onChange={(date) =>
                  setDraftRange((current) => ({
                    ...current,
                    from: date,
                  }))
                }
                placeholder="Chọn ngày bắt đầu"
              />
              <DSDatePicker
                label="Đến ngày"
                value={draftRange.to}
                onChange={(date) =>
                  setDraftRange((current) => ({
                    ...current,
                    to: date,
                  }))
                }
                placeholder="Chọn ngày kết thúc"
              />
              <div className="flex justify-end">
                <DSButton
                  type="button"
                  disabled={!draftRange.from || !draftRange.to}
                  onClick={applyCustomRange}
                >
                  Áp dụng
                </DSButton>
              </div>
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DSDateRangeFilter }
export type { DSDateRangeFilterProps, DSDateRangeFilterRange }

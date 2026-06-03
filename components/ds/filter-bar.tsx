"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DSButton } from "./button"
import { DSSearchInput } from "./search-input"

type DSFilterOption = {
  label: string
  value: string
  displayLabel?: string
}

type DSFilterConfig = {
  label: string
  value?: string
  onValueChange?: (value: string) => void
  options: DSFilterOption[]
  placeholder?: string
  selectedValueLabel?: string
  ariaLabel?: string
}

type DSFilterBarProps = Omit<React.ComponentProps<"div">, "children"> & {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  searchLabel?: string
  filterValue?: string
  onFilterChange?: (value: string) => void
  filterOptions?: DSFilterOption[]
  filterPlaceholder?: string
  filterLabel?: string
  selectedValueLabel?: string
  filters?: DSFilterConfig[]
  primaryFilters?: React.ReactNode
  onClear?: () => void
  clearLabel?: string
  showClear?: boolean
  disabled?: boolean
  loading?: boolean
  actions?: React.ReactNode
  children?: React.ReactNode
}

function disableActionNode(node: React.ReactNode) {
  return React.Children.map(node, (child) => {
    if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(child)) {
      return child
    }

    return React.cloneElement(child, {
      "aria-disabled": true,
      disabled: true,
      tabIndex: -1,
    } as Partial<React.HTMLAttributes<HTMLElement>>)
  })
}

function DSFilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Tìm kiếm...",
  searchLabel = "Tìm kiếm",
  filterValue,
  onFilterChange,
  filterOptions,
  filterPlaceholder = "Bộ lọc",
  filterLabel = "Bộ lọc",
  selectedValueLabel,
  filters,
  primaryFilters,
  onClear,
  clearLabel = "Đặt lại bộ lọc",
  showClear = false,
  disabled = false,
  loading = false,
  actions,
  children,
  className,
  ...props
}: DSFilterBarProps) {
  const searchId = React.useId()
  const filterBaseId = React.useId()
  const isDisabled = disabled || loading
  const actionContent = actions ?? children
  const resolvedFilters =
    filters ??
    (filterOptions
      ? [
          {
            label: filterLabel,
            value: filterValue,
            onValueChange: onFilterChange,
            options: filterOptions,
            placeholder: filterPlaceholder,
            selectedValueLabel,
          },
        ]
      : [])
  const hasFilterValue = resolvedFilters.some((filter) =>
    Boolean(filter.value)
  )
  const hasSearchValue = Boolean(searchValue)
  const shouldShowClear = showClear || hasSearchValue || hasFilterValue

  return (
    <div
      data-slot="ds-filter-bar"
      aria-busy={loading}
      aria-disabled={isDisabled}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between",
        disabled && "opacity-60",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor={searchId}>
          {searchLabel}
        </label>
        <DSSearchInput
          id={searchId}
          aria-label={searchLabel}
          className="w-full sm:max-w-xs"
          disabled={isDisabled}
          onChange={onSearchChange}
          placeholder={loading ? "Đang tải bộ lọc..." : searchPlaceholder}
          value={searchValue}
        />
        {primaryFilters
          ? isDisabled
            ? disableActionNode(primaryFilters)
            : primaryFilters
          : null}
        {resolvedFilters.map((filter, index) => {
          const filterId = `${filterBaseId}-${index}`
          const selectedFilterLabel = filter.selectedValueLabel ?? filter.label

          return (
            <React.Fragment key={`${filter.label}-${index}`}>
              <label className="sr-only" htmlFor={filterId}>
                {filter.ariaLabel ?? filter.label}
              </label>
              <Select
                disabled={isDisabled}
                onValueChange={filter.onValueChange}
                value={filter.value}
              >
                <SelectTrigger
                  id={filterId}
                  aria-label={filter.ariaLabel ?? filter.label}
                  className="w-full hover:bg-muted aria-expanded:bg-muted sm:w-48"
                >
                  <SelectValue placeholder={filter.placeholder ?? filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value === filter.value ? (
                        <span className="contents">
                          <span className="in-data-[slot=select-content]:sr-only">
                            {selectedFilterLabel}:{" "}
                          </span>
                          {option.displayLabel ?? option.label}
                        </span>
                      ) : (
                        option.label
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </React.Fragment>
          )
        })}
        {shouldShowClear ? (
          <DSButton
            disabled={isDisabled}
            onClick={onClear}
            type="button"
            variant="outline"
          >
            {clearLabel}
          </DSButton>
        ) : null}
      </div>
      {actionContent ? (
        <div
          aria-disabled={isDisabled}
          className={cn(
            "flex flex-col gap-2 sm:flex-row sm:items-center",
            isDisabled && "opacity-60"
          )}
        >
          {isDisabled ? disableActionNode(actionContent) : actionContent}
        </div>
      ) : null}
    </div>
  )
}

export { DSFilterBar }
export type { DSFilterBarProps, DSFilterConfig, DSFilterOption }

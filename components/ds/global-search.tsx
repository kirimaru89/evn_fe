"use client"

import * as React from "react"
import { ChevronDown, History } from "lucide-react"

import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSSearchInput } from "./search-input"

type DSGlobalSearchProps = {
  placeholder?: string
  recentKeywords?: string[]
  onSearchSubmit?: (keyword: string) => void
  onValueChange?: (value: string) => void
  value?: string
  maxCollapsedItems?: number
  maxExpandedItems?: number
  className?: string
  inputClassName?: string
  "aria-label"?: string
}

function DSGlobalSearch({
  placeholder = "Tìm kiếm trong hệ thống...",
  recentKeywords = [],
  onSearchSubmit,
  onValueChange,
  value,
  maxCollapsedItems = 5,
  maxExpandedItems = 12,
  className,
  inputClassName,
  "aria-label": ariaLabel = "Tìm kiếm trong hệ thống",
}: DSGlobalSearchProps) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)
  const [uncontrolledValue, setUncontrolledValue] = React.useState("")
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : uncontrolledValue
  const collapsedLimit = Math.max(1, maxCollapsedItems)
  const expandedLimit = Math.max(collapsedLimit, maxExpandedItems)
  const visibleKeywords = recentKeywords.slice(
    0,
    expanded ? expandedLimit : collapsedLimit
  )
  const canExpand = recentKeywords.length > collapsedLimit && !expanded

  React.useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [open])

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  const submitSearch = (keyword: string) => {
    const trimmedKeyword = keyword.trim()

    if (!trimmedKeyword) {
      return
    }

    updateValue(trimmedKeyword)
    onSearchSubmit?.(trimmedKeyword)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <DSSearchInput
        aria-label={ariaLabel}
        aria-expanded={open}
        inputClassName={inputClassName}
        onChange={updateValue}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault()
            submitSearch(currentValue)
          }

          if (event.key === "Escape") {
            event.preventDefault()
            setOpen(false)
          }
        }}
        placeholder={placeholder}
        value={currentValue}
      />
      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md bg-popover p-2 text-popover-foreground shadow-md ring-1 ring-foreground/10">
        <div className="grid gap-1">
          <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Tìm kiếm gần đây
          </div>
          {visibleKeywords.length ? (
            visibleKeywords.map((keyword) => (
              <button
                key={keyword}
                type="button"
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-foreground/10 focus-visible:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => submitSearch(keyword)}
              >
                <History
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <span className="truncate">{keyword}</span>
              </button>
            ))
          ) : (
            <div className="px-2 py-3 text-sm text-muted-foreground">
              Chưa có tìm kiếm gần đây
            </div>
          )}
          {canExpand ? (
            <DSButton
              className="mt-1 justify-start"
              onClick={() => setExpanded(true)}
              rightIcon={<ChevronDown className="text-muted-foreground" />}
              size="sm"
              type="button"
              variant="ghost"
            >
              Xem thêm
            </DSButton>
          ) : null}
        </div>
        </div>
      ) : null}
    </div>
  )
}

export { DSGlobalSearch }
export type { DSGlobalSearchProps }

"use client"

import * as React from "react"
import { Search, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { DSInput } from "./input"

type DSSearchInputProps = Omit<
  React.ComponentProps<typeof DSInput>,
  "defaultValue" | "onChange" | "type" | "value"
> & {
  clearLabel?: string
  defaultValue?: string
  onChange?: (value: string) => void
  inputClassName?: string
  value?: string
}

function DSSearchInput({
  className,
  clearLabel = "Xóa tìm kiếm",
  defaultValue = "",
  disabled,
  inputClassName,
  onChange,
  placeholder = "Tìm kiếm...",
  readOnly,
  value,
  ...props
}: DSSearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : uncontrolledValue
  const canClear = Boolean(currentValue) && !disabled && !readOnly

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(nextValue)
    }

    onChange?.(nextValue)
  }

  const clearSearch = () => {
    updateValue("")
    inputRef.current?.focus()
  }

  return (
    <div data-slot="ds-search-input" className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <DSInput
        ref={inputRef}
        type="text"
        role="searchbox"
        className={cn("w-full pl-9 pr-9", inputClassName)}
        disabled={disabled}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        value={currentValue}
        {...props}
      />
      {canClear ? (
        <button
          type="button"
          aria-label={clearLabel}
          className="absolute right-1.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground opacity-70 transition-colors hover:text-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          onClick={clearSearch}
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

export { DSSearchInput }
export type { DSSearchInputProps }

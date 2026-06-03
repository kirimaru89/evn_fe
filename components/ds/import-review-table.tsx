"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type DSImportReviewCellError = {
  message: string
  blocking?: boolean
}

type DSImportReviewRow = {
  id: string
  errors?: Record<string, DSImportReviewCellError | undefined>
}

type DSImportReviewTableColumn<TData extends DSImportReviewRow> = {
  key: string
  header: React.ReactNode
  accessor?: keyof TData | ((row: TData) => React.ReactNode)
  renderCell?: (args: {
    row: TData
    value: React.ReactNode
    error?: DSImportReviewCellError
  }) => React.ReactNode
  renderEditor?: (args: {
    row: TData
    value: string
    error?: DSImportReviewCellError
    errorId?: string
    onChange: (value: string) => void
  }) => React.ReactNode
  onCellChange?: (row: TData, value: string) => void
  hasDropdownAffordance?: boolean
  editable?: boolean
  className?: string
  headerClassName?: string
}

type DSImportReviewTableProps<TData extends DSImportReviewRow> = {
  columns: readonly DSImportReviewTableColumn<TData>[]
  rows: readonly TData[]
  emptyMessage?: string
  className?: string
}

type DSImportReviewSelectCellOption = {
  label: string
  value: string
}

type DSImportReviewSelectCellProps = {
  "aria-label": string
  "aria-describedby"?: string
  "aria-invalid"?: boolean
  options: readonly DSImportReviewSelectCellOption[]
  placeholder?: string
  value: string
  onValueChange: (value: string) => void
}

function getCellValue<TData extends DSImportReviewRow>(
  row: TData,
  column: DSImportReviewTableColumn<TData>
) {
  if (typeof column.accessor === "function") {
    return column.accessor(row)
  }

  const key = column.accessor ?? column.key
  const value = row[key as keyof TData]

  return typeof value === "string" || typeof value === "number" ? value : ""
}

function getSpreadsheetColumnLabel(index: number) {
  let value = index + 1
  let label = ""

  while (value > 0) {
    const remainder = (value - 1) % 26
    label = String.fromCharCode(65 + remainder) + label
    value = Math.floor((value - 1) / 26)
  }

  return label
}

const spreadsheetSelectShellClassName =
  "flex h-6 min-h-0 w-full min-w-0 items-center justify-start border-0 bg-transparent px-0 py-0 text-left text-xs leading-none text-foreground outline-none"
const spreadsheetSelectTextClassName = "min-w-0 flex-1 truncate leading-none"
const spreadsheetSelectIconClassName =
  "pointer-events-none ml-1 flex size-3 shrink-0 self-center text-muted-foreground"

function DSImportReviewSelectCell({
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  options,
  placeholder = "Chọn giá trị",
  value,
  onValueChange,
}: DSImportReviewSelectCellProps) {
  const [active, setActive] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const selectedOption = options.find((option) => option.value === value)
  const displayValue = selectedOption?.label ?? ""
  const setCellActive = React.useCallback((active: boolean) => {
    const cell = rootRef.current?.closest("td")

    if (!cell) {
      return
    }

    if (active) {
      cell.setAttribute("data-spreadsheet-active", "true")
      return
    }

    cell.removeAttribute("data-spreadsheet-active")
  }, [])
  const openEditor = React.useCallback(() => {
    setActive(true)
    setOpen(true)
    setCellActive(true)
  }, [setCellActive])
  const closeEditor = React.useCallback(() => {
    setOpen(false)
    setActive(false)
    setCellActive(false)
  }, [setCellActive])

  React.useEffect(() => {
    return () => setCellActive(false)
  }, [setCellActive])

  React.useEffect(() => {
    if (active && open) {
      triggerRef.current?.focus()
    }
  }, [active, open])

  if (!active && !open) {
    return (
      <div ref={rootRef} data-spreadsheet-editor="select" className="h-full w-full">
        <button
          type="button"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          data-invalid={ariaInvalid ? "true" : undefined}
          className={cn(
            spreadsheetSelectShellClassName,
            "focus-visible:ring-0"
          )}
          onClick={openEditor}
          onPointerDown={openEditor}
        >
          <span
            className={cn(
              spreadsheetSelectTextClassName,
              !displayValue && "text-muted-foreground"
            )}
          >
            {displayValue || placeholder}
          </span>
          <span aria-hidden="true" className={spreadsheetSelectIconClassName}>
            <ChevronDown className="size-3 shrink-0" />
          </span>
        </button>
      </div>
    )
  }

  return (
    <div ref={rootRef} data-spreadsheet-editor="select" className="h-full w-full">
      <Select
        value={value}
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            setOpen(true)
            setCellActive(true)
            return
          }

          closeEditor()
        }}
        onValueChange={(nextValue) => {
          onValueChange(nextValue)
          closeEditor()
        }}
      >
        <SelectTrigger
          ref={triggerRef}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={ariaInvalid}
          className={cn(
            spreadsheetSelectShellClassName,
            "rounded-none shadow-none ring-0 focus-visible:border-transparent focus-visible:ring-0 aria-invalid:border-0 aria-invalid:ring-0 [&>svg]:hidden"
          )}
          onPointerDownCapture={openEditor}
          onClick={openEditor}
        >
          <span
            className={cn(
              spreadsheetSelectTextClassName,
              !displayValue && "text-muted-foreground"
            )}
          >
            {displayValue || placeholder}
          </span>
          <span aria-hidden="true" className={spreadsheetSelectIconClassName}>
            <ChevronDown className="size-3 shrink-0" />
          </span>
        </SelectTrigger>
        <SelectContent align="start" position="popper" className="z-80">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function DSImportReviewTable<TData extends DSImportReviewRow>({
  columns,
  rows,
  emptyMessage = "Chưa có dữ liệu import.",
  className,
}: DSImportReviewTableProps<TData>) {
  return (
    <div
      className={cn(
        "flex min-w-full flex-col rounded-lg border border-foreground/20 bg-background",
        className
      )}
    >
      <div className="min-w-full">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky left-0 z-30 h-6 w-9 min-w-9 border-b border-r border-foreground/20 bg-muted px-1 text-center text-[10px] font-medium text-muted-foreground" />
              {columns.map((column, columnIndex) => (
                <TableHead
                  key={`${column.key}-letter`}
                  className="h-6 min-w-36 border-b border-r border-foreground/20 bg-muted px-1 text-center text-[10px] font-medium text-muted-foreground"
                >
                  {getSpreadsheetColumnLabel(columnIndex)}
                </TableHead>
              ))}
            </TableRow>
            <TableRow className="hover:bg-transparent">
              <TableHead className="sticky left-0 z-30 h-6 w-9 min-w-9 border-b border-r border-foreground/20 bg-muted px-1 text-center text-[10px] font-medium text-muted-foreground">
                #
              </TableHead>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "h-6 min-w-36 border-b border-r border-foreground/20 bg-muted px-1 text-[11px] font-medium text-muted-foreground",
                    column.headerClassName
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row, rowIndex) => (
                <TableRow key={row.id}>
                  <TableCell className="sticky left-0 z-30 h-6 w-9 min-w-9 border-b border-r border-foreground/20 bg-background px-1 py-0 text-center text-[10px] leading-tight text-muted-foreground">
                    {rowIndex + 1}
                  </TableCell>
                  {columns.map((column) => {
                    const error = row.errors?.[column.key]
                    const errorId = error
                      ? `import-review-${row.id}-${column.key}-error`
                      : undefined
                    const rawValue = getCellValue(row, column)
                    const value =
                      typeof rawValue === "string" ||
                      typeof rawValue === "number"
                        ? String(rawValue)
                        : ""
                    const content = column.renderEditor
                      ? column.renderEditor({
                          row,
                          value,
                          error,
                          errorId,
                          onChange: (nextValue) =>
                            column.onCellChange?.(row, nextValue),
                        })
                      : column.renderCell
                        ? column.renderCell({ row, value: rawValue, error })
                        : rawValue

                    return (
                      <TableCell
                        key={column.key}
                        title={error?.message}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={errorId}
                        onPointerDown={(event) => {
                          if (!column.renderEditor) {
                            return
                          }

                          const target = event.target as HTMLElement
                          if (
                            target.closest(
                              "input,button,select,textarea,[role='combobox'],[data-spreadsheet-editor]"
                            )
                          ) {
                            return
                          }

                          const editor = event.currentTarget.querySelector<
                            HTMLInputElement | HTMLButtonElement
                          >("input,button,[data-spreadsheet-editor]")

                          editor?.focus()
                          if (
                            editor instanceof HTMLButtonElement ||
                            editor?.getAttribute("role") === "combobox"
                          ) {
                            editor.click()
                          }
                        }}
                        className={cn(
                          "h-6 min-w-36 border-b border-r border-foreground/20 p-0 text-left align-middle whitespace-normal focus-within:relative focus-within:z-40 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary data-[spreadsheet-active=true]:relative data-[spreadsheet-active=true]:z-40 data-[spreadsheet-active=true]:ring-2 data-[spreadsheet-active=true]:ring-inset data-[spreadsheet-active=true]:ring-primary",
                          column.renderEditor && "cursor-text",
                          error &&
                            "bg-destructive/5 ring-1 ring-inset ring-destructive/40",
                          column.className
                        )}
                      >
                        <div className="relative flex h-6 min-h-6 items-center px-1 py-0 text-left">
                          {content}
                          {error ? (
                            <span id={errorId} className="sr-only">
                              {error.message}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-28 text-center text-muted-foreground"
                  colSpan={columns.length + 1}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  )
}

export { DSImportReviewSelectCell, DSImportReviewTable }
export type {
  DSImportReviewCellError,
  DSImportReviewRow,
  DSImportReviewSelectCellOption,
  DSImportReviewSelectCellProps,
  DSImportReviewTableColumn,
  DSImportReviewTableProps,
}

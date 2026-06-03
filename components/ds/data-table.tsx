"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowDown, ArrowUp, Settings2 } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { DSButton } from "./button"
import { DSRangePagination } from "./pagination"
import { DSStateEmpty } from "./state-empty"
import { DSStateError } from "./state-error"
import { DSTableRowActions } from "./table-row-actions"
import type { DSTableRowAction } from "./table-row-actions"

type DSDataTableAlign = "left" | "center" | "right"
type DSDataTableSortDirection = "asc" | "desc"

type DSDataTableColumn<TData> = {
  key: string
  header: React.ReactNode
  accessor: keyof TData | ((row: TData) => React.ReactNode)
  render?: (value: React.ReactNode, row: TData) => React.ReactNode
  renderLeading?: (row: TData, index: number) => React.ReactNode
  align?: DSDataTableAlign
  className?: string
  sortable?: boolean
  sortKey?: string
  sortDirection?: DSDataTableSortDirection
  onSortChange?: (
    sortKey: string,
    nextDirection: DSDataTableSortDirection
  ) => void
  hideable?: boolean
  defaultVisible?: boolean
}

type DSDataTableActionContext = {
  disabled: boolean
}

type DSDataTableRowInteractionContext = {
  disabled: boolean
  href?: string
}

type DSDataTableProps<TData> = {
  columns: readonly DSDataTableColumn<TData>[]
  data: readonly TData[]
  getRowId?: (row: TData, index: number) => React.Key
  getRowAriaLabel?: (row: TData, index: number) => string
  getRowHref?: (row: TData, index: number) => string | undefined
  emptyTitle?: React.ReactNode
  emptyMessage?: React.ReactNode
  noResultsTitle?: React.ReactNode
  noResultsMessage?: React.ReactNode
  isFiltered?: boolean
  loading?: boolean
  loadingMessage?: React.ReactNode
  error?: React.ReactNode
  disabled?: boolean
  page?: number
  pageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  pagination?: boolean
  paginationPlacement?: "footer" | "header" | "none"
  enableColumnVisibility?: boolean
  visibleColumnKeys?: string[]
  onVisibleColumnKeysChange?: (keys: string[]) => void
  columnVisibilityLabel?: string
  onRowClick?: (
    row: TData,
    context: DSDataTableRowInteractionContext
  ) => void
  rowClickable?: boolean
  renderActions?: (
    row: TData,
    context: DSDataTableActionContext
  ) => React.ReactNode
  rowActions?: (
    row: TData,
    context: DSDataTableActionContext
  ) => readonly DSTableRowAction[]
  scrollMode?: "page" | "body"
  stickyHeader?: boolean
  enableRowSelection?: boolean
  selectedRowIds?: readonly string[]
  onSelectedRowIdsChange?: (ids: string[]) => void
  getRowSelectionLabel?: (row: TData, index: number) => string
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const

const sortableHeaderAlignClass = {
  left: "justify-start",
  center: "justify-center",
  right: "ml-auto justify-end",
} as const

const tableHeaderBackgroundClassName = "bg-muted"
const selectionCheckboxClassName = "size-[18px] border-2"
const headerSelectionCheckboxClassName =
  "size-[18px] border-2 bg-background shadow-xs hover:bg-background"

function getColumnValue<TData>(
  row: TData,
  accessor: DSDataTableColumn<TData>["accessor"]
) {
  if (typeof accessor === "function") {
    return accessor(row)
  }

  return row[accessor] as React.ReactNode
}

function disableAction(action: React.ReactNode) {
  if (React.isValidElement<React.HTMLAttributes<HTMLElement>>(action)) {
    return React.cloneElement(action, {
      "aria-disabled": true,
      disabled: true,
      tabIndex: -1,
    } as Partial<React.HTMLAttributes<HTMLElement>>)
  }

  return (
    <span className="pointer-events-none opacity-60" aria-disabled="true">
      {action}
    </span>
  )
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest(
      "a, button, input, select, textarea, [role='button'], [data-row-action]"
    )
  )
}

function getNextSortDirection(direction: DSDataTableSortDirection) {
  return direction === "asc" ? "desc" : "asc"
}

function getSortLabel(
  header: React.ReactNode,
  direction: DSDataTableSortDirection
) {
  const label = typeof header === "string" ? header : "cột"

  return direction === "asc"
    ? `Sắp xếp ${label} giảm dần`
    : `Sắp xếp ${label} tăng dần`
}

function SortIcon({ direction }: { direction: DSDataTableSortDirection }) {
  if (direction === "asc") {
    return <ArrowUp aria-hidden="true" className="size-3.5" />
  }

  if (direction === "desc") {
    return <ArrowDown aria-hidden="true" className="size-3.5" />
  }

  return <ArrowDown aria-hidden="true" className="size-3.5" />
}

function getColumnLabel<TData>(column: DSDataTableColumn<TData>) {
  return typeof column.header === "string" ? column.header : column.key
}

function getDefaultVisibleColumnKeys<TData>(
  columns: readonly DSDataTableColumn<TData>[]
) {
  return columns
    .filter((column) => !column.hideable || column.defaultVisible !== false)
    .map((column) => column.key)
}

function DSDataTable<TData>({
  columns,
  data,
  getRowAriaLabel,
  getRowId,
  getRowHref,
  emptyTitle = "Chưa có dữ liệu",
  emptyMessage = "Chưa có bản ghi nào.",
  noResultsTitle = "Không tìm thấy kết quả",
  noResultsMessage = "Hãy điều chỉnh từ khóa hoặc bộ lọc.",
  isFiltered = false,
  loading = false,
  loadingMessage = "Đang tải dữ liệu bảng.",
  error,
  disabled = false,
  page = 1,
  pageSize,
  totalItems,
  onPageChange,
  pagination = false,
  paginationPlacement = "footer",
  enableColumnVisibility = false,
  visibleColumnKeys,
  onVisibleColumnKeysChange,
  columnVisibilityLabel = "Tùy chỉnh cột hiển thị",
  onRowClick,
  rowClickable,
  renderActions,
  rowActions,
  scrollMode = "page",
  stickyHeader,
  enableRowSelection = false,
  selectedRowIds = [],
  onSelectedRowIdsChange,
  getRowSelectionLabel,
}: DSDataTableProps<TData>) {
  const router = useRouter()
  const errorId = React.useId()
  const defaultVisibleColumnKeys = React.useMemo(
    () => getDefaultVisibleColumnKeys(columns),
    [columns]
  )
  const [uncontrolledVisibleColumnKeys, setUncontrolledVisibleColumnKeys] =
    React.useState(defaultVisibleColumnKeys)
  const resolvedVisibleColumnKeys =
    visibleColumnKeys ?? uncontrolledVisibleColumnKeys
  const visibleColumns = React.useMemo(
    () =>
      columns.filter(
        (column) =>
          !column.hideable || resolvedVisibleColumnKeys.includes(column.key)
      ),
    [columns, resolvedVisibleColumnKeys]
  )
  const hideableColumns = React.useMemo(
    () => columns.filter((column) => column.hideable),
    [columns]
  )
  const hasActions = Boolean(renderActions || rowActions)
  const columnCount =
    visibleColumns.length + (hasActions ? 1 : 0) + (enableRowSelection ? 1 : 0)
  const shouldUseStickyHeader = stickyHeader ?? scrollMode === "body"
  const rowIds = React.useMemo(
    () => data.map((row, index) => String(getRowId?.(row, index) ?? index)),
    [data, getRowId]
  )
  const selectedIdSet = React.useMemo(
    () => new Set(selectedRowIds),
    [selectedRowIds]
  )
  const selectedVisibleCount = rowIds.filter((id) => selectedIdSet.has(id)).length
  const allVisibleRowsSelected =
    rowIds.length > 0 && selectedVisibleCount === rowIds.length
  const someVisibleRowsSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < rowIds.length
  const resolvedPageSize = Math.max(1, pageSize ?? 50)
  const resolvedTotalItems = Math.max(0, totalItems ?? data.length)
  const totalPages = Math.max(1, Math.ceil(resolvedTotalItems / resolvedPageSize))
  const resolvedPage = Math.min(Math.max(page, 1), totalPages)
  const updateVisibleColumnKeys = (nextKeys: string[]) => {
    if (!visibleColumnKeys) {
      setUncontrolledVisibleColumnKeys(nextKeys)
    }

    onVisibleColumnKeysChange?.(nextKeys)
  }

  const toggleColumnVisibility = (columnKey: string, nextVisible: boolean) => {
    const nextKeys = nextVisible
      ? Array.from(new Set([...resolvedVisibleColumnKeys, columnKey]))
      : resolvedVisibleColumnKeys.filter((key) => key !== columnKey)

    updateVisibleColumnKeys(nextKeys)
  }

  const toggleAllVisibleRows = (checked: boolean) => {
    const nextIds = checked
      ? Array.from(new Set([...selectedRowIds, ...rowIds]))
      : selectedRowIds.filter((id) => !rowIds.includes(id))

    onSelectedRowIdsChange?.(nextIds)
  }

  const toggleRowSelection = (rowId: string, checked: boolean) => {
    const nextIds = checked
      ? Array.from(new Set([...selectedRowIds, rowId]))
      : selectedRowIds.filter((id) => id !== rowId)

    onSelectedRowIdsChange?.(nextIds)
  }

  return (
    <div
      data-slot="ds-data-table"
      aria-busy={loading}
      aria-describedby={error ? errorId : undefined}
      aria-disabled={disabled}
      data-scroll-mode={scrollMode}
      className={cn(
        scrollMode === "body" && "flex h-full min-h-0 flex-col",
        disabled && "opacity-60"
      )}
    >
      {loading ? (
        <div className="sr-only" role="status" aria-live="polite">
          {loadingMessage}
        </div>
      ) : null}
      <div
        className={cn(
          "rounded-lg border border-border",
          scrollMode === "body"
            ? "min-h-0 flex-1 overflow-auto [&_[data-slot=table-container]]:overflow-visible"
            : "overflow-hidden"
        )}
      >
        <Table>
          <TableHeader className={tableHeaderBackgroundClassName}>
            <TableRow
              className={cn(
                tableHeaderBackgroundClassName,
                "hover:bg-muted"
              )}
            >
              {enableRowSelection ? (
                <TableHead
                  className={cn(
                    "w-11 min-w-11",
                    tableHeaderBackgroundClassName,
                    shouldUseStickyHeader && "sticky top-0 z-30"
                  )}
                >
                  <Checkbox
                    aria-label="Chọn tất cả dòng đang hiển thị"
                    className={headerSelectionCheckboxClassName}
                    checked={
                      allVisibleRowsSelected
                        ? true
                        : someVisibleRowsSelected
                          ? "indeterminate"
                          : false
                    }
                    data-row-action
                    disabled={disabled || loading || rowIds.length === 0}
                    onCheckedChange={(checked) =>
                      toggleAllVisibleRows(checked === true)
                    }
                  />
                </TableHead>
              ) : null}
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    tableHeaderBackgroundClassName,
                    shouldUseStickyHeader && "sticky top-0 z-30",
                    alignClass[column.align ?? "left"],
                    column.className
                  )}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      aria-label={getSortLabel(
                        column.header,
                        column.sortDirection ?? "asc"
                      )}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        sortableHeaderAlignClass[column.align ?? "left"]
                      )}
                      onClick={() =>
                        column.onSortChange?.(
                          column.sortKey ?? column.key,
                          getNextSortDirection(column.sortDirection ?? "asc")
                        )
                      }
                    >
                      <span className="text-foreground">{column.header}</span>
                      <SortIcon direction={column.sortDirection ?? "asc"} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
              {hasActions ? (
                <TableHead
                  className={cn(
                    "w-44 min-w-44 text-right",
                    tableHeaderBackgroundClassName,
                    shouldUseStickyHeader && "sticky top-0 z-30"
                  )}
                >
                  {enableColumnVisibility ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <DSButton
                          aria-label={columnVisibilityLabel}
                          className="ml-auto h-8 max-w-full px-2 text-xs text-muted-foreground hover:text-foreground"
                          disabled={disabled || loading}
                          type="button"
                          variant="ghost"
                        >
                          <Settings2 aria-hidden="true" />
                          <span className="truncate">Tùy chỉnh cột</span>
                        </DSButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Cột hiển thị</DropdownMenuLabel>
                        {hideableColumns.map((column) => (
                          <DropdownMenuCheckboxItem
                            key={column.key}
                            checked={resolvedVisibleColumnKeys.includes(
                              column.key
                            )}
                            onCheckedChange={(checked) =>
                              toggleColumnVisibility(column.key, checked === true)
                            }
                          >
                            {getColumnLabel(column)}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    "Thao tác"
                  )}
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} aria-hidden="true">
                  {Array.from({ length: columnCount }).map((__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div
                        className={cn(
                          "h-4 animate-pulse rounded-md bg-muted",
                          cellIndex === columnCount - 1
                            ? "ml-auto w-16"
                            : "w-28"
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columnCount}>
                  <DSStateError
                    id={errorId}
                    className="min-h-40 border-0 bg-transparent"
                    description={error}
                  />
                </TableCell>
              </TableRow>
            ) : data.length ? (
              data.map((row, rowIndex) => {
                const href = getRowHref?.(row, rowIndex)
                const isRowInteractive =
                  !disabled &&
                  (rowClickable || Boolean(onRowClick) || Boolean(href))
                const rowInteractionContext = { disabled, href }
                const rowAriaLabel = isRowInteractive
                  ? getRowAriaLabel?.(row, rowIndex) ??
                    (href ? "Mở chi tiết dòng" : "Kích hoạt dòng")
                  : undefined
                const rowIsSelected = selectedIdSet.has(rowIds[rowIndex])

                const handleRowClick = (
                  event: React.MouseEvent<HTMLTableRowElement>
                ) => {
                  if (!isRowInteractive || isInteractiveTarget(event.target)) {
                    return
                  }

                  onRowClick?.(row, rowInteractionContext)

                  if (href) {
                    router.push(href)
                  }
                }

                const handleRowKeyDown = (
                  event: React.KeyboardEvent<HTMLTableRowElement>
                ) => {
                  if (
                    !isRowInteractive ||
                    isInteractiveTarget(event.target) ||
                    (event.key !== "Enter" && event.key !== " ")
                  ) {
                    return
                  }

                  event.preventDefault()
                  onRowClick?.(row, rowInteractionContext)

                  if (href) {
                    router.push(href)
                  }
                }

                return (
                  <TableRow
                    key={rowIds[rowIndex]}
                    aria-disabled={disabled || undefined}
                    aria-label={rowAriaLabel}
                    className={cn(
                      "group/row",
                      isRowInteractive &&
                        "cursor-pointer hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      rowIsSelected && "bg-muted/50 hover:bg-muted/60"
                    )}
                    onClick={handleRowClick}
                    onKeyDown={handleRowKeyDown}
                    role={isRowInteractive ? "link" : undefined}
                    tabIndex={isRowInteractive ? 0 : undefined}
                  >
                    {enableRowSelection ? (
                      <TableCell className="w-11 min-w-11" data-row-action>
                        <Checkbox
                          aria-label={
                            getRowSelectionLabel?.(row, rowIndex) ??
                            "Chọn dòng"
                          }
                          className={selectionCheckboxClassName}
                          checked={selectedIdSet.has(rowIds[rowIndex])}
                          data-row-action
                          disabled={disabled}
                          onCheckedChange={(checked) =>
                            toggleRowSelection(rowIds[rowIndex], checked === true)
                          }
                        />
                      </TableCell>
                    ) : null}
                    {visibleColumns.map((column) => {
                      const value = getColumnValue(row, column.accessor)
                      const content = column.render
                        ? column.render(value, row)
                        : value
                      const leading = column.renderLeading?.(row, rowIndex)

                      return (
                        <TableCell
                          key={column.key}
                          className={cn(
                            alignClass[column.align ?? "left"],
                            column.className
                          )}
                        >
                          {leading ? (
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="flex shrink-0 items-center">
                                {leading}
                              </span>
                              <div className="min-w-0 flex-1">{content}</div>
                            </div>
                          ) : (
                            content
                          )}
                        </TableCell>
                      )
                    })}
                    {hasActions ? (
                      <TableCell
                        className="w-44 min-w-44 text-right"
                        data-row-action
                      >
                        {rowActions ? (
                          <DSTableRowActions
                            actions={rowActions(row, { disabled })}
                            disabled={disabled}
                          />
                        ) : renderActions ? (
                          disabled
                            ? disableAction(renderActions(row, { disabled }))
                            : renderActions(row, { disabled })
                        ) : null}
                      </TableCell>
                    ) : null}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columnCount}>
                  <DSStateEmpty
                    className="min-h-40 border-0 bg-transparent"
                    title={isFiltered ? noResultsTitle : emptyTitle}
                    description={isFiltered ? noResultsMessage : emptyMessage}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && paginationPlacement === "footer" ? (
        <div
          className={cn(
            "flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between",
            scrollMode === "body" && "shrink-0"
          )}
        >
          <DSRangePagination
            page={resolvedPage}
            pageSize={resolvedPageSize}
            totalItems={resolvedTotalItems}
            disabled={disabled || loading}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </div>
  )
}

export { DSDataTable }
export type {
  DSDataTableActionContext,
  DSDataTableAlign,
  DSDataTableColumn,
  DSDataTableProps,
  DSDataTableSortDirection,
  DSDataTableRowInteractionContext,
  DSTableRowAction,
}

"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSIconButtonTooltip } from "./icon-button-tooltip"

type DSPaginationProps = Omit<React.ComponentProps<typeof Pagination>, "children"> & {
  page: number
  totalPages: number
  onPageChange?: (page: number) => void
}

type DSRangePaginationProps = React.ComponentProps<"div"> & {
  page: number
  pageSize?: number
  totalItems: number
  onPageChange?: (page: number) => void
  disabled?: boolean
}

function DSPagination({
  page,
  totalPages,
  onPageChange,
  ...props
}: DSPaginationProps) {
  const pages = getVisiblePages(page, totalPages)
  const isPreviousDisabled = page <= 1
  const isNextDisabled = page >= totalPages

  const handlePageChange = (
    event: React.MouseEvent<HTMLAnchorElement>,
    nextPage: number
  ) => {
    event.preventDefault()

    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return
    }

    onPageChange?.(nextPage)
  }

  return (
    <Pagination data-slot="ds-pagination" {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-label="Trang trước"
            aria-disabled={isPreviousDisabled}
            className={cn(
              isPreviousDisabled && "pointer-events-none opacity-50"
            )}
            href={isPreviousDisabled ? undefined : "#"}
            onClick={
              isPreviousDisabled
                ? undefined
                : (event) => handlePageChange(event, page - 1)
            }
            tabIndex={isPreviousDisabled ? -1 : undefined}
          />
        </PaginationItem>
        {pages.map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === page}
                onClick={(event) => handlePageChange(event, item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext
            aria-label="Trang sau"
            aria-disabled={isNextDisabled}
            className={cn(isNextDisabled && "pointer-events-none opacity-50")}
            href={isNextDisabled ? undefined : "#"}
            onClick={
              isNextDisabled
                ? undefined
                : (event) => handlePageChange(event, page + 1)
            }
            tabIndex={isNextDisabled ? -1 : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function DSRangePagination({
  page,
  pageSize = 50,
  totalItems,
  onPageChange,
  disabled = false,
  className,
  ...props
}: DSRangePaginationProps) {
  const resolvedPageSize = Math.max(1, pageSize)
  const resolvedTotalItems = Math.max(0, totalItems)
  const totalPages = Math.max(1, Math.ceil(resolvedTotalItems / resolvedPageSize))
  const resolvedPage = Math.min(Math.max(page, 1), totalPages)
  const startItem =
    resolvedTotalItems === 0 ? 0 : (resolvedPage - 1) * resolvedPageSize + 1
  const endItem = Math.min(resolvedPage * resolvedPageSize, resolvedTotalItems)
  const isPreviousDisabled = disabled || resolvedPage <= 1
  const isNextDisabled = disabled || resolvedPage >= totalPages

  const goToPage = (nextPage: number) => {
    if (
      disabled ||
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === resolvedPage
    ) {
      return
    }

    onPageChange?.(nextPage)
  }

  return (
    <div
      data-slot="ds-range-pagination"
      className={cn(
        "flex min-w-fit items-center gap-1 text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="whitespace-nowrap" aria-live="polite">
        Hiển thị {startItem}-{endItem} trên {resolvedTotalItems}
      </span>
      <DSIconButtonTooltip label="Trang trước">
        <DSButton
          aria-label="Trang trước"
          disabled={isPreviousDisabled}
          onClick={() => goToPage(resolvedPage - 1)}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </DSButton>
      </DSIconButtonTooltip>
      <DSIconButtonTooltip label="Trang sau">
        <DSButton
          aria-label="Trang sau"
          disabled={isNextDisabled}
          onClick={() => goToPage(resolvedPage + 1)}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </DSButton>
      </DSIconButtonTooltip>
    </div>
  )
}

function getVisiblePages(page: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages] as const
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages] as const
}

export { DSPagination, DSRangePagination }
export type { DSPaginationProps, DSRangePaginationProps }

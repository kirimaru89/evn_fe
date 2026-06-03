"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type DSImportReviewSummaryProps = {
  total: number
  valid: number
  invalid: number
  blockingErrors: number
  className?: string
}

function DSImportReviewSummary({
  total,
  valid,
  invalid,
  blockingErrors,
  className,
}: DSImportReviewSummaryProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground",
        className
      )}
    >
      <span>{total} dòng</span>
      <span aria-hidden="true">·</span>
      <span>{valid} hợp lệ</span>
      <span aria-hidden="true">·</span>
      <span>{invalid} cần sửa</span>
      {blockingErrors > 0 ? (
        <>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-destructive">
            {blockingErrors} lỗi chặn
          </span>
        </>
      ) : null}
    </div>
  )
}

export { DSImportReviewSummary }
export type { DSImportReviewSummaryProps }

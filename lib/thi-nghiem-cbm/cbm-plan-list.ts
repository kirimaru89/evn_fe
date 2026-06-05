const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

const CBM_PLAN_DEFAULT_PAGE_SIZE = 50

function padDatePart(value: number) {
  return String(value).padStart(2, "0")
}

function formatApiDate(value: Date) {
  return [
    value.getFullYear(),
    padDatePart(value.getMonth() + 1),
    padDatePart(value.getDate()),
  ].join("-")
}

function parseApiDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return null
  }

  return new Date(year, month - 1, day)
}

function formatDisplayDate(value: string) {
  const date = parseApiDate(value)

  return date ? dateFormatter.format(date) : value
}

function formatDisplayDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return dateTimeFormatter.format(date).replace(",", "")
}

function getCurrentMonthDateRange(referenceDate = new Date()) {
  const year = referenceDate.getFullYear()
  const month = referenceDate.getMonth()
  const from = new Date(year, month, 1)
  const to = new Date(year, month + 1, 0)

  return {
    from: formatApiDate(from),
    to: formatApiDate(to),
  }
}

function getBaseOnePaginationRange({
  page,
  pageSize,
  total,
}: {
  page: number
  pageSize: number
  total: number
}) {
  if (total <= 0) {
    return { from: 0, to: 0 }
  }

  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const totalPages = Math.max(1, Math.ceil(total / safePageSize))
  const resolvedPage = Math.min(safePage, totalPages)
  const from = (resolvedPage - 1) * safePageSize + 1
  const to = Math.min(total, from + safePageSize - 1)

  return { from, to }
}

function formatPaginationRange({
  page,
  pageSize,
  total,
}: {
  page: number
  pageSize: number
  total: number
}) {
  const { from, to } = getBaseOnePaginationRange({ page, pageSize, total })

  if (total <= 0) {
    return "Hiển thị 0 trên 0"
  }

  return `Hiển thị ${from}-${to} trên ${total}`
}

import type { DSStatus } from "@/components/ds"
import type { CbmPlanSource, CbmPlanStatus } from "@/types/thi-nghiem-cbm/cbm-plan"

type CbmPlanStatusConfig = {
  label: string
  tone: DSStatus
}

const CBM_PLAN_STATUS_CONFIG: Record<CbmPlanStatus, CbmPlanStatusConfig> = {
  draft: { label: "Nháp", tone: "neutral" },
  pendingDirectorApproval: { label: "Chờ GĐXN duyệt", tone: "pending" },
  approved: { label: "Đã duyệt", tone: "success" },
  rejected: { label: "Từ chối", tone: "warning" },
  transferredToExecution: { label: "Đã chuyển sang thực hiện", tone: "active" },
}

const CBM_PLAN_SOURCE_LABELS: Record<CbmPlanSource, string> = {
  manual: "Tạo mới",
  importExcel: "Import Excel",
  pmisSync: "Đồng bộ PMIS",
}

function getCbmPlanStatusConfig(status: CbmPlanStatus): CbmPlanStatusConfig {
  return CBM_PLAN_STATUS_CONFIG[status]
}

export {
  CBM_PLAN_DEFAULT_PAGE_SIZE,
  CBM_PLAN_SOURCE_LABELS,
  CBM_PLAN_STATUS_CONFIG,
  formatApiDate,
  formatDisplayDate,
  formatDisplayDateTime,
  formatPaginationRange,
  getBaseOnePaginationRange,
  getCbmPlanStatusConfig,
  getCurrentMonthDateRange,
  parseApiDate,
}
export type { CbmPlanStatusConfig }

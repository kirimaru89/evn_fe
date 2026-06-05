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

export {
  CBM_PLAN_DEFAULT_PAGE_SIZE,
  formatApiDate,
  formatDisplayDate,
  formatDisplayDateTime,
  formatPaginationRange,
  getBaseOnePaginationRange,
  getCurrentMonthDateRange,
  parseApiDate,
}

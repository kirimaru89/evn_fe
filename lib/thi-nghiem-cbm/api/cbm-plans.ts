import {
  CBM_PLAN_EMPTY_RESPONSE_KEYWORD,
  CBM_PLAN_LIST_PAGE_SIZE,
  CBM_PLAN_MUTATION_FAILURE_ID,
  CBM_PLAN_TIMEOUT_KEYWORD,
  cbmPlanLocationOptions,
  cbmPlanManagingUnitOptions,
  cbmPlanRecords,
} from "@/mock-data/thi-nghiem-cbm/cbm-plans"
import type {
  BulkDeleteCbmPlansInput,
  CbmPlanFilterOptionsResponse,
  CbmPlanListItem,
  CbmPlanListQuery,
  CbmPlanListResponse,
  CbmPlanMutationResult,
  DeleteCbmPlanInput,
  ExportCbmPlansInput,
  ExportCbmPlansResult,
  TransferCbmPlanToExecutionInput,
} from "@/types/thi-nghiem-cbm/cbm-plan"
import { formatPaginationRange } from "@/lib/thi-nghiem-cbm/cbm-plan-list"

const MOCK_API_DELAY_MS = 250

let records = [...cbmPlanRecords]

class CbmPlanApiError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "invalid-date-filter"
      | "invalid-status"
      | "not-found"
      | "system-error"
      | "timeout"
  ) {
    super(message)
    this.name = "CbmPlanApiError"
  }
}

function waitForMockApi(delay = MOCK_API_DELAY_MS) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, delay)
  })
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function isActiveFilterValue(value?: string) {
  return Boolean(value && value !== "all")
}

function getOptionName(
  options: readonly { id: string; name: string }[],
  id?: string
) {
  return options.find((option) => option.id === id)?.name
}

function validateDateRange(query: CbmPlanListQuery) {
  if (
    query.executionDateFrom &&
    query.executionDateTo &&
    query.executionDateFrom > query.executionDateTo
  ) {
    throw new CbmPlanApiError(
      "Khoảng ngày thực hiện không hợp lệ.",
      "invalid-date-filter"
    )
  }
}

function filterRecords(query: CbmPlanListQuery) {
  validateDateRange(query)

  const keyword = normalizeText(query.keyword ?? "")
  const unitName = getOptionName(cbmPlanManagingUnitOptions, query.managingUnitId)
  const locationName = getOptionName(cbmPlanLocationOptions, query.locationId)

  return records.filter((record) => {
    const matchesKeyword =
      !keyword ||
      [
        record.deviceCode,
        record.deviceName,
        record.serialNumber,
        record.locationName,
        record.managingUnitName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword)

    const matchesStatus =
      !isActiveFilterValue(query.status) || record.status === query.status
    const matchesUnit = !unitName || record.managingUnitName === unitName
    const matchesLocation = !locationName || record.locationName === locationName
    const matchesDateFrom =
      !query.executionDateFrom ||
      record.executionDate >= query.executionDateFrom
    const matchesDateTo =
      !query.executionDateTo || record.executionDate <= query.executionDateTo

    return (
      matchesKeyword &&
      matchesStatus &&
      matchesUnit &&
      matchesLocation &&
      matchesDateFrom &&
      matchesDateTo
    )
  })
}

function getNowInVietnamOffset() {
  const date = new Date()
  const local = new Date(date.getTime() + 7 * 60 * 60 * 1000)

  return `${local.toISOString().slice(0, 19)}+07:00`
}

async function getCbmPlanFilterOptions(): Promise<CbmPlanFilterOptionsResponse> {
  await waitForMockApi()

  return {
    managingUnits: [...cbmPlanManagingUnitOptions],
    locations: [...cbmPlanLocationOptions],
  }
}

async function listCbmPlans(
  query: CbmPlanListQuery = {}
): Promise<CbmPlanListResponse> {
  if (query.keyword === CBM_PLAN_TIMEOUT_KEYWORD) {
    await waitForMockApi(1_000)
    throw new CbmPlanApiError("Truy vấn danh sách bị quá thời gian.", "timeout")
  }

  if (query.keyword === CBM_PLAN_EMPTY_RESPONSE_KEYWORD) {
    await waitForMockApi()
    return {
      items: [],
      total: 0,
      page: query.page ?? 1,
      pageSize: query.pageSize ?? CBM_PLAN_LIST_PAGE_SIZE,
      currentRange: "Hiển thị 0 trên 0",
    }
  }

  await waitForMockApi()

  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.max(1, query.pageSize ?? CBM_PLAN_LIST_PAGE_SIZE)
  const filtered = filterRecords(query)
  const total = filtered.length
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize)

  return {
    items,
    total,
    page,
    pageSize,
    currentRange: formatPaginationRange({ page, pageSize, total }),
  }
}

async function deleteCbmPlan({
  planId,
}: DeleteCbmPlanInput): Promise<CbmPlanMutationResult> {
  await waitForMockApi()

  const target = records.find((record) => record.id === planId)

  if (!target) {
    throw new CbmPlanApiError("Không tìm thấy kế hoạch CBM.", "not-found")
  }

  if (target.id === CBM_PLAN_MUTATION_FAILURE_ID) {
    throw new CbmPlanApiError("Xóa kế hoạch CBM thất bại.", "system-error")
  }

  if (target.status !== "draft") {
    throw new CbmPlanApiError(
      "Chỉ kế hoạch trạng thái Nháp được xóa.",
      "invalid-status"
    )
  }

  records = records.filter((record) => record.id !== planId)

  return {
    success: true,
    message: "Đã xóa kế hoạch CBM.",
  }
}

async function bulkDeleteCbmPlans({
  planIds,
}: BulkDeleteCbmPlansInput): Promise<CbmPlanMutationResult> {
  await waitForMockApi()

  const selectedRecords = records.filter((record) => planIds.includes(record.id))

  if (selectedRecords.length !== planIds.length) {
    throw new CbmPlanApiError("Có kế hoạch CBM không tồn tại.", "not-found")
  }

  if (selectedRecords.some((record) => record.id === CBM_PLAN_MUTATION_FAILURE_ID)) {
    throw new CbmPlanApiError("Xóa nhiều kế hoạch CBM thất bại.", "system-error")
  }

  if (selectedRecords.some((record) => record.status !== "draft")) {
    throw new CbmPlanApiError(
      "Chỉ các kế hoạch trạng thái Nháp được xóa.",
      "invalid-status"
    )
  }

  records = records.filter((record) => !planIds.includes(record.id))

  return {
    success: true,
    message: "Đã xóa các kế hoạch CBM được chọn.",
  }
}

async function transferCbmPlanToExecution({
  planId,
}: TransferCbmPlanToExecutionInput): Promise<CbmPlanMutationResult> {
  await waitForMockApi()

  const target = records.find((record) => record.id === planId)

  if (!target) {
    throw new CbmPlanApiError("Không tìm thấy kế hoạch CBM.", "not-found")
  }

  if (target.status !== "approved") {
    throw new CbmPlanApiError(
      "Chỉ kế hoạch trạng thái Đã duyệt được chuyển sang thực hiện.",
      "invalid-status"
    )
  }

  records = records.map((record): CbmPlanListItem => {
    if (record.id !== planId) {
      return record
    }

    return {
      ...record,
      status: "transferredToExecution",
      updatedAt: getNowInVietnamOffset(),
      availableActions: ["viewDetail"],
    }
  })

  return {
    success: true,
    message: "Đã chuyển kế hoạch sang thực hiện CBM.",
  }
}

async function exportCbmPlans({
  filters,
  visibleColumns,
}: ExportCbmPlansInput): Promise<ExportCbmPlansResult> {
  await waitForMockApi()
  const filtered = filterRecords(filters)

  return {
    success: true,
    fileName: `ke-hoach-cbm-${filtered.length}-ban-ghi-${visibleColumns.length}-cot.xlsx`,
    message: "Đã chuẩn bị export danh sách kế hoạch CBM.",
  }
}

function resetCbmPlanMockData() {
  records = [...cbmPlanRecords]
}

export {
  CbmPlanApiError,
  bulkDeleteCbmPlans,
  deleteCbmPlan,
  exportCbmPlans,
  getCbmPlanFilterOptions,
  listCbmPlans,
  resetCbmPlanMockData,
  transferCbmPlanToExecution,
}

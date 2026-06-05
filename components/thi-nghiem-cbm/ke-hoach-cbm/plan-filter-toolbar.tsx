"use client"

import {
  DSDateRangeFilter,
  DSFilterBar,
  type DSDateRangeFilterRange,
} from "@/components/ds"
import {
  formatApiDate,
  parseApiDate,
} from "@/lib/thi-nghiem-cbm/cbm-plan-list"
import type {
  CbmPlanFilterOption,
  CbmPlanStatus,
} from "@/types/thi-nghiem-cbm/cbm-plan"

const STATUS_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "Nháp", value: "draft" },
  { label: "Chờ GĐXN duyệt", value: "pendingDirectorApproval" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Từ chối", value: "rejected" },
  { label: "Đã chuyển sang thực hiện", value: "transferredToExecution" },
]

type PlanFilterToolbarProps = {
  keyword?: string
  executionDateFrom?: string
  executionDateTo?: string
  datePreset: string
  status?: CbmPlanStatus | "all"
  managingUnitId?: string
  locationId?: string
  managingUnits: CbmPlanFilterOption[]
  locations: CbmPlanFilterOption[]
  isLoading?: boolean
  dateRangeError?: string
  onKeywordChange: (value: string) => void
  onDatePresetChange: (preset: string) => void
  onDateRangeChange: (from: string | undefined, to: string | undefined) => void
  onStatusChange: (value: string) => void
  onUnitChange: (value: string) => void
  onLocationChange: (value: string) => void
  onReset: () => void
}

function toFilterRange(
  from?: string,
  to?: string
): DSDateRangeFilterRange {
  return {
    from: from ? (parseApiDate(from) ?? undefined) : undefined,
    to: to ? (parseApiDate(to) ?? undefined) : undefined,
  }
}

function PlanFilterToolbar({
  keyword = "",
  executionDateFrom,
  executionDateTo,
  datePreset,
  status = "all",
  managingUnitId = "",
  locationId = "",
  managingUnits,
  locations,
  isLoading,
  dateRangeError,
  onKeywordChange,
  onDatePresetChange,
  onDateRangeChange,
  onStatusChange,
  onUnitChange,
  onLocationChange,
  onReset,
}: PlanFilterToolbarProps) {
  const customRange = toFilterRange(executionDateFrom, executionDateTo)

  const handleCustomRangeChange = (range: DSDateRangeFilterRange) => {
    const from = range.from ? formatApiDate(range.from) : undefined
    const to = range.to ? formatApiDate(range.to) : undefined
    onDateRangeChange(from, to)
  }

  const unitOptions = [
    { label: "Tất cả đơn vị", value: "all" },
    ...managingUnits.map((u) => ({ label: u.name, value: u.id })),
  ]

  const locationOptions = [
    { label: "Tất cả vị trí", value: "all" },
    ...locations.map((l) => ({ label: l.name, value: l.id })),
  ]

  return (
    <div className="flex flex-col gap-1.5">
      <DSFilterBar
        searchValue={keyword}
        onSearchChange={onKeywordChange}
        searchPlaceholder="Tìm mã thiết bị / tên thiết bị / số seri..."
        searchLabel="Tìm kiếm kế hoạch CBM"
        clearLabel="Đặt lại"
        onClear={onReset}
        loading={isLoading}
        primaryFilters={
          <DSDateRangeFilter
            label="Ngày thực hiện"
            value={datePreset}
            onValueChange={onDatePresetChange}
            customRange={customRange}
            onCustomRangeChange={handleCustomRangeChange}
          />
        }
        filters={[
          {
            label: "Trạng thái",
            placeholder: "Trạng thái: Tất cả",
            value: status,
            onValueChange: onStatusChange,
            options: STATUS_OPTIONS,
          },
          {
            label: "Đơn vị quản lý",
            placeholder: "Đơn vị: Tất cả",
            value: managingUnitId || "all",
            onValueChange: (v) => onUnitChange(v === "all" ? "" : v),
            options: unitOptions,
          },
          {
            label: "Vị trí",
            placeholder: "Vị trí: Tất cả",
            value: locationId || "all",
            onValueChange: (v) => onLocationChange(v === "all" ? "" : v),
            options: locationOptions,
          },
        ]}
      />
      {dateRangeError ? (
        <p className="px-1 text-xs text-destructive" role="alert">
          {dateRangeError}
        </p>
      ) : null}
    </div>
  )
}

export { PlanFilterToolbar }
export type { PlanFilterToolbarProps }

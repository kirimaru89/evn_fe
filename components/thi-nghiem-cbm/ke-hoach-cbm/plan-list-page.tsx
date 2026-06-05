"use client"

import * as React from "react"
import { Download, FileUp, Plus, Trash } from "lucide-react"

import {
  DSAppShell,
  DSBulkActionBar,
  DSButton,
  DSConfirmDialog,
  DSListPageCard,
  DSPage,
  DSPageBody,
  DSRangePagination,
  toastError,
  toastSuccess,
  type DSBulkAction,
} from "@/components/ds"
import { useCbmPlanList } from "@/hooks/thi-nghiem-cbm/use-cbm-plan-list"
import {
  formatApiDate,
} from "@/lib/thi-nghiem-cbm/cbm-plan-list"
import { PlanFilterToolbar } from "./plan-filter-toolbar"
import { PlanTable } from "./plan-table"

function presetToDateRange(
  preset: string
): { from: string; to: string } | null {
  const today = new Date()
  const year = today.getFullYear()

  switch (preset) {
    case "today": {
      const d = formatApiDate(today)
      return { from: d, to: d }
    }
    case "last-7-days": {
      const from = new Date(today)
      from.setDate(today.getDate() - 6)
      return { from: formatApiDate(from), to: formatApiDate(today) }
    }
    case "last-30-days": {
      const from = new Date(today)
      from.setDate(today.getDate() - 29)
      return { from: formatApiDate(from), to: formatApiDate(today) }
    }
    case "this-year":
      return {
        from: formatApiDate(new Date(year, 0, 1)),
        to: formatApiDate(new Date(year, 11, 31)),
      }
    case "last-year":
      return {
        from: formatApiDate(new Date(year - 1, 0, 1)),
        to: formatApiDate(new Date(year - 1, 11, 31)),
      }
    default:
      return null
  }
}

function PlanListPage() {
  const {
    bulkDeleteIntent,
    canBulkDelete,
    clearBulkDeleteIntent,
    clearDeleteTarget,
    clearMutationResult,
    clearTransferTarget,
    deleteTarget,
    executeBulkDelete,
    executeDelete,
    executeExport,
    executeTransfer,
    filterOptions,
    hasActiveFilters,
    isFilterOptionsLoading,
    isListLoading,
    items,
    listError,
    mutation,
    pagination,
    query,
    resetFilters,
    selectedRowIds,
    selectedRows,
    setBulkDeleteIntent,
    setDeleteTarget,
    setPage,
    setSelectedRowIds,
    setTransferTarget,
    setVisibleColumns,
    transferTarget,
    updateQuery,
    validationErrors,
    visibleColumns,
  } = useCbmPlanList()

  const [datePreset, setDatePreset] = React.useState("custom")

  const prevMutationSuccessRef = React.useRef(false)

  React.useEffect(() => {
    const isSuccess =
      !mutation.isMutating && mutation.lastResult?.success === true

    if (isSuccess && !prevMutationSuccessRef.current) {
      if (mutation.kind === "delete") {
        toastSuccess("Xóa kế hoạch thành công", "Kế hoạch đã được xóa.")
      } else if (mutation.kind === "bulkDelete") {
        toastSuccess(
          "Xóa nhiều kế hoạch thành công",
          "Các kế hoạch đã được xóa."
        )
      } else if (mutation.kind === "transfer") {
        toastSuccess(
          "Chuyển kế hoạch thành công",
          "Kế hoạch đã được chuyển sang thực hiện CBM."
        )
      } else if (mutation.kind === "export") {
        toastSuccess("Export thành công", "Danh sách kế hoạch đã được export.")
      }
    }

    prevMutationSuccessRef.current = isSuccess
  }, [mutation.isMutating, mutation.kind, mutation.lastResult])

  React.useEffect(() => {
    if (mutation.error) {
      toastError(
        "Thao tác thất bại",
        mutation.error.message || "Không thể thực hiện thao tác. Vui lòng thử lại."
      )
      clearMutationResult()
    }
  }, [mutation.error, clearMutationResult])

  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset)
    if (preset !== "custom") {
      const range = presetToDateRange(preset)
      if (range) {
        void updateQuery({
          executionDateFrom: range.from,
          executionDateTo: range.to,
        })
      }
    }
  }

  const handleDateRangeChange = (
    from: string | undefined,
    to: string | undefined
  ) => {
    setDatePreset("custom")
    void updateQuery({
      executionDateFrom: from,
      executionDateTo: to,
    })
  }

  const handleStatusChange = (value: string) => {
    void updateQuery({ status: value as typeof query.status })
  }

  const handleUnitChange = (value: string) => {
    void updateQuery({ managingUnitId: value || undefined })
  }

  const handleLocationChange = (value: string) => {
    void updateQuery({ locationId: value || undefined })
  }

  const handleKeywordChange = (value: string) => {
    void updateQuery({ keyword: value || undefined })
  }

  const handleExport = () => {
    void executeExport()
  }

  const bulkActions: readonly DSBulkAction[] = [
    {
      key: "bulkDelete",
      label: "Xóa nhiều kế hoạch",
      icon: <Trash />,
      variant: "destructive",
      disabled: !canBulkDelete,
      onClick: () => setBulkDeleteIntent(true),
    },
  ]

  const tableError = listError
    ? listError.message || "Không thể tải danh sách kế hoạch."
    : undefined

  return (
    <DSAppShell
      breadcrumbs={[
        { label: "MSM Portal" },
        { label: "Thí nghiệm CBM" },
        { label: "Theo dõi kế hoạch CBM" },
      ]}
      headerSticky
      pageTitle="Theo dõi kế hoạch CBM"
    >
      <DSPage className="h-full bg-transparent">
        <DSPageBody className="h-full min-h-0" width="full">
          <DSListPageCard
            scrollMode="table"
            title="Theo dõi kế hoạch CBM"
            description="Theo dõi, tìm kiếm và xử lý workflow kế hoạch CBM"
            showDescription
            actions={
              <>
                <DSRangePagination
                  page={pagination.page}
                  pageSize={pagination.pageSize}
                  totalItems={pagination.total}
                  disabled={isListLoading}
                  onPageChange={(p) => void setPage(p)}
                />
                <DSButton
                  leftIcon={<Download />}
                  onClick={handleExport}
                  variant="outline"
                  disabled={isListLoading || mutation.isMutating}
                  loading={mutation.isMutating && mutation.kind === "export"}
                >
                  Export
                </DSButton>
                <DSButton
                  leftIcon={<FileUp />}
                  variant="outline"
                  disabled
                >
                  Import
                </DSButton>
                <DSButton variant="outline" disabled>
                  PMIS
                </DSButton>
                <DSButton leftIcon={<Plus />} disabled>
                  Tạo mới
                </DSButton>
              </>
            }
            toolbar={
              selectedRowIds.length > 0 ? (
                <DSBulkActionBar
                  actions={bulkActions}
                  onClearSelection={() => setSelectedRowIds([])}
                  selectedCount={selectedRowIds.length}
                />
              ) : (
                <PlanFilterToolbar
                  keyword={query.keyword}
                  executionDateFrom={query.executionDateFrom}
                  executionDateTo={query.executionDateTo}
                  datePreset={datePreset}
                  status={query.status}
                  managingUnitId={query.managingUnitId}
                  locationId={query.locationId}
                  managingUnits={filterOptions.managingUnits}
                  locations={filterOptions.locations}
                  isLoading={isFilterOptionsLoading}
                  dateRangeError={validationErrors.executionDateRange}
                  onKeywordChange={handleKeywordChange}
                  onDatePresetChange={handleDatePresetChange}
                  onDateRangeChange={handleDateRangeChange}
                  onStatusChange={handleStatusChange}
                  onUnitChange={handleUnitChange}
                  onLocationChange={handleLocationChange}
                  onReset={() => {
                    setDatePreset("custom")
                    void resetFilters()
                  }}
                />
              )
            }
          >
            <PlanTable
              items={items}
              total={pagination.total}
              page={pagination.page}
              pageSize={pagination.pageSize}
              isLoading={isListLoading}
              error={tableError}
              isFiltered={hasActiveFilters}
              selectedRowIds={selectedRowIds}
              visibleColumnKeys={visibleColumns}
              onSelectedRowIdsChange={setSelectedRowIds}
              onPageChange={(p) => void setPage(p)}
              onVisibleColumnKeysChange={setVisibleColumns}
              onViewDetail={() => {}}
              onEdit={() => {}}
              onDelete={(plan) => setDeleteTarget(plan)}
              onTransfer={(plan) => setTransferTarget(plan)}
            />
          </DSListPageCard>
        </DSPageBody>
      </DSPage>

      <DSConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) clearDeleteTarget()
        }}
        title="Xóa kế hoạch?"
        description={
          deleteTarget
            ? `Kế hoạch của thiết bị ${deleteTarget.deviceCode} sẽ bị xóa và không thể phục hồi.`
            : undefined
        }
        confirmLabel="Xóa kế hoạch"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={() => void executeDelete()}
        loading={mutation.isMutating && mutation.kind === "delete"}
      />

      <DSConfirmDialog
        open={bulkDeleteIntent}
        onOpenChange={(open) => {
          if (!open) clearBulkDeleteIntent()
        }}
        title={`Xóa ${selectedRows.length} kế hoạch?`}
        description="Các kế hoạch đã chọn sẽ bị xóa và không thể phục hồi."
        confirmLabel="Xóa các kế hoạch"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={() => void executeBulkDelete()}
        loading={mutation.isMutating && mutation.kind === "bulkDelete"}
      />

      <DSConfirmDialog
        open={Boolean(transferTarget)}
        onOpenChange={(open) => {
          if (!open) clearTransferTarget()
        }}
        title="Chuyển sang thực hiện CBM?"
        description={
          transferTarget
            ? `Kế hoạch của thiết bị ${transferTarget.deviceCode} sẽ được chuyển sang thực hiện CBM.`
            : undefined
        }
        confirmLabel="Chuyển sang thực hiện"
        cancelLabel="Hủy"
        onConfirm={() => void executeTransfer()}
        loading={mutation.isMutating && mutation.kind === "transfer"}
      />
    </DSAppShell>
  )
}

export { PlanListPage }

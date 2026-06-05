"use client"

import * as React from "react"
import {
  ArrowRightLeft,
  Eye,
  Pencil,
  Trash,
} from "lucide-react"

import {
  DSDataTable,
  DSStatusBadge,
  type DSDataTableColumn,
  type DSTableRowAction,
} from "@/components/ds"
import {
  CBM_PLAN_SOURCE_LABELS,
  formatDisplayDate,
  formatDisplayDateTime,
  getCbmPlanStatusConfig,
} from "@/lib/thi-nghiem-cbm/cbm-plan-list"
import type {
  CbmPlanAvailableAction,
  CbmPlanListItem,
} from "@/types/thi-nghiem-cbm/cbm-plan"

type PlanTableProps = {
  items: CbmPlanListItem[]
  total: number
  page: number
  pageSize: number
  isLoading?: boolean
  error?: string
  isFiltered?: boolean
  selectedRowIds: string[]
  visibleColumnKeys: string[]
  onSelectedRowIdsChange: (ids: string[]) => void
  onPageChange: (page: number) => void
  onVisibleColumnKeysChange: (keys: string[]) => void
  onViewDetail: (plan: CbmPlanListItem) => void
  onEdit: (plan: CbmPlanListItem) => void
  onDelete: (plan: CbmPlanListItem) => void
  onTransfer: (plan: CbmPlanListItem) => void
}

function buildRowActions(
  row: CbmPlanListItem,
  {
    onViewDetail,
    onEdit,
    onDelete,
    onTransfer,
  }: Pick<
    PlanTableProps,
    "onViewDetail" | "onEdit" | "onDelete" | "onTransfer"
  >
): readonly DSTableRowAction[] {
  const actionMap: Record<CbmPlanAvailableAction, DSTableRowAction> = {
    viewDetail: {
      key: "viewDetail",
      label: "Xem chi tiết",
      icon: <Eye />,
      onClick: () => onViewDetail(row),
      quick: true,
    },
    edit: {
      key: "edit",
      label: "Chỉnh sửa",
      icon: <Pencil />,
      onClick: () => onEdit(row),
      quick: true,
    },
    delete: {
      key: "delete",
      label: "Xóa",
      icon: <Trash />,
      onClick: () => onDelete(row),
      variant: "destructive",
    },
    transferToExecution: {
      key: "transferToExecution",
      label: "Chuyển sang thực hiện CBM",
      icon: <ArrowRightLeft />,
      onClick: () => onTransfer(row),
    },
  }

  return row.availableActions
    .map((action) => actionMap[action])
    .filter(Boolean)
}

function PlanTable({
  items,
  total,
  page,
  pageSize,
  isLoading,
  error,
  isFiltered,
  selectedRowIds,
  visibleColumnKeys,
  onSelectedRowIdsChange,
  onPageChange,
  onVisibleColumnKeysChange,
  onViewDetail,
  onEdit,
  onDelete,
  onTransfer,
}: PlanTableProps) {
  const columns = React.useMemo<readonly DSDataTableColumn<CbmPlanListItem>[]>(
    () => [
      {
        key: "deviceCode",
        header: "Mã thiết bị",
        accessor: "deviceCode",
        render: (_value, row) => (
          <button
            type="button"
            className="font-medium text-primary underline-offset-4 hover:underline"
            onClick={() => onViewDetail(row)}
          >
            {row.deviceCode}
          </button>
        ),
      },
      {
        key: "deviceName",
        header: "Tên thiết bị",
        accessor: "deviceName",
      },
      {
        key: "locationName",
        header: "Vị trí",
        accessor: "locationName",
        hideable: true,
      },
      {
        key: "managingUnitName",
        header: "Đơn vị quản lý",
        accessor: "managingUnitName",
        hideable: true,
      },
      {
        key: "executionDate",
        header: "Ngày thực hiện",
        accessor: (row) => formatDisplayDate(row.executionDate),
        hideable: true,
      },
      {
        key: "status",
        header: "Trạng thái",
        accessor: "status",
        render: (_value, row) => {
          const config = getCbmPlanStatusConfig(row.status)

          return (
            <DSStatusBadge status={config.tone}>
              {config.label}
            </DSStatusBadge>
          )
        },
        hideable: true,
      },
      {
        key: "source",
        header: "Nguồn tạo",
        accessor: (row) => CBM_PLAN_SOURCE_LABELS[row.source],
        hideable: true,
      },
      {
        key: "updatedAt",
        header: "Cập nhật",
        accessor: (row) => formatDisplayDateTime(row.updatedAt),
        hideable: true,
      },
    ],
    [onViewDetail]
  )

  return (
    <DSDataTable
      columns={columns}
      data={items}
      enableColumnVisibility
      enableRowSelection
      emptyTitle="Chưa có kế hoạch CBM"
      emptyMessage="Tạo mới hoặc import kế hoạch CBM để bắt đầu theo dõi."
      error={error}
      getRowId={(row) => row.id}
      getRowAriaLabel={(row) => `Xem chi tiết kế hoạch ${row.deviceCode}`}
      getRowSelectionLabel={(row) => `Chọn kế hoạch ${row.deviceCode}`}
      isFiltered={isFiltered}
      loading={isLoading}
      loadingMessage="Đang tải danh sách kế hoạch CBM..."
      noResultsTitle="Không tìm thấy kế hoạch"
      noResultsMessage="Hãy điều chỉnh từ khóa hoặc bộ lọc."
      onPageChange={onPageChange}
      onSelectedRowIdsChange={onSelectedRowIdsChange}
      onVisibleColumnKeysChange={onVisibleColumnKeysChange}
      page={page}
      pageSize={pageSize}
      pagination
      paginationPlacement="footer"
      rowActions={(row) =>
        buildRowActions(row, { onViewDetail, onEdit, onDelete, onTransfer })
      }
      scrollMode="body"
      selectedRowIds={selectedRowIds}
      stickyHeader
      totalItems={total}
      visibleColumnKeys={visibleColumnKeys}
    />
  )
}

export { PlanTable }
export type { PlanTableProps }

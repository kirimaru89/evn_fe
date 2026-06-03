"use client"

import { useMemo, useState } from "react"
import { Download, Eye, Lock, Pencil, Trash, Unlock } from "lucide-react"

import {
  DSBadge,
  DSBulkActionBar,
  DSButton,
  DSDataTable,
  DSDateRangeFilter,
  DSFilterBar,
  DSImportFileDialog,
  DSKpiCard,
  DSListPageCard,
  DSRangePagination,
  DSSection,
  DSStatusBadge,
  toastInfo,
  toastSuccess,
  type DSBulkAction,
  type DSDateRangeFilterRange,
  type DSTableRowAction,
} from "@/components/ds"
import { patternKpis, patternRows } from "../_data/demo-data"
import { patternColumns } from "../_data/table-config"

const CONTROLS_PAGE_SIZE = 50

export function EnterprisePatternsSection() {
  const [controlSearch, setControlSearch] = useState("")
  const [controlStatus, setControlStatus] = useState("all")
  const [controlCategory, setControlCategory] = useState("all")
  const [modifiedFilter, setModifiedFilter] = useState("this-year")
  const [modifiedRange, setModifiedRange] =
    useState<DSDateRangeFilterRange>({})
  const [controlPage, setControlPage] = useState(1)
  const [selectedControlIds, setSelectedControlIds] = useState<string[]>([])
  const [importOpen, setImportOpen] = useState(false)

  const filteredPatternRows = useMemo(() => {
    const query = controlSearch.trim().toLowerCase()

    return patternRows.filter((row) => {
      const matchesSearch =
        !query ||
        [
          row.id,
          row.title,
          row.description,
          row.owner,
          row.category,
          row.meta,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)

      const matchesStatus =
        controlStatus === "all" || row.status === controlStatus
      const matchesCategory =
        controlCategory === "all" || row.category === controlCategory

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [controlCategory, controlSearch, controlStatus])

  const clearControlFilters = () => {
    setControlSearch("")
    setControlStatus("all")
    setControlCategory("all")
    setModifiedFilter("this-year")
    setModifiedRange({})
    setControlPage(1)
  }

  const updateControlSearch = (value: string) => {
    setControlSearch(value)
    setControlPage(1)
  }

  const updateControlStatus = (value: string) => {
    setControlStatus(value)
    setControlPage(1)
  }

  const updateControlCategory = (value: string) => {
    setControlCategory(value)
    setControlPage(1)
  }

  const updateModifiedFilter = (value: string) => {
    setModifiedFilter(value)
    setControlPage(1)
  }

  const paginatedPatternRows = useMemo(() => {
    const start = (controlPage - 1) * CONTROLS_PAGE_SIZE

    return filteredPatternRows.slice(start, start + CONTROLS_PAGE_SIZE)
  }, [controlPage, filteredPatternRows])

  const getPatternRowActions = (row: (typeof patternRows)[number]): readonly DSTableRowAction[] => [
    {
      key: "view",
      label: "Xem",
      icon: <Eye />,
      href: `#${row.id}`,
      quick: true,
    },
    {
      key: "edit",
      label: "Chỉnh sửa",
      icon: <Pencil />,
      onClick: () => toastInfo("Mở chỉnh sửa kiểm soát", row.title),
      quick: true,
    },
    {
      key: "download",
      label: "Tải về",
      icon: <Download />,
      onClick: () => toastInfo("Đang tải dữ liệu kiểm soát", row.title),
      quick: true,
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <Trash />,
      onClick: () => toastInfo("Yêu cầu xác nhận xóa", row.title),
      variant: "destructive",
    },
  ]
  const selectedControlCount = selectedControlIds.length
  const bulkControlActions: readonly DSBulkAction[] = [
    {
      key: "download",
      label: "Tải về",
      icon: <Download />,
      onClick: () =>
        toastInfo(
          "Đang tải dữ liệu kiểm soát",
          `${selectedControlCount} kiểm soát đã chọn.`
        ),
      quick: true,
      disabled: selectedControlCount === 0,
    },
    {
      key: "disable",
      label: "Vô hiệu hóa",
      icon: <Lock />,
      onClick: () =>
        toastInfo(
          "Đã gửi yêu cầu vô hiệu hóa",
          `${selectedControlCount} kiểm soát đã chọn.`
        ),
      quick: true,
      disabled: selectedControlCount === 0,
    },
    {
      key: "enable",
      label: "Kích hoạt",
      icon: <Unlock />,
      onClick: () =>
        toastInfo(
          "Đã gửi yêu cầu kích hoạt",
          `${selectedControlCount} kiểm soát đã chọn.`
        ),
      quick: true,
      disabled: selectedControlCount === 0,
    },
    {
      key: "delete",
      label: "Xóa",
      icon: <Trash />,
      onClick: () =>
        toastInfo("Yêu cầu xác nhận xóa", `${selectedControlCount} kiểm soát đã chọn.`),
      variant: "destructive",
      disabled: selectedControlCount === 0,
    },
  ]

  return (
    <DSSection>
      <div className="flex flex-col gap-2">
        <DSBadge className="w-fit" variant="outline">
          Pattern nghiệp vụ
        </DSBadge>
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-medium">
            Pattern quản trị tái sử dụng
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Các wrapper cấp pattern cho luồng nghiệp vụ phổ biến, được ghép từ
            preset shadcn hiện có mà không đổi token giao diện.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {patternKpis.map((kpi) => (
          <DSKpiCard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            description={kpi.description}
            trend={kpi.trend}
            tone={kpi.tone}
          />
        ))}
      </div>

      <DSListPageCard
        className="h-[720px]"
        scrollMode="table"
        title="Kiểm soát vận hành"
        actions={
          <>
            <DSRangePagination
              page={controlPage}
              pageSize={CONTROLS_PAGE_SIZE}
              totalItems={filteredPatternRows.length}
              onPageChange={setControlPage}
            />
            <DSButton onClick={() => setImportOpen(true)} variant="outline">
              Import kiểm soát
            </DSButton>
            <DSButton>Tạo kiểm soát</DSButton>
          </>
        }
        toolbar={
          selectedControlCount > 0 ? (
            <DSBulkActionBar
              actions={bulkControlActions}
              onClearSelection={() => setSelectedControlIds([])}
              selectedCount={selectedControlCount}
            />
          ) : (
            <DSFilterBar
              clearLabel="Đặt lại"
              filters={[
                {
                  label: "Trạng thái",
                  placeholder: "Trạng thái: Tất cả",
                  value: controlStatus,
                  onValueChange: updateControlStatus,
                  options: [
                    { label: "Tất cả", value: "all" },
                    { label: "Đang hoạt động", value: "active" },
                    { label: "Đang chờ", value: "pending" },
                    { label: "Cảnh báo", value: "warning" },
                    { label: "Hoàn tất", value: "success" },
                  ],
                },
                {
                  label: "Danh mục",
                  placeholder: "Danh mục: Tất cả",
                  value: controlCategory,
                  onValueChange: updateControlCategory,
                  options: [
                    { label: "Tất cả", value: "all" },
                    ...Array.from(
                      new Set(patternRows.map((row) => row.category))
                    ).map((category) => ({
                      label: category,
                      value: category,
                    })),
                  ],
                },
              ]}
              onClear={clearControlFilters}
              onSearchChange={updateControlSearch}
              primaryFilters={
                <DSDateRangeFilter
                  label="Cập nhật"
                  value={modifiedFilter}
                  onValueChange={updateModifiedFilter}
                  customRange={modifiedRange}
                  onCustomRangeChange={setModifiedRange}
                />
              }
              searchLabel="Tìm kiếm kiểm soát vận hành"
              searchPlaceholder="Tìm kiếm kiểm soát, chủ sở hữu hoặc chính sách..."
              searchValue={controlSearch}
            />
          )
        }
      >
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <DSStatusBadge status="active" />
            <DSStatusBadge status="pending" />
            <DSStatusBadge status="warning" />
            <DSStatusBadge status="error" />
            <DSStatusBadge status="success" />
            <DSStatusBadge status="neutral" />
            <DSStatusBadge status="inactive" />
          </div>

          <div className="min-h-0 flex-1">
            <DSDataTable
              columns={patternColumns}
              data={paginatedPatternRows}
              enableColumnVisibility
              enableRowSelection
              emptyMessage="Không có kiểm soát nào khớp với tìm kiếm và bộ lọc hiện tại."
              getRowAriaLabel={(row) => `Mở chi tiết kiểm soát ${row.title}`}
              getRowHref={(row) => `#${row.id}`}
              getRowId={(row) => row.id}
              getRowSelectionLabel={(row) => `Chọn kiểm soát ${row.title}`}
              onPageChange={setControlPage}
              onSelectedRowIdsChange={(ids) =>
                setSelectedControlIds(ids.map(String))
              }
              page={controlPage}
              pageSize={CONTROLS_PAGE_SIZE}
              pagination
              paginationPlacement="none"
              rowActions={getPatternRowActions}
              scrollMode="body"
              selectedRowIds={selectedControlIds}
              stickyHeader
              totalItems={filteredPatternRows.length}
            />
          </div>
        </div>
      </DSListPageCard>
      <DSImportFileDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import kiểm soát"
        description="Tải lên hàng loạt kiểm soát vận hành bằng file mẫu đã phê duyệt."
        acceptedFormats={["CSV", "XLSX"]}
        maxFileSizeLabel="Dung lượng tối đa: 10MB"
        templateLabel="Tải file mẫu kiểm soát"
        onDownloadTemplate={() => {
          toastInfo("Đã bắt đầu tải file mẫu")
        }}
        onUploadFile={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 400))
        }}
        onUploadComplete={(file) => {
          toastSuccess(
            "Đã tải file import kiểm soát",
            `${file.name} đã được tải lên thành công và sẵn sàng xử lý.`
          )
        }}
      />
    </DSSection>
  )
}

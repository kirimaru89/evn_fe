"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Download, Eye, Lock, Pencil, Plus, Trash, Unlock } from "lucide-react"

import {
  DSAppShell,
  DSBulkActionBar,
  DSButton,
  DSConfirmDialog,
  DSDataTable,
  DSDateRangeFilter,
  DSFilterBar,
  DSImportFileDialog,
  DSImportReviewDialog,
  DSListPageCard,
  DSPage,
  DSPageBody,
  DSRangePagination,
  DSStatusBadge,
  notifyStatusChange,
  toastInfo,
  toastSuccess,
  type DSDataTableColumn,
  type DSDataTableSortDirection,
  type DSDateRangeFilterRange,
  type DSBulkAction,
  type DSTableRowAction,
} from "@/components/ds"
import {
  departmentOptions,
  demoUsers,
  roleOptions,
  statusOptions,
  type DemoUser,
} from "./_data/users"
import { DEMO_LOADING_DELAY_MS, waitForDemoLoading } from "./_components/demo-loading"
import { UserImportReview } from "./_components/user-import-review"
import {
  createUserImportPreviewRows,
  getUserImportReviewSummary,
  type UserImportPreviewRow,
} from "./_data/import-preview"

const USERS_PAGE_SIZE = 50

function getLastActiveSortValue(value: string) {
  const normalized = value.toLowerCase()
  const timeMatch = value.match(/(\d{1,2}):(\d{2})/)
  const hour = timeMatch ? Number(timeMatch[1]) : 0
  const minute = timeMatch ? Number(timeMatch[2]) : 0
  const timeScore = hour * 60 + minute

  if (normalized.startsWith("today") || normalized.startsWith("hôm nay")) {
    return 1_000_000 + timeScore
  }

  if (normalized.startsWith("yesterday") || normalized.startsWith("hôm qua")) {
    return 990_000 + timeScore
  }

  const dateMatch = value.match(/([A-Za-z]{3})\s+(\d{1,2})/)
  const monthScores: Record<string, number> = {
    jan: 1,
    feb: 2,
    mar: 3,
    apr: 4,
    may: 5,
    jun: 6,
    jul: 7,
    aug: 8,
    sep: 9,
    oct: 10,
    nov: 11,
    dec: 12,
  }

  if (dateMatch) {
    const month = monthScores[dateMatch[1].toLowerCase()] ?? 0
    const day = Number(dateMatch[2])

    return month * 10_000 + day * 100 + timeScore / 1_000
  }

  const numericDateMatch = value.match(/(\d{1,2})\/(\d{1,2})/)

  if (numericDateMatch) {
    const day = Number(numericDateMatch[1])
    const month = Number(numericDateMatch[2])

    return month * 10_000 + day * 100 + timeScore / 1_000
  }

  return 0
}

function getUserInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export default function DemoUsersPage() {
  const [users, setUsers] = useState<DemoUser[]>(demoUsers)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [modifiedFilter, setModifiedFilter] = useState("this-year")
  const [modifiedRange, setModifiedRange] =
    useState<DSDateRangeFilterRange>({})
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState("lastActive")
  const [sortDirection, setSortDirection] =
    useState<DSDataTableSortDirection>("desc")
  const [statusTarget, setStatusTarget] = useState<DemoUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DemoUser | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [importOpen, setImportOpen] = useState(false)
  const [importReviewOpen, setImportReviewOpen] = useState(false)
  const [importReviewRows, setImportReviewRows] = useState<
    UserImportPreviewRow[]
  >([])
  const [importReviewFileName, setImportReviewFileName] = useState("")
  const [isConfirmingImport, setIsConfirmingImport] = useState(false)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const tableLoadingTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (tableLoadingTimeoutRef.current) {
        window.clearTimeout(tableLoadingTimeoutRef.current)
      }
    }
  }, [])

  const showTableLoading = () => {
    if (tableLoadingTimeoutRef.current) {
      window.clearTimeout(tableLoadingTimeoutRef.current)
    }

    setIsTableLoading(true)
    tableLoadingTimeoutRef.current = window.setTimeout(() => {
      setIsTableLoading(false)
      tableLoadingTimeoutRef.current = null
    }, DEMO_LOADING_DELAY_MS)
  }

  const updateSort = useCallback((nextSortKey: string, nextDirection: DSDataTableSortDirection) => {
    showTableLoading()
    setSortKey(nextSortKey)
    setSortDirection(nextDirection)
    setPage(1)
  }, [])

  const userColumns = useMemo(
    () => {
      const lastActiveDirection =
        sortKey === "lastActive" ? sortDirection : "desc"

      return [
        {
          key: "user",
          header: "Người dùng",
          accessor: (row) => row.name,
          render: (_value, row) => <span className="font-medium">{row.name}</span>,
          renderLeading: (row) => (
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md border border-border bg-muted font-heading text-xs font-medium text-muted-foreground"
            >
              {getUserInitials(row.name)}
            </span>
          ),
        },
        {
          key: "email",
          header: "Email",
          accessor: "email",
        },
        {
          key: "role",
          header: "Vai trò",
          accessor: "role",
          hideable: true,
        },
        {
          key: "department",
          header: "Phòng ban",
          accessor: "department",
          hideable: true,
        },
        {
          key: "status",
          header: "Trạng thái",
          accessor: "status",
          render: (_value, row) => <DSStatusBadge status={row.status} />,
          hideable: true,
        },
        {
          key: "lastActive",
          header: "Hoạt động gần nhất",
          accessor: "lastActive",
          align: "right",
          sortable: true,
          sortKey: "lastActive",
          sortDirection: lastActiveDirection,
          onSortChange: updateSort,
          hideable: true,
        },
      ] satisfies readonly DSDataTableColumn<DemoUser>[]
    },
    [sortDirection, sortKey, updateSort]
  )

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [
          user.id,
          user.name,
          user.email,
          user.role,
          user.department,
          user.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesDepartment =
        departmentFilter === "all" || user.department === departmentFilter

      return matchesSearch && matchesStatus && matchesRole && matchesDepartment
    })
  }, [departmentFilter, roleFilter, search, statusFilter, users])

  const clearFilters = () => {
    showTableLoading()
    setSearch("")
    setStatusFilter("all")
    setRoleFilter("all")
    setDepartmentFilter("all")
    setModifiedFilter("this-year")
    setModifiedRange({})
    setPage(1)
  }

  const updateSearch = (value: string) => {
    showTableLoading()
    setSearch(value)
    setPage(1)
  }

  const updateStatus = (value: string) => {
    showTableLoading()
    setStatusFilter(value)
    setPage(1)
  }

  const updateRole = (value: string) => {
    showTableLoading()
    setRoleFilter(value)
    setPage(1)
  }

  const updateDepartment = (value: string) => {
    showTableLoading()
    setDepartmentFilter(value)
    setPage(1)
  }

  const updateModifiedFilter = (value: string) => {
    showTableLoading()
    setModifiedFilter(value)
    setPage(1)
  }

  const updatePage = (value: number) => {
    showTableLoading()
    setPage(value)
  }

  const sortedUsers = useMemo(() => {
    if (sortKey !== "lastActive") {
      return filteredUsers
    }

    return [...filteredUsers].sort((a, b) => {
      const aValue = getLastActiveSortValue(a.lastActive)
      const bValue = getLastActiveSortValue(b.lastActive)

      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    })
  }, [filteredUsers, sortDirection, sortKey])

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * USERS_PAGE_SIZE

    return sortedUsers.slice(start, start + USERS_PAGE_SIZE)
  }, [page, sortedUsers])

  const confirmStatusChange = async () => {
    if (!statusTarget) {
      return
    }

    const target = statusTarget
    const nextStatus =
      target.status === "inactive" ? "enabled" : "disabled"

    await waitForDemoLoading()

    setUsers((current) =>
      current.map((user) =>
        user.id === target.id
          ? {
              ...user,
              status: user.status === "inactive" ? "active" : "inactive",
            }
          : user
      )
    )

    setStatusTarget(null)
    notifyStatusChange({
      entity: "Người dùng",
      name: target.name,
      status: nextStatus,
    })
  }

  const confirmDeleteUser = async () => {
    if (!deleteTarget) {
      return
    }

    const target = deleteTarget

    await waitForDemoLoading()
    setUsers((current) => current.filter((user) => user.id !== target.id))
    setDeleteTarget(null)
    toastSuccess(
      "Đã xóa người dùng",
      `${target.name} đã được xóa khỏi danh sách demo.`
    )
  }

  const getUserRowActions = useCallback(
    (row: DemoUser): readonly DSTableRowAction[] => [
      {
        key: "view",
        label: "Xem",
        icon: <Eye />,
        href: `/demo/users/${row.id}`,
        quick: true,
      },
      {
        key: "edit",
        label: "Chỉnh sửa",
        icon: <Pencil />,
        href: `/demo/users/${row.id}/edit`,
        quick: true,
      },
      {
        key: "download",
        label: "Tải về",
        icon: <Download />,
        onClick: () =>
          toastInfo(
            "Đang tải dữ liệu người dùng",
            `${row.name} đang được chuẩn bị để tải về.`
          ),
        quick: true,
      },
      {
        key: "status",
        label: row.status === "inactive" ? "Kích hoạt" : "Vô hiệu hóa",
        icon: row.status === "inactive" ? <Unlock /> : <Lock />,
        onClick: () => setStatusTarget(row),
      },
      {
        key: "delete",
        label: "Xóa",
        icon: <Trash />,
        onClick: () => setDeleteTarget(row),
        variant: "destructive",
      },
    ],
    []
  )

  const selectedUserCount = selectedUserIds.length
  const bulkUserActions = useMemo<readonly DSBulkAction[]>(
    () => [
      {
        key: "download",
        label: "Tải về",
        icon: <Download />,
        onClick: () =>
          toastInfo(
            "Đang tải dữ liệu người dùng",
            `${selectedUserCount} người dùng đang được chuẩn bị để tải về.`
          ),
        quick: true,
        disabled: selectedUserCount === 0,
      },
      {
        key: "disable",
        label: "Vô hiệu hóa",
        icon: <Lock />,
        onClick: () =>
          toastInfo(
            "Đã gửi yêu cầu vô hiệu hóa",
            `${selectedUserCount} người dùng đã chọn.`
          ),
        disabled: selectedUserCount === 0,
        quick: true,
      },
      {
        key: "enable",
        label: "Kích hoạt",
        icon: <Unlock />,
        onClick: () =>
          toastInfo(
            "Đã gửi yêu cầu kích hoạt",
            `${selectedUserCount} người dùng đã chọn.`
          ),
        disabled: selectedUserCount === 0,
        quick: true,
      },
      {
        key: "delete",
        label: "Xóa",
        icon: <Trash />,
        onClick: () =>
          toastInfo("Yêu cầu xác nhận xóa", `${selectedUserCount} người dùng đã chọn.`),
        variant: "destructive",
        disabled: selectedUserCount === 0,
      },
    ],
    [selectedUserCount]
  )

  const importReviewSummary = useMemo(
    () => getUserImportReviewSummary(importReviewRows),
    [importReviewRows]
  )

  const resetImportReview = () => {
    setImportReviewOpen(false)
    setImportReviewRows([])
    setImportReviewFileName("")
    setIsConfirmingImport(false)
  }

  const confirmImport = async () => {
    setIsConfirmingImport(true)
    await waitForDemoLoading()
    toastSuccess(
      "Import người dùng thành công",
      `${importReviewSummary.valid} dòng dữ liệu đã được xác nhận.`
    )
    resetImportReview()
  }

  const statusTargetIsInactive = statusTarget?.status === "inactive"

  return (
    <DSAppShell
      breadcrumbs={[{ label: "Danh sách người dùng" }]}
      headerSticky={true}
      pageTitle="Danh sách người dùng"
    >
      <DSPage className="h-full bg-transparent">
        <DSPageBody className="h-full min-h-0" width="full">
          <DSListPageCard
            scrollMode="table"
            title="Danh sách người dùng"
            actions={
              <>
                <DSRangePagination
                  page={page}
                  pageSize={USERS_PAGE_SIZE}
                  totalItems={filteredUsers.length}
                  disabled={isTableLoading}
                  onPageChange={updatePage}
                />
                <DSButton
                  leftIcon={<Download />}
                  onClick={() => setImportOpen(true)}
                  variant="outline"
                >
                  Import người dùng
                </DSButton>
                <DSButton asChild leftIcon={<Plus />}>
                  <Link href="/demo/users/create">Tạo người dùng</Link>
                </DSButton>
              </>
            }
            toolbar={
              selectedUserCount > 0 ? (
                <DSBulkActionBar
                  actions={bulkUserActions}
                  onClearSelection={() => setSelectedUserIds([])}
                  selectedCount={selectedUserCount}
                />
              ) : (
                <DSFilterBar
                  clearLabel="Đặt lại"
                  filters={[
                    {
                      label: "Trạng thái",
                      placeholder: "Trạng thái: Tất cả",
                      value: statusFilter,
                      onValueChange: updateStatus,
                      options: [
                        { label: "Tất cả", value: "all" },
                        ...statusOptions,
                      ],
                    },
                    {
                      label: "Vai trò",
                      placeholder: "Vai trò: Tất cả",
                      value: roleFilter,
                      onValueChange: updateRole,
                      options: [
                        { label: "Tất cả", value: "all" },
                        ...roleOptions.map((role) => ({
                          label: role,
                          value: role,
                        })),
                      ],
                    },
                    {
                      label: "Phòng ban",
                      placeholder: "Phòng ban: Tất cả",
                      value: departmentFilter,
                      onValueChange: updateDepartment,
                      options: [
                        { label: "Tất cả", value: "all" },
                        ...departmentOptions.map((department) => ({
                          label: department,
                          value: department,
                        })),
                      ],
                    },
                  ]}
                  onClear={clearFilters}
                  onSearchChange={updateSearch}
                  primaryFilters={
                    <DSDateRangeFilter
                      label="Cập nhật"
                      value={modifiedFilter}
                      onValueChange={updateModifiedFilter}
                      customRange={modifiedRange}
                      onCustomRangeChange={setModifiedRange}
                    />
                  }
                  searchLabel="Tìm kiếm người dùng"
                  searchPlaceholder="Tìm kiếm người dùng, vai trò hoặc phòng ban..."
                  searchValue={search}
                />
              )
            }
          >
            <DSDataTable
              columns={userColumns}
              data={paginatedUsers}
              enableColumnVisibility
              enableRowSelection
              emptyTitle="Chưa có người dùng"
              emptyMessage="Tạo người dùng để bắt đầu quản lý quyền truy cập hệ thống."
              getRowAriaLabel={(user) =>
                `Mở chi tiết người dùng ${user.name}`
              }
              getRowHref={(row) => `/demo/users/${row.id}`}
              getRowId={(row) => row.id}
              getRowSelectionLabel={(user) => `Chọn người dùng ${user.name}`}
              isFiltered={
                Boolean(search) ||
                statusFilter !== "all" ||
                roleFilter !== "all" ||
                departmentFilter !== "all" ||
                modifiedFilter !== "this-year"
              }
              loading={isTableLoading}
              loadingMessage="Đang làm mới danh sách người dùng."
              noResultsTitle="Không tìm thấy người dùng"
              noResultsMessage="Hãy điều chỉnh từ khóa hoặc bộ lọc."
              onPageChange={updatePage}
              onSelectedRowIdsChange={(ids) =>
                setSelectedUserIds(ids.map(String))
              }
              page={page}
              pageSize={USERS_PAGE_SIZE}
              pagination
              paginationPlacement="none"
              rowActions={(row) => getUserRowActions(row)}
              scrollMode="body"
              selectedRowIds={selectedUserIds}
              stickyHeader
              totalItems={filteredUsers.length}
            />
          </DSListPageCard>
        </DSPageBody>
      </DSPage>
      <DSConfirmDialog
        open={Boolean(statusTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setStatusTarget(null)
          }
        }}
        title={
          statusTargetIsInactive
            ? "Kích hoạt người dùng?"
            : "Vô hiệu hóa người dùng?"
        }
        description={
          statusTarget
            ? statusTargetIsInactive
              ? `${statusTarget.name} sẽ có thể truy cập hệ thống trở lại.`
              : `${statusTarget.name} sẽ không còn quyền truy cập hệ thống.`
            : undefined
        }
        confirmLabel={
          statusTargetIsInactive
            ? "Kích hoạt người dùng"
            : "Vô hiệu hóa người dùng"
        }
        variant={statusTargetIsInactive ? "default" : "destructive"}
        onConfirm={confirmStatusChange}
      />
      <DSConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
        title="Xóa người dùng?"
        description={
          deleteTarget
            ? `${deleteTarget.name} sẽ bị xóa khỏi danh sách demo.`
            : undefined
        }
        confirmLabel="Xóa người dùng"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={confirmDeleteUser}
      />
      <DSImportFileDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        title="Import người dùng"
        description="Tải lên danh sách người dùng để tạo hoặc cập nhật hàng loạt tài khoản hệ thống."
        acceptedFormats={["CSV", "XLSX"]}
        maxFileSizeLabel="Dung lượng tối đa: 10MB"
        templateLabel="Tải file mẫu người dùng"
        onDownloadTemplate={() => {
          toastInfo("Đã bắt đầu tải file mẫu")
        }}
        onUploadFile={async () => {
          await waitForDemoLoading()
        }}
        onUploadComplete={(file) => {
          setImportReviewRows(createUserImportPreviewRows())
          setImportReviewFileName(file.name)
          setImportReviewOpen(true)
          toastSuccess(
            "File đã được tải lên",
            `Vui lòng kiểm tra dữ liệu từ ${file.name} trước khi xác nhận import.`
          )
        }}
      />
      <DSImportReviewDialog
        open={importReviewOpen}
        onOpenChange={(open) => {
          if (open) {
            setImportReviewOpen(true)
            return
          }

          resetImportReview()
        }}
        title={
          importReviewFileName
            ? `Rà soát dữ liệu import: ${importReviewFileName}`
            : "Rà soát dữ liệu import"
        }
        confirmLabel="Xác nhận import"
        cancelLabel="Hủy"
        confirmDisabled={
          importReviewRows.length === 0 ||
          importReviewSummary.blockingErrors > 0
        }
        confirmLoading={isConfirmingImport}
        preventCloseWhenDirty={importReviewRows.length > 0}
        onCancel={resetImportReview}
        onConfirm={confirmImport}
      >
        <UserImportReview
          rows={importReviewRows}
          onRowsChange={setImportReviewRows}
        />
      </DSImportReviewDialog>
    </DSAppShell>
  )
}

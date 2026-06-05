"use client"

import * as React from "react"

import {
  CbmPlanApiError,
  bulkDeleteCbmPlans,
  deleteCbmPlan,
  exportCbmPlans,
  getCbmPlanFilterOptions,
  listCbmPlans,
  transferCbmPlanToExecution,
} from "@/lib/thi-nghiem-cbm/api/cbm-plans"
import {
  CBM_PLAN_DEFAULT_PAGE_SIZE,
  getCurrentMonthDateRange,
} from "@/lib/thi-nghiem-cbm/cbm-plan-list"
import type {
  CbmPlanFilterOptionsResponse,
  CbmPlanListItem,
  CbmPlanListQuery,
  CbmPlanListResponse,
  CbmPlanMutationResult,
  ExportCbmPlansResult,
} from "@/types/thi-nghiem-cbm/cbm-plan"

const DEFAULT_VISIBLE_COLUMNS = [
  "deviceCode",
  "deviceName",
  "locationName",
  "managingUnitName",
  "executionDate",
  "status",
  "source",
  "updatedAt",
] as const

type CbmPlanVisibleColumn = (typeof DEFAULT_VISIBLE_COLUMNS)[number] | string

type CbmPlanListErrorCode =
  | "invalid-date-filter"
  | "invalid-selection"
  | "invalid-status"
  | "not-found"
  | "system-error"
  | "timeout"
  | "unknown"

type CbmPlanListErrorScope =
  | "filter-options"
  | "list"
  | "mutation"
  | "validation"

type CbmPlanListError = {
  code: CbmPlanListErrorCode
  message: string
  scope: CbmPlanListErrorScope
}

type CbmPlanMutationKind = "delete" | "bulkDelete" | "transfer" | "export"

type CbmPlanValidationErrors = {
  executionDateRange?: string
  bulkDelete?: string
}

type CbmPlanMutationState = {
  error: CbmPlanListError | null
  isMutating: boolean
  kind: CbmPlanMutationKind | null
  lastResult: CbmPlanMutationResult | ExportCbmPlansResult | null
}

type UpdateCbmPlanListQueryOptions = {
  clearSelection?: boolean
  resetPage?: boolean
}

type UseCbmPlanListResult = {
  bulkDeleteIntent: boolean
  canBulkDelete: boolean
  clearBulkDeleteIntent: () => void
  clearDeleteTarget: () => void
  clearMutationResult: () => void
  clearSelection: () => void
  clearTransferTarget: () => void
  deleteTarget: CbmPlanListItem | null
  executeBulkDelete: () => Promise<CbmPlanMutationResult | null>
  executeDelete: (planId?: string) => Promise<CbmPlanMutationResult | null>
  executeExport: () => Promise<ExportCbmPlansResult | null>
  executeTransfer: (planId?: string) => Promise<CbmPlanMutationResult | null>
  filterOptions: CbmPlanFilterOptionsResponse
  filterOptionsError: CbmPlanListError | null
  hasActiveFilters: boolean
  isFilterOptionsLoading: boolean
  isInitialLoading: boolean
  isListLoading: boolean
  items: CbmPlanListItem[]
  listError: CbmPlanListError | null
  mutation: CbmPlanMutationState
  pagination: {
    currentRange: string
    page: number
    pageSize: number
    total: number
  }
  query: CbmPlanListQuery
  reload: () => Promise<CbmPlanListResponse | null>
  resetFilters: () => Promise<CbmPlanListResponse | null>
  selectedRowIds: string[]
  selectedRows: CbmPlanListItem[]
  setBulkDeleteIntent: (open: boolean) => void
  setDeleteTarget: (plan: CbmPlanListItem | null) => void
  setPage: (page: number) => Promise<CbmPlanListResponse | null>
  setPageSize: (pageSize: number) => Promise<CbmPlanListResponse | null>
  setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>
  setTransferTarget: (plan: CbmPlanListItem | null) => void
  setVisibleColumns: React.Dispatch<
    React.SetStateAction<CbmPlanVisibleColumn[]>
  >
  transferTarget: CbmPlanListItem | null
  updateQuery: (
    patch: Partial<CbmPlanListQuery>,
    options?: UpdateCbmPlanListQueryOptions
  ) => Promise<CbmPlanListResponse | null>
  validationErrors: CbmPlanValidationErrors
  visibleColumns: CbmPlanVisibleColumn[]
}

const emptyFilterOptions: CbmPlanFilterOptionsResponse = {
  locations: [],
  managingUnits: [],
}

function createDefaultQuery(): CbmPlanListQuery {
  const currentMonthRange = getCurrentMonthDateRange()

  return {
    executionDateFrom: currentMonthRange.from,
    executionDateTo: currentMonthRange.to,
    page: 1,
    pageSize: CBM_PLAN_DEFAULT_PAGE_SIZE,
    status: "all",
  }
}

function hasListFilters(query: CbmPlanListQuery) {
  const defaultQuery = createDefaultQuery()

  return Boolean(
    query.keyword ||
      query.managingUnitId ||
      query.locationId ||
      (query.status && query.status !== "all") ||
      query.executionDateFrom !== defaultQuery.executionDateFrom ||
      query.executionDateTo !== defaultQuery.executionDateTo
  )
}

function getDateRangeError(query: CbmPlanListQuery) {
  if (
    query.executionDateFrom &&
    query.executionDateTo &&
    query.executionDateFrom > query.executionDateTo
  ) {
    return "Khoảng ngày thực hiện không hợp lệ."
  }

  return undefined
}

function toListError(
  error: unknown,
  scope: CbmPlanListErrorScope
): CbmPlanListError {
  if (error instanceof CbmPlanApiError) {
    return {
      code: error.code,
      message: error.message,
      scope,
    }
  }

  return {
    code: "unknown",
    message:
      error instanceof Error ? error.message : "Không thể xử lý yêu cầu.",
    scope,
  }
}

function useCbmPlanList(): UseCbmPlanListResult {
  const requestIdRef = React.useRef(0)
  const initialQuery = React.useMemo(() => createDefaultQuery(), [])
  const [query, setQuery] = React.useState<CbmPlanListQuery>(initialQuery)
  const [response, setResponse] = React.useState<CbmPlanListResponse>({
    currentRange: "Hiển thị 0 trên 0",
    items: [],
    page: 1,
    pageSize: CBM_PLAN_DEFAULT_PAGE_SIZE,
    total: 0,
  })
  const [filterOptions, setFilterOptions] =
    React.useState<CbmPlanFilterOptionsResponse>(emptyFilterOptions)
  const [selectedRowIds, setSelectedRowIds] = React.useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = React.useState<
    CbmPlanVisibleColumn[]
  >([...DEFAULT_VISIBLE_COLUMNS])
  const [deleteTarget, setDeleteTarget] =
    React.useState<CbmPlanListItem | null>(null)
  const [bulkDeleteIntent, setBulkDeleteIntent] = React.useState(false)
  const [transferTarget, setTransferTarget] =
    React.useState<CbmPlanListItem | null>(null)
  const [isListLoading, setIsListLoading] = React.useState(false)
  const [isFilterOptionsLoading, setIsFilterOptionsLoading] =
    React.useState(true)
  const [listError, setListError] = React.useState<CbmPlanListError | null>(
    null
  )
  const [filterOptionsError, setFilterOptionsError] =
    React.useState<CbmPlanListError | null>(null)
  const [validationErrors, setValidationErrors] =
    React.useState<CbmPlanValidationErrors>({})
  const [mutation, setMutation] = React.useState<CbmPlanMutationState>({
    error: null,
    isMutating: false,
    kind: null,
    lastResult: null,
  })

  const selectedRows = React.useMemo(() => {
    const selectedIds = new Set(selectedRowIds)

    return response.items.filter((item) => selectedIds.has(item.id))
  }, [response.items, selectedRowIds])

  const canBulkDelete = React.useMemo(
    () =>
      selectedRows.length > 0 &&
      selectedRows.length === selectedRowIds.length &&
      selectedRows.every((row) => row.status === "draft"),
    [selectedRowIds.length, selectedRows]
  )

  const hasActiveFilters = React.useMemo(() => hasListFilters(query), [query])

  const loadList = React.useCallback(
    async (nextQuery: CbmPlanListQuery) => {
      const executionDateRangeError = getDateRangeError(nextQuery)

      if (executionDateRangeError) {
        setValidationErrors((current) => ({
          ...current,
          executionDateRange: executionDateRangeError,
        }))
        setListError(null)

        return null
      }

      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      setIsListLoading(true)
      setListError(null)
      setValidationErrors((current) => ({
        ...current,
        executionDateRange: undefined,
      }))

      try {
        const nextResponse = await listCbmPlans(nextQuery)

        if (requestIdRef.current === requestId) {
          setResponse(nextResponse)
        }

        return nextResponse
      } catch (error) {
        const nextError = toListError(error, "list")

        if (requestIdRef.current === requestId) {
          setListError(nextError)
        }

        return null
      } finally {
        if (requestIdRef.current === requestId) {
          setIsListLoading(false)
        }
      }
    },
    []
  )

  const reload = React.useCallback(() => loadList(query), [loadList, query])

  const updateQuery = React.useCallback(
    (
      patch: Partial<CbmPlanListQuery>,
      {
        clearSelection = true,
        resetPage = true,
      }: UpdateCbmPlanListQueryOptions = {}
    ) => {
      const nextQuery = {
        ...query,
        ...patch,
        page: resetPage ? 1 : patch.page ?? query.page,
      }

      setQuery(nextQuery)

      if (clearSelection) {
        setSelectedRowIds([])
      }

      return loadList(nextQuery)
    },
    [loadList, query]
  )

  const setPage = React.useCallback(
    (page: number) =>
      updateQuery({ page: Math.max(1, page) }, { resetPage: false }),
    [updateQuery]
  )

  const setPageSize = React.useCallback(
    (pageSize: number) =>
      updateQuery(
        { page: 1, pageSize: Math.max(1, pageSize) },
        { resetPage: false }
      ),
    [updateQuery]
  )

  const resetFilters = React.useCallback(() => {
    const nextQuery = createDefaultQuery()

    setQuery(nextQuery)
    setSelectedRowIds([])

    return loadList(nextQuery)
  }, [loadList])

  const clearSelection = React.useCallback(() => {
    setSelectedRowIds([])
  }, [])

  const clearDeleteTarget = React.useCallback(() => {
    setDeleteTarget(null)
  }, [])

  const clearBulkDeleteIntent = React.useCallback(() => {
    setBulkDeleteIntent(false)
  }, [])

  const clearTransferTarget = React.useCallback(() => {
    setTransferTarget(null)
  }, [])

  const clearMutationResult = React.useCallback(() => {
    setMutation((current) => ({
      ...current,
      error: null,
      lastResult: null,
    }))
  }, [])

  const startMutation = React.useCallback((kind: CbmPlanMutationKind) => {
    setMutation({
      error: null,
      isMutating: true,
      kind,
      lastResult: null,
    })
  }, [])

  const finishMutation = React.useCallback(
    (result: CbmPlanMutationResult | ExportCbmPlansResult) => {
      setMutation((current) => ({
        ...current,
        error: null,
        isMutating: false,
        lastResult: result,
      }))
    },
    []
  )

  const failMutation = React.useCallback((error: unknown) => {
    setMutation((current) => ({
      ...current,
      error: toListError(error, "mutation"),
      isMutating: false,
      lastResult: null,
    }))
  }, [])

  const executeDelete = React.useCallback(
    async (planId = deleteTarget?.id) => {
      if (!planId) {
        return null
      }

      startMutation("delete")

      try {
        const result = await deleteCbmPlan({ planId })
        finishMutation(result)
        setDeleteTarget(null)
        setSelectedRowIds((current) => current.filter((id) => id !== planId))
        await loadList(query)

        return result
      } catch (error) {
        failMutation(error)

        return null
      }
    },
    [deleteTarget?.id, failMutation, finishMutation, loadList, query, startMutation]
  )

  const executeBulkDelete = React.useCallback(async () => {
    if (!canBulkDelete) {
      setValidationErrors((current) => ({
        ...current,
        bulkDelete: "Chỉ các kế hoạch trạng thái Nháp được xóa.",
      }))

      return null
    }

    startMutation("bulkDelete")

    try {
      const result = await bulkDeleteCbmPlans({ planIds: selectedRowIds })
      finishMutation(result)
      setBulkDeleteIntent(false)
      setSelectedRowIds([])
      setValidationErrors((current) => ({
        ...current,
        bulkDelete: undefined,
      }))
      await loadList(query)

      return result
    } catch (error) {
      failMutation(error)

      return null
    }
  }, [
    canBulkDelete,
    failMutation,
    finishMutation,
    loadList,
    query,
    selectedRowIds,
    startMutation,
  ])

  const executeTransfer = React.useCallback(
    async (planId = transferTarget?.id) => {
      if (!planId) {
        return null
      }

      startMutation("transfer")

      try {
        const result = await transferCbmPlanToExecution({ planId })
        finishMutation(result)
        setTransferTarget(null)
        await loadList(query)

        return result
      } catch (error) {
        failMutation(error)

        return null
      }
    },
    [
      failMutation,
      finishMutation,
      loadList,
      query,
      startMutation,
      transferTarget?.id,
    ]
  )

  const executeExport = React.useCallback(async () => {
    const executionDateRangeError = getDateRangeError(query)

    if (executionDateRangeError) {
      setValidationErrors((current) => ({
        ...current,
        executionDateRange: executionDateRangeError,
      }))

      return null
    }

    startMutation("export")

    try {
      const result = await exportCbmPlans({
        filters: query,
        visibleColumns,
      })
      finishMutation(result)

      return result
    } catch (error) {
      failMutation(error)

      return null
    }
  }, [failMutation, finishMutation, query, startMutation, visibleColumns])

  React.useEffect(() => {
    let isMounted = true

    getCbmPlanFilterOptions()
      .then((nextFilterOptions) => {
        if (isMounted) {
          setFilterOptions(nextFilterOptions)
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setFilterOptionsError(toListError(error, "filter-options"))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsFilterOptionsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  React.useEffect(() => {
    let isCancelled = false

    queueMicrotask(() => {
      if (!isCancelled) {
        void loadList(initialQuery)
      }
    })

    return () => {
      isCancelled = true
    }
  }, [initialQuery, loadList])

  return {
    bulkDeleteIntent,
    canBulkDelete,
    clearBulkDeleteIntent,
    clearDeleteTarget,
    clearMutationResult,
    clearSelection,
    clearTransferTarget,
    deleteTarget,
    executeBulkDelete,
    executeDelete,
    executeExport,
    executeTransfer,
    filterOptions,
    filterOptionsError,
    hasActiveFilters,
    isFilterOptionsLoading,
    isInitialLoading:
      isListLoading && response.items.length === 0 && response.total === 0,
    isListLoading,
    items: response.items,
    listError,
    mutation,
    pagination: {
      currentRange: response.currentRange ?? "Hiển thị 0 trên 0",
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
    },
    query,
    reload,
    resetFilters,
    selectedRowIds,
    selectedRows,
    setBulkDeleteIntent,
    setDeleteTarget,
    setPage,
    setPageSize,
    setSelectedRowIds,
    setTransferTarget,
    setVisibleColumns,
    transferTarget,
    updateQuery,
    validationErrors,
    visibleColumns,
  }
}

export { DEFAULT_VISIBLE_COLUMNS, useCbmPlanList }
export type {
  CbmPlanListError,
  CbmPlanMutationKind,
  CbmPlanMutationState,
  CbmPlanValidationErrors,
  CbmPlanVisibleColumn,
  UseCbmPlanListResult,
}

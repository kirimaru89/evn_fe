export type CbmPlanStatus =
  | "draft"
  | "pendingDirectorApproval"
  | "approved"
  | "rejected"
  | "transferredToExecution"

export type CbmPlanSource = "manual" | "importExcel" | "pmisSync"

export type CbmPlanAvailableAction =
  | "viewDetail"
  | "edit"
  | "delete"
  | "transferToExecution"

export type CbmPlanPageAction = "create" | "importExcel" | "syncPmis" | "export"

export type CbmPlanListItem = {
  id: string
  deviceCode: string
  deviceName: string
  serialNumber: string
  locationName: string
  managingUnitName: string
  executionDate: string
  status: CbmPlanStatus
  source: CbmPlanSource
  updatedAt: string
  availableActions: CbmPlanAvailableAction[]
}

export type CbmPlanListQuery = {
  keyword?: string
  executionDateFrom?: string
  executionDateTo?: string
  status?: CbmPlanStatus | "all"
  managingUnitId?: string
  locationId?: string
  page?: number
  pageSize?: number
}

export type CbmPlanListResponse = {
  items: CbmPlanListItem[]
  total: number
  page: number
  pageSize: number
  currentRange?: string
}

export type CbmPlanFilterOption = {
  id: string
  name: string
}

export type CbmPlanFilterOptionsResponse = {
  managingUnits: CbmPlanFilterOption[]
  locations: CbmPlanFilterOption[]
}

export type CbmPlanMutationResult = {
  success: boolean
  message?: string
}

export type DeleteCbmPlanInput = {
  planId: string
}

export type BulkDeleteCbmPlansInput = {
  planIds: string[]
}

export type TransferCbmPlanToExecutionInput = {
  planId: string
}

export type ExportCbmPlansInput = {
  filters: CbmPlanListQuery
  visibleColumns: string[]
}

export type ExportCbmPlansResult = CbmPlanMutationResult & {
  fileName?: string
}

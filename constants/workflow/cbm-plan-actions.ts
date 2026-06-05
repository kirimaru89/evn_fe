import type {
  CbmPlanAvailableAction,
  CbmPlanPageAction,
} from "@/types/thi-nghiem-cbm/cbm-plan"

export const CBM_PLAN_ROW_ACTIONS = [
  "viewDetail",
  "edit",
  "delete",
  "transferToExecution",
] as const satisfies readonly CbmPlanAvailableAction[]

export const CBM_PLAN_ROW_ACTION_LABELS = {
  viewDetail: "Xem chi tiết",
  edit: "Chỉnh sửa",
  delete: "Xóa",
  transferToExecution: "Chuyển sang thực hiện CBM",
} as const satisfies Record<CbmPlanAvailableAction, string>

export const CBM_PLAN_PAGE_ACTIONS = [
  "create",
  "importExcel",
  "syncPmis",
  "export",
] as const satisfies readonly CbmPlanPageAction[]

export const CBM_PLAN_PAGE_ACTION_LABELS = {
  create: "Tạo mới",
  importExcel: "Import Excel",
  syncPmis: "Đồng bộ PMIS",
  export: "Export",
} as const satisfies Record<CbmPlanPageAction, string>

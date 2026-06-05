import type {
  CbmPlanAvailableAction,
  CbmPlanFilterOption,
  CbmPlanListItem,
  CbmPlanSource,
  CbmPlanStatus,
} from "@/types/thi-nghiem-cbm/cbm-plan"

export const cbmPlanManagingUnitOptions = [
  { id: "unit-ha-noi", name: "Công ty Điện lực Hà Nội" },
  { id: "unit-bac-ninh", name: "Công ty Điện lực Bắc Ninh" },
  { id: "unit-hai-duong", name: "Công ty Điện lực Hải Dương" },
  { id: "unit-hung-yen", name: "Công ty Điện lực Hưng Yên" },
  { id: "unit-vinh-phuc", name: "Công ty Điện lực Vĩnh Phúc" },
  { id: "unit-thai-nguyen", name: "Công ty Điện lực Thái Nguyên" },
] as const satisfies readonly CbmPlanFilterOption[]

export const cbmPlanLocationOptions = [
  { id: "location-dong-anh", name: "Trạm 110kV Đông Anh" },
  { id: "location-gia-lam", name: "Trạm 110kV Gia Lâm" },
  { id: "location-soc-son", name: "Trạm 110kV Sóc Sơn" },
  { id: "location-yen-phong", name: "Trạm 110kV Yên Phong" },
  { id: "location-chi-linh", name: "Trạm 110kV Chí Linh" },
  { id: "location-pho-noi", name: "Trạm 110kV Phố Nối" },
] as const satisfies readonly CbmPlanFilterOption[]

const statuses = [
  "draft",
  "pendingDirectorApproval",
  "approved",
  "rejected",
  "transferredToExecution",
] as const satisfies readonly CbmPlanStatus[]

const sources = [
  "manual",
  "importExcel",
  "pmisSync",
] as const satisfies readonly CbmPlanSource[]

export const CBM_PLAN_LIST_PAGE_SIZE = 50
export const CBM_PLAN_MUTATION_FAILURE_ID = "cbm-plan-mutation-failure"
export const CBM_PLAN_TIMEOUT_KEYWORD = "__timeout__"
export const CBM_PLAN_EMPTY_RESPONSE_KEYWORD = "__empty_response__"

function getAvailableActions(status: CbmPlanStatus): CbmPlanAvailableAction[] {
  switch (status) {
    case "draft":
      return ["viewDetail", "edit", "delete"]
    case "approved":
      return ["viewDetail", "transferToExecution"]
    case "rejected":
      return ["viewDetail", "edit"]
    case "pendingDirectorApproval":
    case "transferredToExecution":
      return ["viewDetail"]
  }
}

function getExecutionDate(index: number) {
  const day = (index % 28) + 1

  return `2026-06-${String(day).padStart(2, "0")}`
}

function getUpdatedAt(index: number) {
  const day = (index % 28) + 1
  const hour = 8 + (index % 9)
  const minute = (index * 7) % 60

  return `2026-06-${String(day).padStart(2, "0")}T${String(hour).padStart(
    2,
    "0"
  )}:${String(minute).padStart(2, "0")}:00+07:00`
}

function createPlan(index: number): CbmPlanListItem {
  const status = statuses[index % statuses.length]
  const source = sources[index % sources.length]
  const unit =
    cbmPlanManagingUnitOptions[index % cbmPlanManagingUnitOptions.length]
  const location = cbmPlanLocationOptions[index % cbmPlanLocationOptions.length]
  const padded = String(index + 1).padStart(3, "0")

  return {
    id: `cbm-plan-${padded}`,
    deviceCode: `MBA-${padded}`,
    deviceName: `Máy biến áp T${(index % 4) + 1}`,
    serialNumber: `SN-CBM-${String(10_000 + index)}`,
    locationName: location.name,
    managingUnitName: unit.name,
    executionDate: getExecutionDate(index),
    status,
    source,
    updatedAt: getUpdatedAt(index),
    availableActions: getAvailableActions(status),
  }
}

export const cbmPlanEdgeCaseRecords: CbmPlanListItem[] = [
  {
    ...createPlan(236),
    id: "cbm-plan-long-content",
    deviceCode: "MBA-LONG-CODE-110KV-EVNNPC-NPSC-CBM-PLAN-0000000001",
    deviceName:
      "Máy biến áp lực T1 tên rất dài dùng để kiểm tra hiển thị trong bảng danh sách kế hoạch CBM",
    serialNumber: "SERIAL-NUMBER-CBM-LONG-00000000000000000001",
    locationName:
      "Trạm 110kV có tên vị trí rất dài để kiểm tra wrap text và overflow trong bảng",
    managingUnitName:
      "Đơn vị quản lý có tên rất dài thuộc Tổng công ty Điện lực miền Bắc dùng cho kiểm thử",
  },
  {
    ...createPlan(237),
    id: CBM_PLAN_MUTATION_FAILURE_ID,
    deviceCode: "MBA-FAIL-001",
    deviceName: "Máy biến áp kiểm thử lỗi mutation",
    status: "draft",
    availableActions: ["viewDetail", "edit", "delete"],
  },
]

export const cbmPlanRecords: CbmPlanListItem[] = [
  ...Array.from({ length: 236 }, (_item, index) => createPlan(index)),
  ...cbmPlanEdgeCaseRecords,
]

export const emptyCbmPlanRecords: CbmPlanListItem[] = []

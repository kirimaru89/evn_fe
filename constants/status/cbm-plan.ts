import type { DSStatus } from "@/components/ds"
import type { CbmPlanStatus } from "@/types/thi-nghiem-cbm/cbm-plan"

export const CBM_PLAN_STATUSES = [
  "draft",
  "pendingDirectorApproval",
  "approved",
  "rejected",
  "transferredToExecution",
] as const satisfies readonly CbmPlanStatus[]

export const CBM_PLAN_STATUS_LABELS = {
  draft: "Nháp",
  pendingDirectorApproval: "Chờ GĐXN duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  transferredToExecution: "Đã chuyển sang thực hiện",
} as const satisfies Record<CbmPlanStatus, string>

export const CBM_PLAN_STATUS_BADGE_TONES = {
  draft: "neutral",
  pendingDirectorApproval: "pending",
  approved: "success",
  rejected: "error",
  transferredToExecution: "active",
} as const satisfies Record<CbmPlanStatus, DSStatus>

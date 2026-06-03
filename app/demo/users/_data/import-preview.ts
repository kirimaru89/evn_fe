import type { DSImportReviewCellError } from "@/components/ds"

import {
  departmentOptions,
  roleOptions,
  statusOptions,
  type UserDepartment,
  type UserRole,
  type UserStatus,
} from "./users"

type UserImportPreviewField =
  | "fullName"
  | "email"
  | "role"
  | "department"
  | "status"
  | "phone"
  | "region"
  | "permissionGroup"

type UserImportPreviewErrors = Partial<
  Record<UserImportPreviewField, DSImportReviewCellError>
>

type UserImportPreviewRow = {
  id: string
  fullName: string
  email: string
  role: UserRole | ""
  department: UserDepartment | ""
  status: UserStatus | ""
  phone: string
  region: UserRegion | ""
  permissionGroup: UserPermissionGroup | ""
  errors: UserImportPreviewErrors
}

type UserRegion = "Miền Bắc" | "Miền Trung" | "Miền Nam"

type UserPermissionGroup =
  | "Cơ bản"
  | "Phê duyệt"
  | "Bảo mật"
  | "Báo cáo"
  | "Quản trị"

type UserImportPreviewBaseRow = Omit<
  UserImportPreviewRow,
  "errors" | "phone" | "region" | "permissionGroup"
>

type UserImportPreviewExtraFields = Pick<
  UserImportPreviewRow,
  "phone" | "region" | "permissionGroup"
>

type UserImportReviewSummary = {
  total: number
  valid: number
  invalid: number
  blockingErrors: number
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^(\+84|0)\s?\d{2,3}\s?\d{3,4}\s?\d{3,4}$/

const regionOptions: UserRegion[] = ["Miền Bắc", "Miền Trung", "Miền Nam"]

const permissionGroupOptions: UserPermissionGroup[] = [
  "Cơ bản",
  "Phê duyệt",
  "Bảo mật",
  "Báo cáo",
  "Quản trị",
]

const mockImportRows: UserImportPreviewBaseRow[] = [
  {
    id: "IMP-001",
    fullName: "Nguyen Hoang",
    email: "nguyen.hoang@example.com",
    role: "Chuyên viên phân tích",
    department: "Vận hành",
    status: "active",
  },
  {
    id: "IMP-002",
    fullName: "Phuong Anh",
    email: "phuong.anh@example.com",
    role: "Người phê duyệt",
    department: "Tài chính",
    status: "pending",
  },
  {
    id: "IMP-003",
    fullName: "",
    email: "bao.tran@example.com",
    role: "Kiểm toán viên",
    department: "Quản trị",
    status: "active",
  },
  {
    id: "IMP-004",
    fullName: "Khanh Le",
    email: "khanh.le",
    role: "Người rà soát bảo mật",
    department: "Bảo mật",
    status: "warning",
  },
  {
    id: "IMP-005",
    fullName: "Thu Ha",
    email: "thu.ha@example.com",
    role: "",
    department: "Mua sắm",
    status: "active",
  },
  {
    id: "IMP-006",
    fullName: "Long Pham",
    email: "long.pham@example.com",
    role: "Quản trị hệ thống",
    department: "",
    status: "active",
  },
  {
    id: "IMP-007",
    fullName: "Lan Vu",
    email: "lan.vu@example.com",
    role: "Chuyên viên phân tích",
    department: "Tài chính",
    status: "",
  },
  {
    id: "IMP-008",
    fullName: "Minh Dao",
    email: "minh.dao@example.com",
    role: "Người phê duyệt",
    department: "Vận hành",
    status: "active",
  },
  {
    id: "IMP-009",
    fullName: "Hieu Do",
    email: "hieu.do@example.com",
    role: "Người rà soát bảo mật",
    department: "Bảo mật",
    status: "active",
  },
  {
    id: "IMP-010",
    fullName: "Trang Bui",
    email: "",
    role: "Kiểm toán viên",
    department: "Quản trị",
    status: "pending",
  },
  {
    id: "IMP-011",
    fullName: "Nam Vo",
    email: "nam.vo@example.com",
    role: "Chuyên viên phân tích",
    department: "Mua sắm",
    status: "active",
  },
  {
    id: "IMP-012",
    fullName: "Thanh Nguyen",
    email: "thanh.nguyen@example.com",
    role: "Quản trị hệ thống",
    department: "Vận hành",
    status: "active",
  },
  {
    id: "IMP-013",
    fullName: "Duc Anh",
    email: "duc.anh@example.com",
    role: "Người phê duyệt",
    department: "Tài chính",
    status: "active",
  },
  {
    id: "IMP-014",
    fullName: "Ha Pham",
    email: "ha.pham@example.com",
    role: "Chuyên viên phân tích",
    department: "Mua sắm",
    status: "pending",
  },
  {
    id: "IMP-015",
    fullName: "",
    email: "cuong.nguyen@example.com",
    role: "Người rà soát bảo mật",
    department: "Bảo mật",
    status: "active",
  },
  {
    id: "IMP-016",
    fullName: "Quynh Tran",
    email: "quynh.tran@",
    role: "Kiểm toán viên",
    department: "Quản trị",
    status: "warning",
  },
  {
    id: "IMP-017",
    fullName: "Viet Ho",
    email: "viet.ho@example.com",
    role: "",
    department: "Vận hành",
    status: "active",
  },
  {
    id: "IMP-018",
    fullName: "Hanh Do",
    email: "hanh.do@example.com",
    role: "Người phê duyệt",
    department: "",
    status: "active",
  },
  {
    id: "IMP-019",
    fullName: "Son Dang",
    email: "son.dang@example.com",
    role: "Quản trị hệ thống",
    department: "Vận hành",
    status: "",
  },
  {
    id: "IMP-020",
    fullName: "My Le",
    email: "my.le@example.com",
    role: "Chuyên viên phân tích",
    department: "Tài chính",
    status: "active",
  },
  {
    id: "IMP-021",
    fullName: "Tien Nguyen",
    email: "tien.nguyen@example.com",
    role: "Người rà soát bảo mật",
    department: "Bảo mật",
    status: "active",
  },
  {
    id: "IMP-022",
    fullName: "Vy Tran",
    email: "",
    role: "Người phê duyệt",
    department: "Tài chính",
    status: "pending",
  },
  {
    id: "IMP-023",
    fullName: "Khoa Phan",
    email: "khoa.phan@example.com",
    role: "Kiểm toán viên",
    department: "Quản trị",
    status: "active",
  },
  {
    id: "IMP-024",
    fullName: "Nga Bui",
    email: "nga.bui@example.com",
    role: "Chuyên viên phân tích",
    department: "Mua sắm",
    status: "warning",
  },
  {
    id: "IMP-025",
    fullName: "",
    email: "dat.vo@example.com",
    role: "",
    department: "Vận hành",
    status: "active",
  },
  {
    id: "IMP-026",
    fullName: "Loan Hoang",
    email: "loan.hoang.example.com",
    role: "Người rà soát bảo mật",
    department: "",
    status: "active",
  },
  {
    id: "IMP-027",
    fullName: "Thao Dinh",
    email: "thao.dinh@example.com",
    role: "Quản trị hệ thống",
    department: "Vận hành",
    status: "active",
  },
  {
    id: "IMP-028",
    fullName: "Phong Lam",
    email: "phong.lam@example.com",
    role: "Người phê duyệt",
    department: "Tài chính",
    status: "inactive",
  },
  {
    id: "IMP-029",
    fullName: "Tu Nguyen",
    email: "tu.nguyen@example.com",
    role: "Chuyên viên phân tích",
    department: "Mua sắm",
    status: "",
  },
  {
    id: "IMP-030",
    fullName: "Giang Tran",
    email: "giang.tran@example.com",
    role: "Kiểm toán viên",
    department: "Quản trị",
    status: "active",
  },
]

const importRowDetails: Record<string, UserImportPreviewExtraFields> = {
  "IMP-001": { phone: "+84 24 5550 2001", region: "Miền Bắc", permissionGroup: "Báo cáo" },
  "IMP-002": { phone: "+84 28 5550 2002", region: "Miền Nam", permissionGroup: "Phê duyệt" },
  "IMP-003": { phone: "+84 24 5550 2003", region: "Miền Bắc", permissionGroup: "Quản trị" },
  "IMP-004": { phone: "024-ABC-2004", region: "Miền Trung", permissionGroup: "Bảo mật" },
  "IMP-005": { phone: "+84 24 5550 2005", region: "Miền Bắc", permissionGroup: "" },
  "IMP-006": { phone: "+84 28 5550 2006", region: "", permissionGroup: "Quản trị" },
  "IMP-007": { phone: "", region: "Miền Nam", permissionGroup: "Báo cáo" },
  "IMP-008": { phone: "+84 24 5550 2008", region: "Miền Bắc", permissionGroup: "Phê duyệt" },
  "IMP-009": { phone: "+84 23 6550 2009", region: "Miền Trung", permissionGroup: "Bảo mật" },
  "IMP-010": { phone: "+84 28 5550 2010", region: "Miền Nam", permissionGroup: "Quản trị" },
  "IMP-011": { phone: "+84 24 5550 2011", region: "Miền Bắc", permissionGroup: "Báo cáo" },
  "IMP-012": { phone: "+84 24 5550 2012", region: "Miền Bắc", permissionGroup: "Quản trị" },
  "IMP-013": { phone: "+84 28 5550 2013", region: "Miền Nam", permissionGroup: "Phê duyệt" },
  "IMP-014": { phone: "+84 24 5550 2014", region: "Miền Bắc", permissionGroup: "Báo cáo" },
  "IMP-015": { phone: "+84 23 6550 2015", region: "Miền Trung", permissionGroup: "Bảo mật" },
  "IMP-016": { phone: "+84 28 5550 2016", region: "Miền Nam", permissionGroup: "Quản trị" },
  "IMP-017": { phone: "+84 24 5550 2017", region: "Miền Bắc", permissionGroup: "" },
  "IMP-018": { phone: "+84 28 5550 2018", region: "", permissionGroup: "Phê duyệt" },
  "IMP-019": { phone: "+84 24 5550 2019", region: "Miền Bắc", permissionGroup: "Quản trị" },
  "IMP-020": { phone: "+84 28 5550 2020", region: "Miền Nam", permissionGroup: "Báo cáo" },
  "IMP-021": { phone: "+84 23 6550 2021", region: "Miền Trung", permissionGroup: "Bảo mật" },
  "IMP-022": { phone: "+84 28 5550 2022", region: "Miền Nam", permissionGroup: "Phê duyệt" },
  "IMP-023": { phone: "+84 24 5550 2023", region: "Miền Bắc", permissionGroup: "Quản trị" },
  "IMP-024": { phone: "5550", region: "Miền Bắc", permissionGroup: "Báo cáo" },
  "IMP-025": { phone: "+84 24 5550 2025", region: "", permissionGroup: "Cơ bản" },
  "IMP-026": { phone: "+84 23 6550 2026", region: "Miền Trung", permissionGroup: "Bảo mật" },
  "IMP-027": { phone: "+84 24 5550 2027", region: "Miền Bắc", permissionGroup: "Quản trị" },
  "IMP-028": { phone: "+84 28 5550 2028", region: "Miền Nam", permissionGroup: "Phê duyệt" },
  "IMP-029": { phone: "+84 24 5550 2029", region: "Miền Bắc", permissionGroup: "" },
  "IMP-030": { phone: "+84 28 5550 2030", region: "Miền Nam", permissionGroup: "Quản trị" },
}

function createBlockingError(message: string): DSImportReviewCellError {
  return { message, blocking: true }
}

function validateUserImportRow(row: Omit<UserImportPreviewRow, "errors">) {
  const errors: UserImportPreviewErrors = {}

  if (!row.fullName.trim()) {
    errors.fullName = createBlockingError("Vui lòng nhập họ và tên.")
  }

  if (!row.email.trim() || !emailPattern.test(row.email.trim())) {
    errors.email = createBlockingError("Email không hợp lệ.")
  }

  if (!row.role || !roleOptions.includes(row.role)) {
    errors.role = createBlockingError("Vui lòng chọn vai trò.")
  }

  if (!row.department || !departmentOptions.includes(row.department)) {
    errors.department = createBlockingError("Vui lòng chọn phòng ban.")
  }

  if (!row.status || !statusOptions.some((option) => option.value === row.status)) {
    errors.status = createBlockingError("Vui lòng chọn trạng thái.")
  }

  if (!row.phone.trim() || !phonePattern.test(row.phone.trim())) {
    errors.phone = createBlockingError("Số điện thoại không hợp lệ.")
  }

  if (!row.region || !regionOptions.includes(row.region)) {
    errors.region = createBlockingError("Vui lòng chọn khu vực.")
  }

  if (
    !row.permissionGroup ||
    !permissionGroupOptions.includes(row.permissionGroup)
  ) {
    errors.permissionGroup = createBlockingError("Vui lòng chọn nhóm quyền.")
  }

  return errors
}

function withValidation(
  row: Omit<UserImportPreviewRow, "errors">
): UserImportPreviewRow {
  return {
    ...row,
    errors: validateUserImportRow(row),
  }
}

function createUserImportPreviewRows() {
  return mockImportRows.map((row) =>
    withValidation({
      ...row,
      ...importRowDetails[row.id],
    })
  )
}

function getUserImportReviewSummary(
  rows: readonly UserImportPreviewRow[]
): UserImportReviewSummary {
  return rows.reduce<UserImportReviewSummary>(
    (summary, row) => {
      const blockingErrors = Object.values(row.errors).filter(
        (error) => error?.blocking
      ).length

      return {
        total: summary.total + 1,
        valid: summary.valid + (blockingErrors === 0 ? 1 : 0),
        invalid: summary.invalid + (blockingErrors > 0 ? 1 : 0),
        blockingErrors: summary.blockingErrors + blockingErrors,
      }
    },
    { total: 0, valid: 0, invalid: 0, blockingErrors: 0 }
  )
}

export {
  createUserImportPreviewRows,
  getUserImportReviewSummary,
  permissionGroupOptions,
  regionOptions,
  validateUserImportRow,
  withValidation,
}
export type {
  UserImportPreviewField,
  UserImportPreviewRow,
  UserPermissionGroup,
  UserRegion,
}

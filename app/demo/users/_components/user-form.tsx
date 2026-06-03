"use client"

import { useState } from "react"

import {
  DSButton,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSCheckboxField,
  DSFormField,
  DSInput,
  DSPageActions,
  DSSelectField,
  DSTextarea,
  toastError,
} from "@/components/ds"
import { useDirtyForm } from "@/hooks/use-dirty-form"
import {
  departmentOptions,
  roleOptions,
  statusOptions,
  type UserDepartment,
  type UserRole,
  type UserStatus,
} from "../_data/users"

type UserFormValues = {
  name: string
  email: string
  department: UserDepartment | ""
  role: UserRole | ""
  status: UserStatus
  permissionGroup: string
  requirePasswordReset: boolean
  notes: string
}

type UserFormProps = {
  mode: "create" | "edit"
  initialValues?: UserFormValues
  onSubmit: (values: UserFormValues) => void | Promise<void>
  onCancel: () => void
  submitLabel?: string
  loading?: boolean
}

type UserFormErrors = Partial<Record<keyof UserFormValues, string>>

const permissionGroupOptions = [
  { label: "Quyền truy cập tiêu chuẩn", value: "standard" },
  { label: "Luồng phê duyệt", value: "approval" },
  { label: "Rà soát bảo mật", value: "security" },
  { label: "Quyền kiểm toán", value: "audit" },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const defaultValues: UserFormValues = {
  name: "",
  email: "",
  department: "",
  role: "",
  status: "active",
  permissionGroup: "standard",
  requirePasswordReset: true,
  notes: "",
}

function validateUserForm(values: UserFormValues) {
  const errors: UserFormErrors = {}

  if (!values.name.trim()) {
    errors.name = "Vui lòng nhập họ và tên."
  }

  if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = "Vui lòng nhập địa chỉ email hợp lệ."
  }

  if (!values.department) {
    errors.department = "Vui lòng chọn phòng ban."
  }

  if (!values.role) {
    errors.role = "Vui lòng chọn vai trò."
  }

  return errors
}

function isUserFormReadyToCreate(values: UserFormValues) {
  return (
    Boolean(values.name.trim()) &&
    EMAIL_REGEX.test(values.email.trim()) &&
    Boolean(values.department) &&
    Boolean(values.role)
  )
}

function UserForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  loading = false,
}: UserFormProps) {
  const initialFormValues: UserFormValues = {
    ...defaultValues,
    ...initialValues,
  }
  const [values, setValues] = useState<UserFormValues>(initialFormValues)
  const [errors, setErrors] = useState<UserFormErrors>({})
  const { isDirty, resetBaseline, resetToInitial } = useDirtyForm({
    initialValues: initialFormValues,
    values,
  })
  const canCreate = isUserFormReadyToCreate(values)
  const isSubmitDisabled =
    loading || (mode === "edit" && !isDirty) || (mode === "create" && !canCreate)

  const updateValue = <TKey extends keyof UserFormValues>(
    key: TKey,
    value: UserFormValues[TKey]
  ) => {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      return
    }

    const nextErrors = validateUserForm(values)

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      toastError(
        mode === "create"
          ? "Không thể tạo người dùng"
          : "Không thể lưu người dùng",
        "Kiểm tra các trường được đánh dấu và thử lại."
      )
      return
    }

    await onSubmit(values)

    if (mode === "edit") {
      resetBaseline(values)
    } else {
      setValues(initialFormValues)
      resetToInitial()
      setErrors({})
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="grid gap-6">
          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Thông tin cơ bản</DSCardTitle>
              <DSCardDescription>
                Thông tin định danh, liên hệ và phụ trách của người dùng
                hệ thống.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-4 md:grid-cols-2">
              <DSFormField
                error={errors.name}
                htmlFor={`${mode}-user-name`}
                label="Họ và tên"
                required
              >
                <DSInput
                  id={`${mode}-user-name`}
                  onChange={(event) =>
                    updateValue("name", event.target.value)
                  }
                  placeholder="Nhập họ và tên"
                  value={values.name}
                />
              </DSFormField>
              <DSFormField
                error={errors.email}
                htmlFor={`${mode}-user-email`}
                label="Email"
                required
              >
                <DSInput
                  id={`${mode}-user-email`}
                  onChange={(event) =>
                    updateValue("email", event.target.value)
                  }
                  placeholder="Nhập địa chỉ email"
                  type="email"
                  value={values.email}
                />
              </DSFormField>
              <DSSelectField
                id={`${mode}-user-department`}
                label="Phòng ban"
                required
                error={errors.department}
                onValueChange={(value) =>
                  updateValue("department", value as UserDepartment)
                }
                options={departmentOptions.map((department) => ({
                  label: department,
                  value: department,
                }))}
                placeholder="Chọn phòng ban"
                value={values.department}
              />
              <DSSelectField
                id={`${mode}-user-role`}
                label="Vai trò"
                required
                error={errors.role}
                onValueChange={(value) => updateValue("role", value as UserRole)}
                options={roleOptions.map((role) => ({
                  label: role,
                  value: role,
                }))}
                placeholder="Chọn vai trò"
                value={values.role}
              />
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Thiết lập truy cập</DSCardTitle>
              <DSCardDescription>
                Cấu hình trạng thái tài khoản, nhóm quyền và yêu cầu đăng nhập
                lần đầu.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <DSSelectField
                  id={`${mode}-user-status`}
                  label="Trạng thái"
                  onValueChange={(value) =>
                    updateValue("status", value as UserStatus)
                  }
                  options={statusOptions}
                  placeholder="Chọn trạng thái"
                  value={values.status}
                />
                <DSSelectField
                  id={`${mode}-user-permission-group`}
                  label="Nhóm quyền"
                  onValueChange={(value) =>
                    updateValue("permissionGroup", value)
                  }
                  options={permissionGroupOptions}
                  placeholder="Chọn nhóm quyền"
                  value={values.permissionGroup}
                />
              </div>
              <DSCheckboxField
                checked={values.requirePasswordReset}
                description="Yêu cầu người dùng đặt mật khẩu mới trong lần đăng nhập tiếp theo."
                id={`${mode}-user-password-reset`}
                label="Yêu cầu đặt lại mật khẩu"
                onCheckedChange={(checked) =>
                  updateValue("requirePasswordReset", checked === true)
                }
              />
            </DSCardContent>
          </DSCard>
        </div>

        <DSCard>
          <DSCardHeader>
            <DSCardTitle>Ghi chú</DSCardTitle>
            <DSCardDescription>
              Lưu bối cảnh quản trị và lý do cấp quyền.
            </DSCardDescription>
          </DSCardHeader>
          <DSCardContent>
            <DSFormField
              description="Ghi chú chỉ lưu trong luồng demo này."
              htmlFor={`${mode}-user-notes`}
              label="Ghi chú nội bộ"
            >
              <DSTextarea
                id={`${mode}-user-notes`}
                onChange={(event) => updateValue("notes", event.target.value)}
                placeholder="Thêm ghi chú nội bộ"
                rows={8}
                value={values.notes}
              />
            </DSFormField>
          </DSCardContent>
        </DSCard>
      </div>

      <DSPageActions className="justify-end">
        <DSButton
          disabled={loading}
          onClick={onCancel}
          type="button"
          variant="outline"
        >
          Hủy
        </DSButton>
        <DSButton
          disabled={isSubmitDisabled}
          loading={loading}
          onClick={handleSubmit}
          type="button"
        >
          {submitLabel ?? (mode === "create" ? "Tạo người dùng" : "Lưu thay đổi")}
        </DSButton>
      </DSPageActions>
    </div>
  )
}

export { UserForm }
export type { UserFormProps, UserFormValues }

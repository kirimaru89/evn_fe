"use client"

import * as React from "react"

import { DSImportReviewSelectCell, DSImportReviewTable } from "@/components/ds"
import type { DSImportReviewTableColumn } from "@/components/ds"

import {
  departmentOptions,
  roleOptions,
  statusOptions,
  type UserDepartment,
  type UserRole,
  type UserStatus,
} from "../_data/users"
import {
  permissionGroupOptions,
  regionOptions,
  validateUserImportRow,
  type UserImportPreviewField,
  type UserImportPreviewRow,
  type UserPermissionGroup,
  type UserRegion,
} from "../_data/import-preview"

type UserImportReviewProps = {
  rows: UserImportPreviewRow[]
  onRowsChange: (rows: UserImportPreviewRow[]) => void
}

type SpreadsheetSelectOption = {
  label: string
  value: string
}

function UserImportReview({ rows, onRowsChange }: UserImportReviewProps) {
  const updateRow = (rowId: string, field: UserImportPreviewField, value: string) => {
    onRowsChange(
      rows.map((row) => {
        if (row.id !== rowId) {
          return row
        }

        const nextRow = {
          ...row,
          [field]: value,
        }

        return {
          ...nextRow,
          errors: validateUserImportRow(nextRow),
        }
      })
    )
  }

  const textEditor = (label: string, placeholder: string) =>
    function Editor({
      row,
      value,
      error,
      errorId,
      onChange,
    }: {
      row: UserImportPreviewRow
      value: string
      error?: UserImportPreviewRow["errors"][UserImportPreviewField]
      errorId?: string
      onChange: (value: string) => void
    }) {
      return (
        <input
          aria-label={`${label} cho dòng ${row.id}`}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          title={error?.message}
          className="flex h-full min-h-0 w-full items-center border-0 bg-transparent px-0 py-0 text-xs leading-tight text-foreground outline-none placeholder:text-muted-foreground"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )
    }

  const selectEditor = (
    label: string,
    placeholder: string,
    options: SpreadsheetSelectOption[]
  ) =>
    function Editor({
      row,
      value,
      error,
      errorId,
      onChange,
    }: {
      row: UserImportPreviewRow
      value: string
      error?: UserImportPreviewRow["errors"][UserImportPreviewField]
      errorId?: string
      onChange: (value: string) => void
    }) {
      return (
        <DSImportReviewSelectCell
          aria-label={`${label} cho dòng ${row.id}`}
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          options={options}
          placeholder={placeholder}
          value={value}
          onValueChange={onChange}
        />
      )
    }

  const columns = [
    {
      key: "fullName",
      header: "Họ và tên",
      accessor: "fullName",
      renderEditor: textEditor("Họ và tên", "Nhập họ và tên"),
      onCellChange: (row, value) => updateRow(row.id, "fullName", value),
    },
    {
      key: "email",
      header: "Email",
      accessor: "email",
      renderEditor: textEditor("Email", "Nhập email"),
      onCellChange: (row, value) => updateRow(row.id, "email", value),
    },
    {
      key: "role",
      header: "Vai trò",
      accessor: "role",
      hasDropdownAffordance: true,
      renderEditor: selectEditor(
        "Vai trò",
        "Chọn vai trò",
        roleOptions.map((role) => ({ label: role, value: role }))
      ),
      onCellChange: (row, value) =>
        updateRow(row.id, "role", value as UserRole),
    },
    {
      key: "department",
      header: "Phòng ban",
      accessor: "department",
      hasDropdownAffordance: true,
      renderEditor: selectEditor(
        "Phòng ban",
        "Chọn phòng ban",
        departmentOptions.map((department) => ({
          label: department,
          value: department,
        }))
      ),
      onCellChange: (row, value) =>
        updateRow(row.id, "department", value as UserDepartment),
    },
    {
      key: "status",
      header: "Trạng thái",
      accessor: "status",
      hasDropdownAffordance: true,
      renderEditor: selectEditor(
        "Trạng thái",
        "Chọn trạng thái",
        statusOptions.map((status) => ({
          label: status.label,
          value: status.value,
        }))
      ),
      onCellChange: (row, value) =>
        updateRow(row.id, "status", value as UserStatus),
    },
    {
      key: "phone",
      header: "Số điện thoại",
      accessor: "phone",
      renderEditor: textEditor("Số điện thoại", "Nhập số điện thoại"),
      onCellChange: (row, value) => updateRow(row.id, "phone", value),
    },
    {
      key: "region",
      header: "Khu vực",
      accessor: "region",
      hasDropdownAffordance: true,
      renderEditor: selectEditor(
        "Khu vực",
        "Chọn khu vực",
        regionOptions.map((region) => ({ label: region, value: region }))
      ),
      onCellChange: (row, value) =>
        updateRow(row.id, "region", value as UserRegion),
    },
    {
      key: "permissionGroup",
      header: "Nhóm quyền",
      accessor: "permissionGroup",
      hasDropdownAffordance: true,
      renderEditor: selectEditor(
        "Nhóm quyền",
        "Chọn nhóm quyền",
        permissionGroupOptions.map((group) => ({
          label: group,
          value: group,
        }))
      ),
      onCellChange: (row, value) =>
        updateRow(row.id, "permissionGroup", value as UserPermissionGroup),
    },
  ] satisfies readonly DSImportReviewTableColumn<UserImportPreviewRow>[]

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <DSImportReviewTable columns={columns} rows={rows} />
    </div>
  )
}

export { UserImportReview }
export type { UserImportReviewProps }

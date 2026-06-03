# Feature Spec Template

Use this template for local synced specs under `.specs/<module>/`.

Recommended filename:

```txt
.specs/<module>/<MODULE>-UC-<number>.md
```

Example:

```txt
.specs/thi-nghiem-cbm/CBM-UC-01.md
```

## Metadata

```txt
Module: <Admin | Portal MSM | Thí nghiệm CBM>
Module slug: <admin | portal-msm | thi-nghiem-cbm>
Use case ID: <MODULE>-UC-<number>
Screen ID: <MODULE>-SCR-<number>
Version: <major.minor>
Status: <Draft | In Review | Approved>
Owner: <name/team>
Last updated: <dd/mm/YYYY>
Related documents: <document name, section, link/path>
```

## User Story

```txt
Là <vai trò>, tôi muốn <hành động/mục tiêu> để <giá trị nghiệp vụ>.
```

Example:

```txt
Là NVTN, tôi muốn tạo kế hoạch CBM để quản lý kế hoạch thí nghiệm CBM.
```

## Description

```txt
<Mô tả ngắn gọn chức năng>
```

Example:

```txt
Tạo kế hoạch CBM.
```

## UI / UX

Use ASCII wireframes to describe the screen layout, primary regions, key controls, and action placement.

```txt
+------------------------------------------------------------+
| Header / Breadcrumb                                        |
+------------------------------------------------------------+
| Page title: Tạo kế hoạch CBM                  [Hủy] [Lưu]  |
+------------------------------------------------------------+
| Thông tin thiết bị                                         |
| +----------------------+ +-------------------------------+ |
| | Mã thiết bị          | | Tên thiết bị                  | |
| +----------------------+ +-------------------------------+ |
| | Đơn vị quản lý       | | Trạm / vị trí                 | |
| +----------------------+ +-------------------------------+ |
+------------------------------------------------------------+
| Thông tin kế hoạch                                        |
| +----------------------+ +-------------------------------+ |
| | Ngày thực hiện       | | Người thực hiện               | |
| +----------------------+ +-------------------------------+ |
| | Ghi chú kế hoạch                                      | |
| +--------------------------------------------------------+ |
| | File bằng chứng: [Upload]                             | |
| +--------------------------------------------------------+ |
| | Nội dung đầy đủ                                      | |
| +--------------------------------------------------------+ |
+------------------------------------------------------------+
| Validation / error area                                    |
+------------------------------------------------------------+
```

## Business Rules

Khi `<vai trò>` thực hiện `<hành động>`, cần đảm bảo các rules sau:

```txt
- <Rule 1>
- <Rule 2>
- <Rule 3>
```

If rules are not finalized, mark them explicitly.

```txt
TODO(<owner>): Bổ sung validation rules.
```

Do not invent missing rules during implementation.

## Data Fields

| Field | UI Type | Required | Source | Shared Rule | Notes |
| --- | --- | --- | --- | --- | --- |
| Thông tin thiết bị | Display / selector | TBD | TBD | TBD | Giải thích lấy từ đâu |
| Ngày thực hiện | Datepicker | TBD | User input | Shared date format rule | Format `dd/mm/YYYY` |
| Ghi chú kế hoạch | Textarea | TBD | User input | Shared text length rule | Link shared rule when available |
| File bằng chứng | File upload | TBD | User upload | Shared attachment rule | Define multiple files, file types, max size |
| Nội dung đầy đủ | Textarea | TBD | User input | Shared text length rule | Link shared rule when available |

## Shared Rules References

Use this section to link common project rules instead of repeating them in every ticket.

```txt
Date format rule: <link/path>
Text length rule: <link/path>
Attachment upload rule: <link/path>
Permission rule: <link/path>
Lifecycle rule: <link/path>
Validation rule: <link/path>
```

## Acceptance Criteria

```txt
1. Các validations cần được thực hiện cả FE và BE.
2. Tạo dữ liệu thành công và thông báo thành công cho người dùng.
3. Khi validation thất bại, dữ liệu đã nhập được giữ lại và lỗi hiển thị inline.
4. Khi hệ thống lỗi, hiển thị lỗi rõ ràng và không mất dữ liệu đã nhập.
```

## Implementation Notes

```txt
Route: app/<module>/<route>/page.tsx
Components: components/<module>/<feature>/
Hooks: hooks/<module>/
API: lib/<module>/api/
Types: types/<module>/
Mock data: mock-data/<module>/
Lifecycle: lib/lifecycle/
Permissions: lib/permissions/
Validation: lib/validation/
```

## Change Request

Use this section only for CR specs.

```txt
Current version: <MODULE>-UC-<number>.<old-version>
New version: <MODULE>-UC-<number>.<new-version>
Old spec link/path: <link/path>
New spec link/path: <link/path>
Change summary:
- <Change 1>
- <Change 2>
Impact:
- UI:
- Validation:
- API:
- Permissions:
- Lifecycle:
- Mock data:
```

CR rules:

- Version must be declared.
- Link to the previous spec version.
- Describe the current behavior before describing the requested change.
- Create implementation tasks from the new version and link both old and new specs.

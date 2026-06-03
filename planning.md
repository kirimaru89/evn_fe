# Planning FE Implementation

## 1. Scope

Implement Planning Domain FE for MSM Portal.

In scope:
- Planning list
- Planning detail
- Create planning
- Import planning
- Import preview
- Planning approval
- PMIS planning sync
- Attachment handling
- Planning audit/history display
- Lifecycle-driven readonly/editable behavior
- Role-based action visibility
- Mock-data-driven implementation

Out of scope:
- Execution workflow
- CBM measurement entry
- Reporting dashboards
- Configuration management
- Real API contract
- Notification engine
- PMIS master-data management

Follow:
- FRD Planning as implementation source of truth
- MASTER FRD for shared governance rules
- AGENTS.md for repository execution rules
- DESIGN_SYSTEM.md for UI/DS usage


## 2. Route & Screen Mapping

Implementation note:
- Import flow is launched from `/planning` using `DSImportFileDialog`.
- Review flow is displayed using `DSImportReviewDialog`.
- Dedicated import routes should only be created if the workflow becomes long-running, resumable, or explicitly required later.


| Screen ID | Screen Name | Route | Mode |
|---|---|---|---|
| SCR-PLAN-001 | Danh sách kế hoạch CBM | `/planning` | Page |
| SCR-PLAN-002 | Chi tiết kế hoạch CBM | `/planning/[planId]` | Page |
| SCR-PLAN-003 | Tạo mới kế hoạch CBM | `/planning/create` | Page |
| SCR-PLAN-004 | Import kế hoạch CBM | Triggered from `/planning` via `DSImportFileDialog` | Dialog |
| SCR-PLAN-005 | Preview dữ liệu import | Triggered from `DSImportReviewDialog` | Review Dialog |
| SCR-PLAN-006 | Duyệt kế hoạch CBM | `/planning/[planId]/approval` | Page |
| SCR-PLAN-007 | Đồng bộ kế hoạch từ PMIS | `/planning/sync-pmis` | Page or modal entry |


## 3. Shared Planning Foundation

Centralize Planning logic under:

```txt
lib/planning/
```

### 3.1 Lifecycle Constants

```ts
export const PLANNING_STATUSES = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
```

Display labels:

| Status | UI Label |
|---|---|
| DRAFT | Nháp |
| PENDING_APPROVAL | Chờ duyệt |
| APPROVED | Đã duyệt |
| REJECTED | Từ chối |

Do not invent additional states.

### 3.2 Workflow Mappings

| Current State | Action | Next State |
|---|---|---|
| Nháp | Gửi duyệt | Chờ duyệt |
| Chờ duyệt | Duyệt | Đã duyệt |
| Chờ duyệt | Từ chối | Từ chối |
| Từ chối | Gửi duyệt lại | Chờ duyệt |

### 3.3 Readonly / Editable Helpers

Create helper:

```ts
isPlanningEditable(status)
```

Rules:
- `Nháp` => editable
- `Từ chối` => editable
- `Chờ duyệt` => readonly
- `Đã duyệt` => readonly

### 3.4 Permission Helpers

Create helpers:

```ts
canEditPlanning(role, status)
canSubmitPlanning(role, status)
canApprovePlanning(role, status)
canRejectPlanning(role, status)
canUploadAttachment(role, status)
canRemoveAttachment(role, status)
canViewHistory(role)
```

Rules:
- NVTN can create/edit/import/submit when state allows.
- GĐXN can approve/reject only when state = `Chờ duyệt`.
- System and PMIS are not interactive UI roles.
- Do not hardcode permission logic inside components.

### 3.5 Shared Types

Create typed models:

```ts
PlanningRecord
PlanningStatus
PlanningSource
PlanningAttachment
PlanningAuditLog
PlanningImportSession
PlanningImportRow
PlanningSyncLog
EquipmentItem
```

### 3.6 Shared Validation Mapping

Centralize validation in:

```txt
lib/planning/planning-validation.ts
```

Required validation groups:
- planning required fields
- equipment validity
- duplicate equipment
- file type
- file size
- import row validity
- reject reason
- date range filter

### 3.7 Shared Status Badge Mapping

Use DS status badge wrapper.

Map:
- Nháp
- Chờ duyệt
- Đã duyệt
- Từ chối

Do not create one-off badge colors.

### 3.8 Mock Data Structure

Use typed mock data under:

```txt
mock-data/planning/
```

Required datasets:
- planning records
- equipment records
- attachments
- audit logs
- import sessions
- import preview rows
- PMIS sync logs


## 4. Implementation Plan by Screen


Standard Planning pages should reuse:
- DSPage
- DSPageHeader
- DSPageTitle
- DSPageActions

Do not apply DSPageHeader patterns to import dialogs.
Import dialogs must use:
- DSImportFileDialog
- DSImportReviewDialog

## 4.1 SCR-PLAN-001 — Danh sách kế hoạch CBM

Purpose:
- Display planning records.
- Support search/filter/sort/pagination.
- Navigate to detail/create/import/sync.

Layout:
- App shell
- DSPage
- DSPageHeader
- DSPageTitle
- DSPageActions
- Action area
- Filter bar
- Data table
- Pagination
- Empty/loading/error states

DS components to reuse:
- DSPage / page shell wrapper
- DSFilterBar
- DSDataTable
- DSStatusBadge
- DSButton
- DSStateEmpty
- DSStateLoading
- DSStateError

Table columns:
- Mã kế hoạch
- Tên kế hoạch
- Nguồn dữ liệu
- Mã thiết bị
- Loại thiết bị
- Đơn vị
- Trạng thái workflow
- Ngày kế hoạch
- Người tạo
- Thời gian cập nhật

Filters:
- Mã kế hoạch
- Tên kế hoạch
- Mã thiết bị
- Loại thiết bị
- Đơn vị
- Trạng thái workflow
- Nguồn dữ liệu
- Khoảng thời gian kế hoạch
- Người tạo

Lifecycle handling:
- show edit action only for `Nháp` and `Từ chối`
- disable edit action for `Chờ duyệt` and `Đã duyệt`
- status badge must use centralized status mapping

Interaction behavior:
- filter change reloads table
- filter change resets pagination to page 1
- pagination keeps current filters
- sorting reloads data
- default sorting = `Thời gian cập nhật` descending
- row click opens `/planning/[planId]`

Loading/error/empty states:
- loading table state
- no data state
- no search result state
- data load failure state
- PMIS sync failure entry state if sync action fails

Validation behavior:
- invalid date range shows validation error
- invalid filter value blocks filter apply

Reusable shared logic:
- planning filters
- status mapping
- permission helpers
- mock planning service

Mock data requirements:
- at least 50 planning records
- all 4 statuses
- all sources: PMIS, Manual, Import
- multiple organization units
- empty result case

Codex notes:
- Do not implement custom table pattern.
- Reuse existing enterprise list/table pattern.
- Keep filters session-only.
- Preserve Screen ID in comments/page metadata.


## 4.2 SCR-PLAN-002 — Chi tiết kế hoạch CBM

Purpose:
- Display planning detail.
- Support edit/update when workflow is editable.
- Manage attachments.
- Display audit/history.
- Submit planning workflow.

Layout:
- DSPage
- DSPageHeader
- DSPageTitle
- DSPageActions
- Planning information section
- Equipment section
- Attachment section
- Workflow information section
- Audit information section
- Lịch sử cập nhật section
- Footer/action bar

DS components to reuse:
- DSPage
- DSSection
- DSFormField
- DSDataTable or compact table
- DSStatusBadge
- DSButton
- DSAttachment/Upload pattern if existing
- DSStateEmpty
- DSStateError

Displayed data:
- planning information
- equipment list
- attachment list
- audit information
- workflow history

Lifecycle handling:
- `Nháp`: editable, upload/remove attachment enabled
- `Từ chối`: editable, upload/remove attachment enabled
- `Chờ duyệt`: readonly, upload/remove disabled
- `Đã duyệt`: readonly, download attachment enabled
- all states: history visible

Readonly behavior:
- readonly fields must render consistently
- do not remove data visibility in readonly mode
- disable actions rather than silently hiding core data

Interaction behavior:
- Save Draft does not change workflow state
- Submit changes state to `Chờ duyệt`
- Upload attachment does not submit workflow
- Upload success reloads attachment list
- Upload failure preserves form data
- Same filename creates a new attachment record
- Attachment list sorted by upload time descending
- History sorted by timestamp descending

Validation behavior:
- required planning fields
- valid equipment
- valid file type
- valid file size
- submit enabled only when data is valid
- attachment mandatory only if FRD says mandatory

Reusable shared logic:
- `isPlanningEditable`
- attachment rules
- audit log renderer
- validation helpers
- permission helpers

Mock data requirements:
- detail with attachments
- detail without attachments
- multiple equipment
- history log
- upload failure
- duplicate filename upload
- readonly state examples

Codex notes:
- Do not merge detail and approval logic unless existing pattern already does so.
- Keep workflow actions state-driven.
- Keep audit/history readonly.


## 4.3 SCR-PLAN-003 — Tạo mới kế hoạch CBM

Purpose:
- Create manual CBM planning record.
- Select equipment.
- Upload attachment.
- Save as `Nháp`.
- Submit to `Chờ duyệt`.

Layout:
- DSPage
- DSPageHeader
- DSPageTitle
- DSPageActions
- Planning create form
- Equipment selection section
- Selected equipment table
- Attachment section
- Action bar

DS components to reuse:
- DSFormField
- DSButton
- DSDataTable
- DSFilter/Search input
- DSAttachment/Upload pattern
- DSStatusBadge
- DSStateEmpty

Lifecycle handling:
- initial workflow state = `Nháp`
- after submit = `Chờ duyệt`
- after submit, form becomes readonly

Readonly behavior:
- create form is editable before submit
- submit disables when data invalid
- upload/remove disabled after submit success

Interaction behavior:
- Add Equipment reloads selected equipment list
- Remove Equipment reloads selected equipment list
- Duplicate equipment blocked
- Equipment search limited by permission scope
- Upload attachment does not submit workflow
- Upload failure preserves form data

Validation behavior:
- required fields
- valid equipment
- no duplicate equipment
- valid file type
- valid file size
- submit only when required data is valid

Reusable shared logic:
- create planning validation
- equipment selection helper
- duplicate equipment checker
- permission helpers
- attachment rules

Mock data requirements:
- equipment list
- permission-scoped equipment
- duplicate equipment case
- empty equipment case
- valid create case
- invalid create case

Codex notes:
- Do not create separate lifecycle states for create flow.
- Use same attachment behavior as detail screen.
- Use shared form validation.


## 4.4 SCR-PLAN-004 — Import kế hoạch CBM

Purpose:
- Upload Excel file.
- Validate template/file format.
- Start import validation.
- Open review flow using existing DS import pattern.

Implementation mode:
- Launch from `/planning`
- Use `DSImportFileDialog`
- Do not create dedicated import route unless later explicitly required for resumable or long-running workflow.

Layout:
- Dialog header
- Upload area
- Template download action
- Validation result panel
- Action bar

DS components to reuse:
- DSImportFileDialog
- DSButton
- DSAlert/Error panel
- DSStateLoading
- DSStateError

Lifecycle handling:
- import creates planning workflow only after confirm import
- successful import creates records in `Nháp`

Interaction behavior:
- upload starts uploading state
- uploading disables upload action
- upload success runs validation
- validation pass opens `DSImportReviewDialog` flow for SCR-PLAN-005
- upload failure does not create valid ImportSession
- cancel import stops session before confirm

Validation behavior:
- file must match template
- file format must be supported
- validation failure blocks preview/confirm

Loading/error/empty states:
- empty upload prompt
- uploading state
- validation error
- upload error

Reusable shared logic:
- import session type
- file validation helper
- mock import service

Mock data requirements:
- valid file
- invalid template
- unsupported file type
- upload failure
- validation failure

Codex notes:
- Do not implement real Excel parsing unless requested.
- Use typed mock validation response.
- Do not implement partial import here.


## 4.5 SCR-PLAN-005 — Preview dữ liệu import

Purpose:
- Preview import rows.
- Edit invalid rows.
- Revalidate data.
- Confirm import only when all rows are valid.

Implementation mode:
- Use `DSImportReviewDialog`
- Use `DSImportReviewTable`
- Keep Screen ID traceability even when implemented as dialog-based flow.

Layout:
- Dialog header
- Import summary
- Preview table
- Validation panel
- Action bar

DS components to reuse:
- DSImportReviewDialog
- DSImportReviewTable
- DSFormField / inline editable cell pattern
- DSAlert
- DSButton
- DSStatusBadge
- DSStateEmpty
- DSStateLoading

Lifecycle handling:
- Confirm Import creates planning records in `Nháp`
- invalid rows do not create records

Interaction behavior:
- edit row triggers row-level revalidation
- invalid rows highlighted
- remove invalid row updates validation state
- confirm import disabled if any invalid row exists
- import processing disables edit and confirm

Validation behavior:
- mandatory fields
- edited row validation
- invalid rows block confirm
- all rows must be valid before confirm

Loading/error/empty states:
- validation error state
- import processing state
- empty preview state

Reusable shared logic:
- import row validation
- import summary calculation
- confirm enablement helper

Mock data requirements:
- 30+ preview rows
- valid rows
- invalid rows
- mixed rows
- row-level errors
- import processing case

Codex notes:
- Do not allow partial import unless later confirmed.
- Keep confirm gating deterministic.
- Use row-level validation display.


## 4.6 SCR-PLAN-006 — Duyệt kế hoạch CBM

Purpose:
- Allow GĐXN to approve or reject planning in `Chờ duyệt`.

Layout:
- DSPage
- DSPageHeader
- DSPageTitle
- DSPageActions
- Planning summary
- Workflow information
- Approval action panel
- Reject reason dialog/input

DS components to reuse:
- DSSection
- DSStatusBadge
- DSButton
- DSDialog or DSModal
- DSFormField
- DSStateError
- DSStateLoading

Lifecycle handling:
- only `Chờ duyệt` enables approval actions
- approve => `Đã duyệt`
- reject => `Từ chối`
- after success reload workflow state
- after success disable approval actions

Readonly behavior:
- planning information readonly on approval screen
- approval actions hidden/disabled for non-GĐXN

Interaction behavior:
- approve changes status to `Đã duyệt`
- reject requires reason
- reject changes status to `Từ chối`
- failure preserves current state

Validation behavior:
- reject reason required
- only GĐXN can approve/reject
- only state `Chờ duyệt` can be approved/rejected

Loading/error/empty states:
- loading state
- approval failure
- empty approval item

Reusable shared logic:
- approval permission helper
- reject reason validation
- workflow transition mapping

Mock data requirements:
- pending approval record
- approved record
- rejected record
- reject without reason
- approval failure
- unauthorized role

Codex notes:
- Do not expose approval actions to NVTN.
- Do not approve/reject outside `Chờ duyệt`.
- Do not skip reject reason.


## 4.7 SCR-PLAN-007 — Đồng bộ kế hoạch từ PMIS

Purpose:
- Trigger PMIS planning sync UI.
- Display sync result.
- Display integration logs.

Layout:
- DSPage
- DSPageHeader
- DSPageTitle
- DSPageActions
- Sync parameter area
- Sync action area
- Sync result summary
- Integration log table
- Error state

DS components to reuse:
- DSFormField
- DSButton
- DSDataTable
- DSAlert
- DSStateLoading
- DSStateError

Lifecycle handling:
- PMIS sync provides planning data into MSM
- MSM owns planning workflow after data is saved
- sync must not auto-approve or auto-submit planning

Interaction behavior:
- start sync sets processing state
- processing disables sync action
- success shows summary
- failure shows error and log
- sync result does not bypass workflow

Validation behavior:
- invalid sync condition blocks sync
- missing required sync condition shows validation error

Loading/error/empty states:
- processing state
- sync failure
- empty log
- data load failure

Reusable shared logic:
- PMIS sync mock service
- integration log table
- permission helper
- sync result model

Mock data requirements:
- successful sync
- failed sync
- PMIS unavailable
- duplicate data case
- empty sync result
- mixed success/failure logs

Codex notes:
- Do not implement PMIS ownership logic.
- Do not sync data back to PMIS.
- Do not create hidden workflow transitions.


## 5. Mock Data Requirements

Minimum dataset:
- 50 planning records
- 80 equipment records
- 30 attachment records
- 30 import preview rows
- 100 audit log records
- 20 PMIS sync logs

Required planning statuses:
- Nháp
- Chờ duyệt
- Đã duyệt
- Từ chối

Required planning sources:
- PMIS
- Manual
- Import

Required edge cases:
- planning without attachment
- planning with multiple attachments
- planning with no equipment before submit
- duplicate equipment
- duplicate attachment filename
- upload failure
- invalid import row
- mixed valid/invalid import rows
- reject without reason
- PMIS sync failure
- empty search result
- readonly workflow state

Use:
- realistic IDs
- realistic Vietnamese organization names
- realistic timestamps
- realistic equipment codes
- realistic user names
Mock data placement:
- Prefer the existing repository mock-data convention if already established.
- If the repository uses feature-local data folders, place Planning mock data near the Planning feature.
- Otherwise, use `mock-data/planning`.



## 6. Suggested File Structure

```txt
app/
  planning/
    page.tsx
    create/
      page.tsx
    sync-pmis/
      page.tsx
    [planId]/
      page.tsx
      approval/
        page.tsx

components/
  planning/
    PlanningFilterBar.tsx
    PlanningTable.tsx
    PlanningStatusBadge.tsx
    PlanningDetailForm.tsx
    PlanningCreateForm.tsx
    EquipmentSelector.tsx
    SelectedEquipmentTable.tsx
    AttachmentManager.tsx
    PlanningHistoryLog.tsx
    PlanningApprovalPanel.tsx
    RejectReasonDialog.tsx
    PlanningImportDialog.tsx
    PlanningImportReviewDialog.tsx
    PlanningImportReviewTable.tsx
    ImportValidationPanel.tsx
    PmisSyncPanel.tsx
    IntegrationLogTable.tsx

lib/
  planning/
    planning-types.ts
    planning-status.ts
    planning-lifecycle.ts
    planning-permissions.ts
    planning-validation.ts
    planning-filters.ts
    planning-mock-service.ts

mock-data/
  planning/
    planning-records.ts
    equipment-records.ts
    attachment-records.ts
    import-preview-rows.ts
    planning-audit-logs.ts
    pmis-sync-logs.ts
```

Before creating files:
- inspect existing repository structure
- reuse existing folders/components if already present
- avoid duplicate abstractions


## 7. Codex Execution Notes

Follow this order:

1. Inspect existing DS components.
2. Inspect existing app shell/layout.
3. Inspect existing table/filter patterns.
4. Create shared planning types/constants.
5. Create lifecycle and permission helpers.
6. Create typed mock data.
7. Implement shared Planning foundation first, then implement Planning flows incrementally by dependency and Screen ID traceability.

Recommended order:
   1. Shared Planning foundation
   2. SCR-PLAN-001 list
   3. SCR-PLAN-002 detail
   4. SCR-PLAN-003 create
   5. SCR-PLAN-004/SCR-PLAN-005 import dialog flow
   6. SCR-PLAN-006 approval
   7. SCR-PLAN-007 PMIS sync

8. Verify readonly/editable behavior.
9. Verify validation behavior.
10. Run lint/type/build checks if available.

Do not:
- redesign UI
- create new DS system
- invent API routes
- invent workflow states
- invent permissions
- implement partial import
- auto-submit after upload
- auto-approve after sync
- overwrite attachment with same filename

Preserve:
- Screen IDs
- Vietnamese business labels
- centralized lifecycle logic
- centralized permission logic
- existing DS usage


## 8. Acceptance Checklist

Shared foundation:
- [ ] Planning statuses centralized
- [ ] Status labels mapped correctly
- [ ] Permission helpers centralized
- [ ] Validation helpers centralized
- [ ] Mock data typed
- [ ] No duplicated lifecycle logic

SCR-PLAN-001:
- [ ] Table renders required columns
- [ ] Filters work
- [ ] Filter change resets pagination
- [ ] Sorting works
- [ ] Row click opens detail
- [ ] Empty/loading/error states exist

SCR-PLAN-002:
- [ ] Editable states allow update
- [ ] Readonly states disable update
- [ ] Attachment upload works
- [ ] Same filename creates new record
- [ ] History log displays
- [ ] Submit changes state to `Chờ duyệt`

SCR-PLAN-003:
- [ ] New plan starts as `Nháp`
- [ ] Equipment can be added/removed
- [ ] Duplicate equipment blocked
- [ ] Submit disabled until valid
- [ ] Upload failure preserves data

SCR-PLAN-004:
- [ ] Upload area works
- [ ] Uploading disables actions
- [ ] Invalid file shows error
- [ ] Valid upload opens preview

SCR-PLAN-005:
- [ ] Preview table renders rows
- [ ] Invalid rows highlighted
- [ ] Confirm disabled when invalid rows exist
- [ ] Row edit revalidates data
- [ ] Import processing disables edit/confirm

SCR-PLAN-006:
- [ ] Only GĐXN can approve/reject
- [ ] Reject reason required
- [ ] Approve changes state to `Đã duyệt`
- [ ] Reject changes state to `Từ chối`
- [ ] Actions disabled after success

SCR-PLAN-007:
- [ ] Sync action shows processing
- [ ] Success summary displays
- [ ] Failure state displays
- [ ] Integration log displays
- [ ] Sync does not bypass MSM workflow

Final checks:
- [ ] Existing DS patterns reused
- [ ] Existing app shell preserved
- [ ] No hardcoded workflow logic in components
- [ ] No invented API behavior
- [ ] No hidden automation
- [ ] Lint/type/build checks pass where available

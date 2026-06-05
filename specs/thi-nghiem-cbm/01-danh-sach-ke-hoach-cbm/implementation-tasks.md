# Implementation Tasks: Danh sách kế hoạch CBM

## Scope

### In Scope

- Build the frontend list screen for `Theo dõi kế hoạch CBM`.
- Render the layout from the Feature Spec ASCII wireframe: app shell, page header, page actions, filter panel, bulk action bar, data table, and pagination.
- Use the API Contract shape for list query, filter options, response item fields, pagination metadata, available actions, delete, bulk delete, transfer, and export.
- Use typed mock/API adapter data until real backend endpoints are available.
- Implement search/filter reload behavior, page reset on filter changes, base-1 pagination, column visibility, row selection, row actions, bulk delete validation, confirmations, loading/error/empty/no-result states, and success/error feedback.

### Out of Scope

- Create-plan popup implementation (PBI 02).
- Import Excel flow implementation (PBI 03).
- PMIS sync flow implementation (PBI 04).
- Detail/update popup implementation (PBI 05), except rendering entry actions/placeholders required by the list screen.
- Server persistence of column visibility; column visibility is local UI state only.
- Sort support.

## Planned Files

| Type | Path | Notes |
| --- | --- | --- |
| Page | `app/thi-nghiem-cbm/ke-hoach-cbm/page.tsx` | Proposed route for the list screen; confirm route before implementation if navigation contract exists elsewhere. |
| Components | `components/thi-nghiem-cbm/ke-hoach-cbm/plan-list-page.tsx` | Main client composition for shell content, filters, table, dialogs, and feedback. |
| Components | `components/thi-nghiem-cbm/ke-hoach-cbm/plan-filter-toolbar.tsx` | Search, date range, status, unit, location, reset, and page actions using DS wrappers. |
| Components | `components/thi-nghiem-cbm/ke-hoach-cbm/plan-table.tsx` | DSDataTable columns, status badge rendering, available action mapping, selection, column visibility, and pagination. |
| Types | `types/thi-nghiem-cbm/cbm-plan.ts` | API/list item, status, source, available action, filter option, query, response, mutation result types. |
| Mock data | `mock-data/thi-nghiem-cbm/cbm-plans.ts` | Typed enterprise mock records, filter options, and mock API behavior covering edge cases. |
| API adapter | `lib/thi-nghiem-cbm/api/cbm-plans.ts` | Mock-backed module API functions matching `api-contract.md`; no raw HTTP in components/hooks. |
| Hooks/state | `hooks/thi-nghiem-cbm/use-cbm-plan-list.ts` | UI orchestration for query state, loading/error, filters, pagination, mutations, selection, and reload. |
| Helpers | `lib/thi-nghiem-cbm/cbm-plan-list.ts` | Date formatting, current range, visible-column export payload, status badge tone mapping, action mapping helpers. |

## Execution Order

1. FND — Foundation/data/contract setup
2. STATE — Hook and state orchestration
3. UI — Static layout and DS composition
4. BIND — Bind data/actions to UI
5. ACT — Mutations, confirmations, and feedback
6. EDGE — Edge states and validation states
7. VERIFY — Verification

## Tasks

### FND — Foundation

- [x] FND-01 Define `CbmPlanStatus`, `CbmPlanSource`, `CbmPlanAvailableAction`, `CbmPlanListItem`, `CbmPlanListQuery`, `CbmPlanListResponse`, mutation result, and filter option types from `api-contract.md`.
- [x] FND-02 Define status values, labels, and badge tone mapping for `draft`, `pendingDirectorApproval`, `approved`, `rejected`, and `transferredToExecution`.
- [x] FND-03 Define available action keys and labels for view detail, edit, delete, transfer to execution, export, create, import, and PMIS entry actions.
- [x] FND-04 Create date/current-range helpers for `YYYY-MM-DD`, ISO datetime with timezone, `dd/MM/yyyy`, `dd/MM/yyyy HH:mm`, current-month defaults, and base-1 pagination ranges.
- [x] FND-05 Create typed mock CBM plan records covering all statuses, long text, serial numbers, source values, 0/1/50/200+ list sizes, invalid bulk selection, mutation failure, timeout/system error, and empty/no-result cases.
- [x] FND-06 Create typed mock filter options for PMIS managing units and locations loaded by a separate filter options API.
- [x] FND-07 Implement mock-backed module API functions matching `api-contract.md`: `listCbmPlans`, `getCbmPlanFilterOptions`, `deleteCbmPlan`, `bulkDeleteCbmPlans`, `transferCbmPlanToExecution`, and `exportCbmPlans`.
- [x] FND-08 Ensure mock `listCbmPlans` applies keyword, date, status, unit, location, base-1 page, and page size 50; do not implement sort.

### STATE — State

- [x] STATE-01 Create `useCbmPlanList` with query state for `keyword`, `executionDateFrom`, `executionDateTo`, `status`, `managingUnitId`, `locationId`, `page`, and `pageSize`.
- [x] STATE-02 Load filter options separately and load the first list page on screen open using the current-month default date range and page 1.
- [x] STATE-03 Implement search/filter/date updates that preserve entered values, reset page to 1, clear selection, and reload the list.
- [x] STATE-04 Implement base-1 pagination state and reload behavior while preserving current filters.
- [x] STATE-05 Track selected row IDs, selected rows, visible columns, delete target, bulk delete intent, transfer target, loading states, mutation states, and errors.
- [x] STATE-06 Add hook methods for reset filters, clear selection, single delete, bulk delete, transfer to execution, and export current list/filter/visible columns.

### UI — Layout

- [x] UI-01 Create the route page that renders the CBM plan list page under the proposed module route.
- [x] UI-02 Compose `DSAppShell`, breadcrumbs, `DSPage`, `DSPageBody`, and `DSListPageCard` to match the wireframe page shell and list surface.
- [x] UI-03 Render page title `Theo dõi kế hoạch CBM`, description, current range text, and page actions `Import`, `PMIS`, `Tạo mới`, and `Export`.
- [x] UI-04 Build the filter toolbar with search, `DSDateRangeFilter`, status select, unit select, location select, and `Đặt lại`.
- [x] UI-05 Build `DSBulkActionBar` that appears only when `selectedRowIds.length > 0` and includes destructive `Xóa nhiều kế hoạch`.
- [x] UI-06 Build `DSDataTable` with row selection, hideable columns, empty/no-result copy, loading, error, row actions, footer pagination, and no sort columns.
- [x] UI-07 Render table columns: mã thiết bị, tên thiết bị, vị trí, đơn vị quản lý, ngày thực hiện, trạng thái, nguồn tạo, thời gian cập nhật, and actions.
- [x] UI-08 Render status badges for all five CBM plan statuses using `DSStatusBadge` and local tone mapping.

### BIND — Binding

- [x] BIND-01 Bind hook query state and handlers to the filter toolbar, including current-month date defaults and invalid date feedback.
- [x] BIND-02 Bind list response items, total, page, pageSize, loading, error, filtered/no-result state, selection state, and visible columns to `DSDataTable`.
- [x] BIND-03 Render `Mã thiết bị` as a link/action entry point to the out-of-scope detail flow without implementing detail behavior.
- [x] BIND-04 Build row actions from BE-provided `items[].availableActions`; do not enable actions outside that response list.
- [x] BIND-05 Bind `DSBulkActionBar` selected count and disabled/prevented bulk delete behavior when any selected row is not status `draft`.
- [x] BIND-06 Bind export to current filters and currently visible columns.

### ACT — Actions

- [x] ACT-01 Render create/import/PMIS/detail/edit entry points as placeholders or disabled/no-op actions because their flows are out of scope.
- [x] ACT-02 Show `DSConfirmDialog` for single delete and call the delete API adapter on confirm.
- [x] ACT-03 Show `DSConfirmDialog` for bulk delete and call the bulk delete API adapter only when all selected rows are status `draft`.
- [x] ACT-04 Implement transfer-to-execution row action for rows whose `availableActions` include transfer; call the transfer API adapter and reload on success.
- [x] ACT-05 Implement export action through the API adapter with current filters and visible columns.
- [x] ACT-06 Show success toast and reload list after successful delete, bulk delete, transfer, or export as applicable.
- [x] ACT-07 Show error toast/state and preserve current data/filter values after mutation failure.

### EDGE — Edge States

- [x] EDGE-01 Display table loading state for initial load, search, filter, pagination, and mutation-triggered reloads.
- [x] EDGE-02 Display empty state when there is no initial data and no active filters.
- [x] EDGE-03 Display no-result state when active search/filter returns no rows.
- [x] EDGE-04 Display invalid date validation before reload/export and preserve entered date values.
- [x] EDGE-05 Display system/API error state for list timeout, empty unexpected response, permission/scope error, and mutation failure.
- [x] EDGE-06 Verify long device codes, long device names, long units, and long locations do not break table layout or overlap actions.

### VERIFY — Verification

- [x] VERIFY-01 Run `npm run lint`.
- [x] VERIFY-02 Run `npm run typecheck`.
- [x] VERIFY-03 Run `npm run build` if practical.
- [x] VERIFY-04 Manually verify desktop layout against ASCII wireframe: header/actions, filter panel, bulk action bar, table columns, row actions, and pagination.
- [x] VERIFY-05 Manually verify responsive layout for filter wrapping, table overflow, action menus, and no text overlap.
- [x] VERIFY-06 Verify contract coverage against `feature-spec.md` and `api-contract.md`: search/filter, pagination base 1, `availableActions`, `serialNumber`, filter options API, export behavior, date formats, delete/bulk validation, and error states.

## Coverage

| Spec / Contract Item | Task |
| --- | --- |
| ASCII wireframe regions | UI-02, UI-03, UI-04, UI-05, UI-06, UI-07 |
| Search by device code/name/serial number | FND-08, STATE-03, BIND-01 |
| Date/status/unit/location filters | FND-04, FND-06, FND-08, STATE-02, STATE-03, UI-04, BIND-01 |
| Table columns and `serialNumber` response | FND-01, FND-05, UI-06, UI-07, BIND-02 |
| BE-provided `availableActions` | FND-01, FND-05, BIND-04, ACT-02, ACT-03, ACT-04 |
| Bulk delete invalid selection | FND-07, STATE-05, BIND-05, ACT-03, EDGE-05 |
| Delete/bulk delete confirmation and feedback | ACT-02, ACT-03, ACT-06, ACT-07 |
| Transfer to execution | FND-07, BIND-04, ACT-04, ACT-06, ACT-07 |
| Export current list/filter/visible columns | FND-07, STATE-06, BIND-06, ACT-05 |
| Column visibility local only | STATE-05, UI-06, BIND-02, BIND-06 |
| Empty/no-result/loading/error states | UI-06, BIND-02, EDGE-01, EDGE-02, EDGE-03, EDGE-05 |
| Invalid date behavior | FND-04, STATE-03, EDGE-04 |
| Pagination base 1 and pageSize 50 | FND-04, FND-08, STATE-04, BIND-02 |

## Open Items

| Item | Owner | Impact |
| --- | --- | --- |
| Confirm proposed route `app/thi-nghiem-cbm/ke-hoach-cbm/page.tsx` if navigation already has a different target. | FE/PO | Affects final route path and navigation wiring. |
| Screen ID, Feature Spec status, owner, and last updated are still TBD. | BA | Metadata only; does not block FE implementation. |
| Assumed CBM Plan Lifecycle Rules are not yet BA/BE-approved as shared lifecycle rules. | BA/BE | FE can implement current list behavior using `availableActions`, but shared lifecycle constants may need adjustment later. |
| Real backend endpoints and HTTP methods are not specified. | BE | FE should implement mock-backed module API adapter and keep raw HTTP out of components/hooks until endpoints are confirmed. |

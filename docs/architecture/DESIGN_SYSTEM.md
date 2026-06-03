# Design System

This project is a Next.js + Tailwind CSS + shadcn foundation using the existing shadcn preset in `components.json`.

- Style: `radix-vega`
- Base color: `taupe`
- CSS variables: enabled
- Icon library: `hugeicons`
- App route playground: `/system`

Do not replace `app/globals.css`, reset the theme, or introduce legacy palette colors. Build product UI from `components/ds` first, and use `components/ui` as the low-level shadcn primitive layer.

## Project Structure

```txt
app/
  globals.css                 # Preset tokens and Tailwind theme mapping. Do not reset.
  layout.tsx                  # Font variables and app shell providers.
  system/
    page.tsx                  # Playground composition only.
    _components/              # Playground example sections.
    _data/demo-data.ts        # Playground-only demo data.

components/
  ui/                         # Generated shadcn primitives.
  ds/                         # Design-system wrappers and enterprise patterns.
    index.ts                  # Public DS exports.

lib/
  utils.ts                    # cn helper.
```

## DS vs UI Import Policy

Product screens should import from `@/components/ds` when a DS abstraction exists.

Use `@/components/ui` directly only when:

- building or maintaining DS components,
- composing a low-level primitive that has not been wrapped yet,
- using shadcn primitives that are intentionally not abstracted.

Do not re-export every raw UI primitive from `components/ds/index.ts`. The DS boundary should stay clear: DS wrappers encode product conventions, while `components/ui` remains the primitive toolbox.

Recommended product import:

```tsx
import { DSButton, DSCard, DSDataTable } from "@/components/ds"
```

Recommended DS implementation import:

```tsx
import { Button } from "@/components/ui/button"
```

## App Shell and Header

Use `DSAppShell` for authenticated product screens. It owns the sidebar, sticky global app bar, and scroll containment.

`DSAppHeader` is the compact global top bar. It should not render large page titles or page-specific actions. Its left side renders breadcrumbs when provided, with `pageTitle` as a fallback.

```tsx
<DSAppShell
  pageTitle="Edit user"
  breadcrumbs={[
    { label: "Users", href: "/demo/users" },
    { label: "Edit user" },
  ]}
>
  {children}
</DSAppShell>
```

Header rules:

- Use breadcrumbs for global app context.
- Keep the top-bar search as global workspace search through `DSGlobalSearch`. `DSAppHeader` exposes `globalSearchPlaceholder`, `globalSearchValue`, `onGlobalSearchChange`, `onGlobalSearchSubmit`, and `recentSearchKeywords`.
- Use `DSHelpMenu` for the header help action. Keep items lightweight until real help, training, policy, and feedback routes exist.
- Use `DSNotificationPopover` for the header notification action. The badge count is derived from unread notifications, notification clicks can mark individual items read, and Mark all as read clears the unread badge.
- The notification popover is for recent activity only; add a full notifications page later when product scope requires it.
- Put page-specific search, filters, and table tools inside page toolbars such as `DSFilterBar` or `DSListPageCard.toolbar`.
- Keep page content titles/actions in `DSPageHeader` or `DSListPageCard`, not in `DSAppHeader`.
- The sidebar owns user/avatar UI; do not add avatar menus to the app header.

## Token Usage Rules

Use Tailwind classes mapped to existing CSS variables. Do not hard-code hex, RGB, HSL, OKLCH, or legacy brand values in components.

Core tokens:

| Token class | Use |
| --- | --- |
| `bg-background`, `text-foreground` | Page background and primary text |
| `bg-card`, `text-card-foreground` | Cards and panel surfaces |
| `bg-popover`, `text-popover-foreground` | Dialogs, sheets, menus, select content |
| `border-border` | Standard dividers and container borders |
| `border-input` | Form control borders |
| `ring-ring`, `outline-ring` | Focus and interaction rings |
| `bg-primary`, `text-primary-foreground` | Primary actions and active emphasis |
| `bg-secondary`, `text-secondary-foreground` | Secondary actions and neutral emphasis |
| `bg-muted`, `text-muted-foreground` | Subtle surfaces, helper text, metadata |
| `bg-accent`, `text-accent-foreground` | Hover, selected, and soft emphasis states |
| `bg-destructive`, `text-destructive`, `border-destructive` | Error and destructive states |

DS semantic color references:

| Token | Value | Use |
| --- | --- | --- |
| `dsColors.operationalOrange` | `#ff7a5d` | EVN operational orange for pending, processing, operational waiting, and workflow continuation states |

Rules:

- Prefer token utility classes over direct `var(...)` usage in markup.
- Use opacity modifiers on token classes when needed, for example `border-destructive/40`.
- Keep custom layout classes token-based: border, background, text, ring, shadow, and radius should come from the current theme.
- Keep EVN-specific semantic colors in `components/ds/tokens.ts`; product pages should not hard-code `#ff7a5d`.
- Do not edit `app/globals.css` for component-level styling.

## Typography Setup

Font variables are configured in `app/layout.tsx` and mapped in `app/globals.css`.

| Utility | Font |
| --- | --- |
| `font-sans` | Space Grotesk |
| `font-heading` | Instrument Sans |
| `font-mono` | Geist Mono |

Usage:

- Use `font-heading` for page titles, section headings, KPI values, and strong hierarchy.
- Use `font-sans` for product UI, labels, inputs, body text, tables, and controls.
- Use `font-mono` only for IDs, code-like values, timestamps, and technical references.
- Keep admin screens compact and scannable.
- Do not introduce alternate font stacks in product components.

## Radius and Spacing

The preset defines radius through CSS variables. Keep enterprise UI restrained and avoid excessive rounding.

Use:

- `rounded-md` for compact controls and badges.
- `rounded-lg` for cards, filters, tables, and enterprise pattern containers.
- `rounded-xl` only for larger top-level surfaces when it already fits the preset.

Avoid:

- custom pixel radius values,
- decorative pill shapes for normal admin surfaces,
- page-level spacing that fights the DS page primitives.

Recommended layout patterns:

| Pattern | Classes |
| --- | --- |
| Page body | `mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6` |
| Section | `grid gap-4` or `grid gap-5` |
| KPI grid | `grid gap-4 md:grid-cols-2 xl:grid-cols-4` |
| Form group | `grid gap-2` |
| Action row | `flex flex-col gap-3 sm:flex-row sm:items-center` |

## DS Component List

Public exports live in `components/ds/index.ts`.

Base wrappers:

- `DSButton`
- `DSBulkActionBar`
- `DSBadge`
- `DSCard`, `DSCardHeader`, `DSCardTitle`, `DSCardDescription`, `DSCardContent`, `DSCardFooter`
- `DSInput`
- `DSSearchInput`
- `DSGlobalSearch`
- `DSTextarea`
- `DSAlert`
- `DSConfirmDialog`
- `DSHelpMenu`
- `DSIconButtonTooltip`
- `DSTooltip`
- `DSSheet`
- `DSBreadcrumb`
- `DSPagination`
- `DSCalendar`
- `DSSpinner`
- `DSToaster`
- `toastSuccess`, `toastError`, `toastInfo`, `toastWarning`

Form wrappers:

- `DSFormField`
- `DSSelectField`
- `DSDatePicker`
- `DSCheckboxField`
- `DSSwitchField`

Page and layout primitives:

- `DSPage`
- `DSPageHeader`
- `DSPageTitle`
- `DSPageDescription`
- `DSPageActions`
- `DSPageBody`
- `DSSection`
- `DSStack`
- `DSGrid`
- `DSActionBar`

Enterprise patterns:

- `DSKpiCard`
- `DSListPageCard`
- `DSStatusBadge`
- `DSFilterBar`
- `DSDataTable`
- `DSImportFileDialog`
- `DSImportReviewDialog`
- `DSImportReviewTable`
- `DSNotificationPopover`

State components:

- `DSStateLoading`
- `DSStateEmpty`
- `DSStateError`

`DSStateEmpty` wraps the shadcn Empty primitive from `components/ui/empty.tsx`. Product screens should use the DS wrapper rather than importing raw Empty primitives.

## Loading Indicators

Use `DSSpinner` as the standard loading indicator for async actions, compact loading states, and custom loading layouts. It wraps the shadcn spinner primitive while keeping product screens on the DS API.

```tsx
import { DSButton, DSSpinner } from "@/components/ds"

<DSSpinner size="sm" label="Loading accounts" />
<DSButton loading>Saving</DSButton>
```

Loading rules:

- Product pages should use `DSSpinner`, `DSButton loading`, or DS state components instead of custom `animate-spin` elements.
- Use `label` when the spinner is standalone and needs accessible loading text.
- Omit `label` when the spinner is decorative inside another component that already exposes loading state.
- Keep spinner color inherited from the current text color or token classes.

## Toast Notifications

Sonner is mounted once globally through `DSToaster` in `app/layout.tsx`. Product pages should use DS toast helpers from `@/components/ds` and should not import `sonner` directly.

```tsx
import { toastError, toastSuccess } from "@/components/ds"

toastSuccess("Settings saved", "Workspace configuration was updated.")
toastError("Unable to save", "Review the highlighted fields and try again.")
```

Toast rules:

- Use `toastSuccess` for completed user actions.
- Use `toastError` for validation or request failures.
- Use `toastInfo` for neutral system feedback.
- Use `toastWarning` for recoverable risks or attention states.
- Keep messages product-specific at the call site; the DS helper only standardizes the API.

## Feedback Convention

Use global Sonner toast for transient action feedback:

- save, create, and edit success
- status changes such as enable, disable, archive, and restore
- delete/archive completion
- non-blocking info and warning feedback
- validation submit failures that summarize field-level errors

Use inline feedback only for persistent page states:

- empty states through `DSStateEmpty`
- blocking errors through `DSStateError`
- persistent warnings or system notices through `DSAlert`
- field validation through `DSFormField error`

Product pages must use DS helpers such as `toastSuccess`, `toastError`, `toastInfo`, `toastWarning`, or `notifyStatusChange`. Do not import `sonner` directly in product pages, and do not use large inline success cards for transient save/status feedback.

## Confirmation Dialogs

Use `DSConfirmDialog` for destructive or status-changing actions before applying the change:

- disable or enable access
- delete, archive, or restore records
- submit actions that materially change workflow state

```tsx
<DSConfirmDialog
  open={confirmOpen}
  onOpenChange={setConfirmOpen}
  title="Disable user?"
  description="Mai Nguyen will no longer be able to access the workspace."
  confirmLabel="Disable user"
  variant="destructive"
  onConfirm={() => {
    disableUser()
    setConfirmOpen(false)
    notifyStatusChange({
      entity: "User",
      name: "Mai Nguyen",
      status: "disabled",
    })
  }}
/>
```

Keep confirmation UI in `DSConfirmDialog`; product pages should not import raw AlertDialog primitives for standard status/destructive confirmations. After a confirmed action succeeds, use global Sonner feedback through DS toast helpers or status helpers. Do not show large inline success messages for these transient outcomes.

`DSConfirmDialog` is the DS wrapper around the official shadcn AlertDialog primitives in `components/ui/alert-dialog.tsx`. Keep those primitives in the UI layer and compose product confirmation flows through `DSConfirmDialog`, including loading confirms. Use `variant="destructive"` for destructive actions and keep successful action feedback in global Sonner.

## Page and Layout Primitives

Use page primitives for new product screens instead of rebuilding page shells by hand.

```tsx
import {
  DSButton,
  DSPage,
  DSPageActions,
  DSPageBody,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
} from "@/components/ds"

export default function UsersPage() {
  return (
    <DSPage>
      <DSPageBody>
        <DSPageHeader density="default">
          <div>
            <DSPageTitle>Users</DSPageTitle>
            <DSPageDescription>
              Manage access, roles, and account status.
            </DSPageDescription>
          </div>
          <DSPageActions>
            <DSButton>Add user</DSButton>
          </DSPageActions>
        </DSPageHeader>
      </DSPageBody>
    </DSPage>
  )
}
```

Use `DSGrid`, `DSStack`, and `DSActionBar` for common responsive layout patterns. Keep page-level layout in the page and reusable behavior inside DS components.

For list/table-heavy pages, prefer `DSListPageCard` inside `DSPageBody width="full"` when vertical space matters. It replaces a separate large `DSPageHeader` by moving the list title, actions, toolbar, and table into one compact card.

```tsx
<DSPage className="h-full">
  <DSPageBody width="full" className="h-full min-h-0">
    <DSListPageCard
      scrollMode="table"
      title="Users"
      actions={<DSButton>Create user</DSButton>}
      toolbar={<DSFilterBar {...filterProps} />}
    >
      <DSDataTable scrollMode="body" {...tableProps} />
    </DSListPageCard>
  </DSPageBody>
</DSPage>
```

Use `DSListPageCard` for list/table-heavy pages only. It defaults to a compact no-description layout and tighter toolbar-to-table spacing to preserve vertical space for enterprise CRUD/list workflows. Render a description only when the screen is intentionally onboarding or explanatory by passing both `description` and `showDescription={true}`. Do not use it for create, edit, detail, or settings forms unless the screen is primarily a table workflow.

Dense list/table pages can opt into the Google Drive/Gmail-style sticky list pattern with `DSListPageCard scrollMode="table"` and `DSDataTable scrollMode="body"`. In this mode, the title, actions, filter toolbar, bulk action toolbar, and table header row remain visible while only table body rows scroll inside the table region. Pagination remains outside the row scroll area and visible at the bottom. Use this for dense list pages such as Users; do not apply it to create/edit/detail forms, dashboards, or import review spreadsheet dialogs. Avoid nested vertical scrollbars by giving the page/body/card chain `h-full min-h-0` when the list should own the vertical scrolling.

## Import File Dialog

Use `DSImportFileDialog` for CSV, XLSX, and other bulk import workflows. It wraps the shadcn Dialog primitive and standardizes short guidance, accepted formats, optional file size copy, selected file display, automatic upload after file selection, progress feedback, close confirmation during upload, and template download.

The standard import flow is:

1. Upload dialog: `DSImportFileDialog`
2. Large review dialog: `DSImportReviewDialog`
3. Confirm import with global Sonner feedback

Do not navigate to a route for simple import review. Use a route only for long-running, multi-step, or resumable import workflows. `DSImportFileDialog` handles upload only; it must not contain preview tables, module validation, or navigation decisions.

Product pages provide module-specific copy and handlers. Keep transient feedback in global Sonner through DS toast helpers:

```tsx
<DSImportFileDialog
  open={importOpen}
  onOpenChange={setImportOpen}
  title="Import người dùng"
  description="Tải lên danh sách người dùng để tạo hoặc cập nhật hàng loạt tài khoản hệ thống."
  acceptedFormats={["CSV", "XLSX"]}
  maxFileSizeLabel="Dung lượng tối đa: 10MB"
  templateLabel="Tải file mẫu người dùng"
  onDownloadTemplate={() => toastInfo("Đã bắt đầu tải file mẫu")}
  onUploadFile={async (file) => {
    await uploadUsers(file)
  }}
  onUploadComplete={(file) => {
    toastSuccess(
      "File đã được tải lên",
      `Vui lòng kiểm tra dữ liệu từ ${file.name} trước khi xác nhận import.`
    )
  }}
/>
```

Selecting a file starts upload automatically. The dialog remains open during upload, disables upload/download controls, and asks for confirmation if the user tries to close before completion. After completion, the dialog closes itself and product pages show global Sonner feedback from `onUploadComplete`. Do not add a separate upload button in product pages. Keep guidance below the file selector, such as accepted formats and maximum file size.

Use `DSImportReviewDialog` for the large review surface after upload. It provides a near full-screen modal with a compact header, title on the left, cancel/confirm actions on the right, a single vertical scroll flow through the dialog content, and optional close confirmation through `preventCloseWhenDirty`. Do not add a separate footer action area for standard import review flows.

Import review liveview uses a spreadsheet grid style. Use `DSImportReviewTable` for generic editable preview tables with visible grid lines, spreadsheet column letters, a row-index column, compact cells, horizontal scrolling, one vertical scroll experience, and cell-level error states. Header rows scroll naturally with the table content; only the row-index column may remain sticky on the left when horizontal scrolling is useful. Do not place standard form fields or large rounded inputs inside import review cells; editors should visually integrate into the cell. Invalid cells should highlight the cell itself and expose details through title/aria metadata, not inline validation text. Active cells use a 2px primary-token border around the full cell. Dropdown cells use spreadsheet-specific select behavior so the cell opens on first click, keeps a compact chevron inside the cell, and does not affect normal form selects or toolbar filters. Feature-specific columns, mock preview data, validation rules, and cell editors stay near the feature route, for example `app/demo/users/_components` and `app/demo/users/_data`.

```tsx
<DSImportReviewDialog
  open={reviewOpen}
  onOpenChange={setReviewOpen}
  title={`Rà soát dữ liệu import: ${fileName}`}
  confirmLabel="Xác nhận import"
  cancelLabel="Hủy"
  confirmDisabled={blockingErrors > 0}
  onConfirm={confirmImport}
>
  <UserImportReview rows={rows} onRowsChange={setRows} />
</DSImportReviewDialog>
```

`DSPageHeader` supports `density="default"` and `density="compact"`.

- Use `density="compact" titleSize="compact"` for list, table, and high-density dashboard pages. Do not render `DSPageDescription` for this pattern, and let compact mode hide the divider.
- Use `density="default"` for create, edit, detail, and settings pages. Include `DSPageDescription` and use the default divider.
- Avoid compact headers with descriptions unless a screen has a specific product need. This should be the exception, not the default detail-page pattern.
- Use `actionsAlign="top" | "center"` and `titleSize="default" | "compact"` when page headers need denser alignment without one-off page classes.
- Do not manually add header dividers, duplicate bottom padding, or page-specific description hiding in product pages. Prefer `DSPageHeader` props.

## Form Primitives

Use `DSFormField` when a control needs a label, description, required marker, or error message.

```tsx
<DSFormField
  htmlFor="workspace-name"
  label="Workspace name"
  description="Shown in internal dashboards and audit exports."
  required
>
  <DSInput id="workspace-name" placeholder="Enterprise Operations" />
</DSFormField>
```

`DSFormField` associates:

- `label` with `htmlFor`,
- description text with `aria-describedby`,
- error text with `aria-describedby`,
- invalid state with `aria-invalid`,
- required state with `aria-required`.

Use `DSCheckboxField` and `DSSwitchField` for repeated boolean settings. Use `DSTextarea` for multiline input.

Use `DSSelectField` for standard labeled form selects in product pages. It composes `DSFormField` with the shadcn Select primitive and keeps label, description, error, required, placeholder, disabled, and option rendering consistent.

Use `DSDatePicker` for product form dates. It composes `DSFormField`, the shadcn Calendar primitive, and Popover so product pages do not import raw Calendar for standard date picking.

```tsx
<DSDatePicker
  id="review-date"
  label="Review date"
  description="Used for SLA and audit reminders."
  value={reviewDate}
  onChange={setReviewDate}
  placeholder="Select review date"
/>
```

`DSCalendar` wraps the shadcn Calendar primitive for DS-level composition, demos, and future date-range filter patterns. Product forms should prefer `DSDatePicker`; future table date/date-range filters should be introduced as DS patterns instead of importing raw Calendar directly in product screens.

```tsx
<DSSelectField
  id="workspace-role"
  label="Workspace role"
  required
  value={role}
  onValueChange={setRole}
  placeholder="Select role"
  options={[
    { label: "Admin", value: "admin" },
    { label: "Approver", value: "approver" },
  ]}
/>
```

Product pages should use `DSSelectField` for standard form selects instead of importing raw shadcn Select primitives. Use raw Select only inside DS components or for custom composite controls that need behavior not covered by the wrapper.

Text inputs and textareas should receive explicit placeholders at the usage site. Keep placeholders short and action-oriented, such as `Enter email address` or `Add internal notes`. Do not rely on `DSInput`, `DSTextarea`, or `DSFormField` to generate placeholder text, and avoid placeholders that only duplicate the label.

Use `DSSearchInput` for page-level search fields. It standardizes the leading search icon, spacing, and accessibility label support while keeping `DSInput` generic for normal text entry. Product pages should not build one-off search inputs; page-specific search belongs in `DSFilterBar`.

Use `DSGlobalSearch` only for global workspace search in `DSAppHeader`. It shows recent keywords on focus, displays 5 items by default, expands to at most 12 items with Show more, and calls `onSearchSubmit` when a keyword is clicked or Enter is pressed. Do not use recent-keyword behavior for page filter search.

For complex composite controls, verify the generated DOM because `DSFormField` injects accessibility props by cloning its direct child.

## Feature Form Patterns

Business-specific reusable forms should stay route-local, close to the feature that owns the data model. For example, the Users module keeps shared create/edit sections in `app/demo/users/_components/user-form.tsx`.

Use this pattern when create and edit pages share fields, validation, and section structure:

- keep route-specific page titles, breadcrumbs, navigation, and toast copy in the page files,
- keep shared field sections and validation in the feature-local form component,
- keep DS components generic and do not move business-specific form logic into `components/ds`,
- use DS field primitives such as `DSFormField`, `DSSelectField`, `DSCheckboxField`, and `DSTextarea` inside feature forms.

CRUD form behavior:

- Create forms should disable the primary CTA until all required fields are valid.
- After create succeeds, reset field values, errors, and dirty state back to the initial/default form.
- Edit forms should disable the primary CTA until the form is dirty.
- After edit succeeds, reset the dirty baseline to the saved values so the CTA disables again.
- Use `useDirtyForm` from `hooks/use-dirty-form.ts` for generic baseline/dirty/reset behavior. Keep feature-specific fields and validation in the route-local form.

## DataTable API

`DSDataTable` is a generic column-driven wrapper over the shadcn table primitive.

```tsx
import type { DSDataTableColumn } from "@/components/ds"
import { DSDataTable, DSStatusBadge } from "@/components/ds"

type AccountRow = {
  id: string
  name: string
  email: string
  owner: string
  status: "active" | "pending" | "warning" | "error" | "success" | "neutral" | "inactive"
}

const columns: DSDataTableColumn<AccountRow>[] = [
  {
    key: "name",
    header: "Account",
    accessor: "name",
  },
  {
    key: "email",
    header: "Email",
    accessor: "email",
  },
  {
    key: "owner",
    header: "Owner",
    accessor: "owner",
  },
  {
    key: "status",
    header: "Status",
    accessor: "status",
    render: (value) => <DSStatusBadge status={value as AccountRow["status"]} />,
  },
  {
    key: "lastActive",
    header: "Last active",
    accessor: "lastActive",
    sortable: true,
    sortKey: "lastActive",
    sortDirection,
    onSortChange: (key, direction) => {
      setSortKey(key)
      setSortDirection(direction)
      setPage(1)
    },
  },
]

<DSDataTable
  columns={columns}
  data={rows}
  getRowAriaLabel={(row) => `Open account details for ${row.name}`}
  getRowHref={(row) => `/accounts/${row.id}`}
  getRowId={(row) => row.id}
  page={page}
  pageSize={50}
  totalItems={totalItems}
  onPageChange={setPage}
  pagination
  paginationPlacement="none"
  rowActions={(row) => [
    { key: "view", label: "Xem", icon: <Eye />, href: `/accounts/${row.id}`, quick: true },
    { key: "edit", label: "Chỉnh sửa", icon: <Pencil />, href: `/accounts/${row.id}/edit`, quick: true },
    { key: "download", label: "Tải về", icon: <Download />, onClick: () => downloadRow(row), quick: true },
    { key: "delete", label: "Xóa", icon: <Trash />, onClick: () => confirmDelete(row), variant: "destructive" },
  ]}
/>
```

Props:

| Prop | Purpose |
| --- | --- |
| `columns` | Column configs with `key`, `header`, `accessor`, optional `render`, `align`, and `className` |
| `data` | Row data |
| `getRowId` | Stable row key |
| `getRowAriaLabel` | Meaningful accessible label for clickable/linkable rows |
| `getRowHref` | Optional row destination for route-based detail pages |
| `onRowClick` | Optional row click handler; receives `{ disabled, href }` |
| `rowClickable` | Enables interactive row styling when click behavior is handled externally |
| `rowActions` | Preferred row action pattern; returns menu actions with optional quick icon actions |
| `renderActions` | Escape hatch for custom row action area; receives `{ disabled }` |
| `columns[].sortable` | Renders a keyboard-accessible sort control in the column header |
| `columns[].sortKey` | Stable key passed to `onSortChange`; defaults to `column.key` |
| `columns[].sortDirection` | Controlled sort state: `asc` or `desc` |
| `columns[].onSortChange` | Called with the sort key and next direction |
| `columns[].hideable` | Allows a column to appear in the visibility menu |
| `columns[].defaultVisible` | Initial uncontrolled visibility for hideable columns |
| `enableColumnVisibility` | Replaces the actions header text with a column visibility control |
| `visibleColumnKeys`, `onVisibleColumnKeysChange` | Optional controlled column visibility state |
| `columnVisibilityLabel` | Accessible label for the visibility control |
| `enableRowSelection` | Shows reusable row selection checkboxes |
| `selectedRowIds`, `onSelectedRowIdsChange` | Controlled selected row ids for bulk workflows |
| `getRowSelectionLabel` | Accessible checkbox label for row selection |
| `pagination` | Enables reusable pagination metadata and footer rendering when placement is `footer` |
| `paginationPlacement` | `footer`, `header`, or `none`; dense list pages use header placement through `DSRangePagination` in page actions |
| `page` | Current controlled page, starting at `1` |
| `pageSize` | Fixed rows-per-page value, defaulting to `50` |
| `totalItems` | Total count after filtering or server query |
| `onPageChange` | Called by Previous and Next controls |
| `loading` | Shows skeleton rows and screen-reader loading status |
| `loadingMessage` | Accessible loading text |
| `emptyTitle`, `emptyMessage` | Empty data title and description |
| `noResultsTitle`, `noResultsMessage` | Empty filtered/search result title and description |
| `isFiltered` | Switches the empty state from empty data copy to no-results copy |
| `emptyMessage` | Empty-state description |
| `error` | Shows `DSStateError` and associates it with the table region |

Dense enterprise list tables default to `50` rows per page. Do not show a rows-per-page selector by default; keep page size fixed until API-backed query state proves a screen needs user-controlled density.
| `disabled` | Reduces emphasis and disables cloned row actions where possible |

Table rules:

- Do not hard-code status columns inside `DSDataTable`; render `DSStatusBadge` through a column.
- Header rows use a subtle solid `bg-muted` tone by default. This separates column labels from body rows and keeps sticky table headers opaque while scrolling.
- In `scrollMode="body"`, `DSDataTable` keeps the table header row sticky inside the table scroll container while body rows scroll. The `stickyHeader` prop can override this when needed. Keep horizontal overflow on the same table container to avoid double scrollbars.
- Dense list pages use Gmail-style header pagination in the title/action row with `DSRangePagination`: `Hiển thị X-Y trên Z`, previous icon, and next icon. Render this pagination group before page action buttons such as import or create. Do not show page number buttons or a rows-per-page dropdown in dense table pages. Set `DSDataTable paginationPlacement="none"` when the range navigator is rendered in `DSListPageCard` actions.
- When row selection is enabled and one or more rows are selected, replace the list filter toolbar content with `DSBulkActionBar` in the same toolbar area. Do not render filters and bulk actions at the same time; keep the user's search/filter state intact and restore the filter toolbar when selection is cleared.
- `DSBulkActionBar` uses the same border, background, radius, padding, and control height rhythm as `DSFilterBar`; do not add a nested card, pill, or second background around selected-state actions.
- Bulk action controls are left-aligned directly after the selected-count text, separated by a compact vertical `border-border` divider. Do not push bulk actions to the far right.
- Bulk quick actions should show icon + visible text and follow this order when available: `Tải về`, `Vô hiệu hóa`, `Kích hoạt`, then the icon-only More menu. Do not include `Chỉnh sửa` as a bulk quick action because edit is a single-row contextual workflow.
- Keep sorting controlled in the parent. `DSDataTable` renders sort controls and icons only; pages or data hooks sort rows before pagination.
- Use sortable columns for dates, numbers, and important scan/comparison text. Sortable columns use only ascending and descending states; define a default sort when sorting is enabled. Up icon means ascending, down icon means descending.
- Use `renderLeading` on the first column when a list benefits from a leading avatar, thumbnail, or icon before the primary text. Keep the visual compact, decorative when possible, and token-based; future modules can use the same API for files, reports, assets, work orders, or customers.
- When row actions and `enableColumnVisibility` are used together, the final actions column header becomes the table-level column visibility control instead of showing `Actions`. The trigger uses a settings icon plus the visible label `Tùy chỉnh cột` for clarity. Body row actions remain unchanged.
- Use column visibility for wide enterprise/admin tables to reduce horizontal scroll. Keep identity/primary columns non-hideable; make secondary metadata columns hideable.
- Prefer `rowActions` for enterprise list actions. Default rows show only the vertical More menu. On row hover or keyboard focus, quick icon actions appear next to the More menu. The More menu shows the full action list with icon and text through shadcn `DropdownMenu`.
- Mark only common safe actions as `quick: true`, such as `Xem`, `Chỉnh sửa`, and `Tải về`. Destructive or high-risk actions, such as `Xóa`, must stay in the More menu and use `variant: "destructive"`. `DSTableRowActions` ignores quick rendering for destructive actions as a safety guard.
- In the More menu, destructive actions render after a `DropdownMenuSeparator` and use shadcn destructive menu item styling so the icon and text use destructive token emphasis.
- Keep status-changing actions such as `Vô hiệu hóa` or `Kích hoạt` in the More menu when they require confirmation.
- Icon-only quick action buttons must have accessible labels and hover/focus labels; `DSTableRowActions` uses the action `label` for `aria-label` and `DSIconButtonTooltip`.
- Keep the action column width stable so hover reveal does not resize columns or create table jitter.
- Row action controls stop event propagation so clicking buttons, menu items, or links inside the action cell does not trigger row navigation.
- For table readability and export-like scanning, avoid stacking email or secondary identity text inside the primary name cell when the data is important. Prefer separate `Người dùng` and `Email` columns; keep identity columns non-hideable unless a workflow explicitly needs to hide them.
- For scanability in dense enterprise tables, the first primary column may combine `avatar/icon/thumbnail + primary text`; keep the cell to one primary line by default.
- Avoid stacked secondary descriptions inside dense table cells unless a workflow absolutely requires them. Prefer separate columns for important metadata so it can be scanned, sorted, filtered, or exported independently.
- Use `getRowHref` for route-based detail pages. When a row is clickable or linkable, always provide `getRowAriaLabel`, such as `Open user details for Jane Cooper`, so keyboard and screen-reader users get a meaningful target.

## Icon Button Tooltips

Use `DSIconButtonTooltip` for icon-only buttons in headers, table actions, compact controls, and spreadsheet utilities. The wrapper uses the same shadcn tooltip visual language as collapsed sidebar hover labels: foreground background, background text, compact spacing, rounded corners, and the same animation behavior.

Rules:

- Tooltips appear on hover and keyboard focus.
- Tooltip text must match the button meaning, for example `Thông báo`, `Trợ giúp`, `Chuyển giao diện`, `Xem`, `Chỉnh sửa`, or `Tải về`.
- Tooltip content does not replace `aria-label`; keep `aria-label` on the actual button.
- Do not wrap normal text buttons unnecessarily.
- Keep icon-button tooltip styling centralized in `DSIconButtonTooltip`; do not create one-off tooltip styles in product pages.
- Use controlled pagination for list-heavy screens. Apply filtering and slicing in the page or data layer, then pass the visible rows to `data` and the filtered or server total to `totalItems`.
- Add sorting, row selection, and server-side loading conventions only when product requirements need them.

## List Query State

List-heavy CRUD pages should keep query state explicit and predictable before API integration. Use the Users list as the reference shape:

```ts
type ListQueryState = {
  search: string
  filters: Record<string, string>
  dateRange?: {
    value: string
    customRange?: {
      from?: Date
      to?: Date
    }
  }
  sortKey: string
  sortDirection: "asc" | "desc"
  page: number
  pageSize: number
  visibleColumns: string[]
}
```

Rules:

- Keep search, filters, date range, sorting, pagination, and column visibility controlled by the page or feature data hook.
- Reset `page` to `1` whenever `search`, `filters`, `dateRange`, `sortKey`, or `sortDirection` changes.
- Pagination totals must reflect the filtered result count, not the full unfiltered dataset.
- Apply filtering and sorting before pagination when working with local demo data.
- For API-backed lists, translate this shape into server query params before fetching.
- Add URL-backed query state before real API integration so list screens can be refreshed, shared, and restored without losing search/filter/sort/page state.
- Keep feature-specific filter keys in the feature route or data hook. Do not add module-specific query logic to DS components.

## FilterBar API

`DSFilterBar` is a controlled filter pattern for search, one or more select filters, and an action area.

```tsx
<DSFilterBar
  searchValue={search}
  onSearchChange={setSearch}
  searchPlaceholder="Search requests..."
  searchLabel="Search requests"
  primaryFilters={
    <DSDateRangeFilter
      label="Modified"
      value={modified}
      onValueChange={setModified}
      customRange={modifiedRange}
      onCustomRangeChange={setModifiedRange}
    />
  }
  filters={[
    {
      label: "Status",
      value: status,
      onValueChange: setStatus,
      placeholder: "Status: All",
      options: [
        { label: "All", value: "all" },
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      label: "Role",
      value: role,
      onValueChange: setRole,
      placeholder: "Role: All",
      options: [
        { label: "All", value: "all" },
        { label: "Approver", value: "approver" },
        { label: "Analyst", value: "analyst" },
      ],
    },
  ]}
  onClear={() => {
    setSearch("")
    setStatus("all")
    setRole("all")
    setModified("this-year")
    setPage(1)
  }}
  actions={<DSButton>Export</DSButton>}
/>
```

Props:

| Prop | Purpose |
| --- | --- |
| `searchValue`, `onSearchChange` | Controlled search input rendered with `DSSearchInput` |
| `searchPlaceholder`, `searchLabel` | Search hint and accessible label |
| `filters` | Array of controlled select filters for multi-filter toolbars |
| `filters[].label`, `filters[].value`, `filters[].onValueChange` | Filter label, selected value, and value change handler |
| `filters[].options` | Clean dropdown options |
| `filters[].placeholder` | Empty/default trigger text, usually `Label: All` |
| `primaryFilters` | Custom filter controls placed directly after search, commonly `DSDateRangeFilter` |
| `filterValue`, `onFilterChange`, `filterOptions` | Backward-compatible single-filter props |
| `filterPlaceholder`, `filterLabel`, `selectedValueLabel` | Backward-compatible single-filter hint and selected label prefix |
| `onClear`, `clearLabel`, `showClear` | Clear behavior and visibility |
| `disabled` | Disables input, select, clear button, and action nodes where possible |
| `loading` | Disables controls and marks the filter bar busy |
| `actions` or `children` | Custom action slot |

## Date Range Filters

Use `DSDateRangeFilter` for admin/list date filters such as Modified, Created date, Last active, Due date, and Updated at. The trigger always follows the `Label: Value` convention:

- `Modified: This year (2026)`
- `Created: Last 30 days`
- `Due date: 01/05/2026 to 31/05/2026`

Preset options close immediately. The custom date range flow opens two `DSDatePicker` fields and only closes after the user selects both dates and clicks Apply. Use `onCustomRangeChange` to store the selected range.

FilterBar rules:

- Treat it as a controlled component.
- Standard toolbar order is Search, date range filters, other filters, Reset, then secondary actions such as Export.
- Put date range filters in the main filter group via `primaryFilters`, not in the secondary `actions` area.
- Display selected toolbar filters as `Label: Value`, for example `Status: Active`, `Department: Operations`, or `Role: Analyst`. This keeps multi-filter admin screens clear when controls are compact.
- Keep dropdown options visually clean, such as `All`, `Active`, and `Pending`; `DSFilterBar` handles the selected trigger display convention.
- Reset clears all filters and search, and list pages should reset pagination to page `1` after any search or filter change.
- Keep URL synchronization, multi-select filters, and chips in the consuming screen until they become common enough for DS support.
- Provide meaningful labels because visible labels are intentionally screen-reader-only in this compact pattern.

## StatusBadge Semantics

Use `DSStatusBadge` for status values. It always includes text and can include a decorative dot.

Supported statuses:

| Status | Default label | Intended use |
| --- | --- | --- |
| `active` | Đang hoạt động | Currently enabled, live, or operating |
| `pending` | Đang chờ | In progress, operational waiting, workflow continuation, or processing; uses EVN operational orange (`#ff7a5d`) with white text and dot |
| `warning` | Cảnh báo | Needs attention, at risk, or approaching breach |
| `error` | Lỗi | Failed, blocked, rejected, or critical |
| `success` | Hoàn tất | Completed, passed, approved, or healthy result |
| `neutral` | Trung lập | Informational or uncategorized |
| `inactive` | Không hoạt động | Disabled, archived, paused, or not in use |

Rules:

- Do not rely only on color; keep text visible.
- Use `children` only when a domain-specific label is clearer than the fallback.
- Use `showDot={false}` when table density or layout makes the dot unnecessary.

## State Components

Use shared state components instead of one-off loading, empty, and error markup.

`DSStateLoading`:

- exposes `role="status"` or live-region semantics,
- includes accessible status text,
- hides decorative skeleton/spinner elements with `aria-hidden`.

`DSStateEmpty`:

- wraps the shadcn Empty primitive,
- uses semantic heading and description structure,
- supports optional icon and action content,
- is the standard state for no table results, no search results, empty modules, and missing content.

Do not use `DSStateEmpty` for transient loading, validation errors, or destructive failures. Use `DSStateLoading`, `DSFormField error`, or `DSStateError` for those states.

`DSStateError`:

- uses alert/live-region semantics,
- supports `id` for association with affected regions,
- supports optional action content.

Use these states in tables, KPI panels, filter-driven views, and page sections.

## Pagination Usage

Use `DSRangePagination` for dense list/table pages. Place it first in the `DSListPageCard` action area before page action buttons, keep the page size fixed at `50`, and render only range text plus previous/next icon buttons.

```tsx
<DSRangePagination
  page={page}
  pageSize={50}
  totalItems={totalItems}
  onPageChange={setPage}
/>
```

Guidelines:

- Format is `Hiển thị X-Y trên Z`.
- Keep disabled previous/next states visible and non-primary.
- Reset `page` to `1` when search, filter, date range, or sort changes.
- Pair pagination with URL-backed query state before real API integration.
- `DSPagination` remains available for simple non-table examples that need page numbers, but dense enterprise list pages should use `DSRangePagination`.

## Playground Structure

The local playground is available at:

```txt
http://localhost:3000/system
```

Files:

| File | Purpose |
| --- | --- |
| `app/system/page.tsx` | Clean composition file |
| `app/system/_components/overview-section.tsx` | Page header and KPI overview |
| `app/system/_components/primitives-section.tsx` | Page, form, alert, breadcrumb, tooltip, sheet, pagination examples |
| `app/system/_components/enterprise-patterns-section.tsx` | KPI, filter bar, status, and enterprise table examples |
| `app/system/_components/states-section.tsx` | Loading, empty, error, and disabled state examples |
| `app/system/_components/forms-section.tsx` | Form, dialog, dropdown, and control examples |
| `app/system/_components/table-section.tsx` | Tabbed table and component examples |
| `app/system/_data/demo-data.ts` | Demo-only records, statuses, KPI content, and table rows |

Playground rules:

- Keep `page.tsx` as composition only.
- Keep demo data out of component files when practical.
- Do not make playground examples the source of product abstractions.
- If an example pattern becomes useful for real screens, move it into `components/ds`.

## Quality Gate Commands

Run these before treating the DS foundation as ready for product work:

```bash
npm run typecheck
npm run lint
npm run build
```

Available scripts:

| Script | Command |
| --- | --- |
| `npm run dev` | `next dev --turbopack` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `eslint` |
| `npm run build` | `next build` |
| `npm run format` | `prettier --write "**/*.{ts,tsx}"` |

Expected readiness baseline:

- TypeScript passes with no errors.
- ESLint passes with no warnings requiring code changes.
- Production build succeeds and includes `/system`.
- No component changes require edits to `app/globals.css`.

## Development Rules

- Start product screens from DS page and layout primitives.
- Use `components/ds` for repeated product needs.
- Use `components/ui` directly only for local composition or new DS wrappers.
- Keep styles token-based and aligned to the existing preset.
- Add DS abstractions only when a pattern repeats or encodes product behavior.
- Keep accessibility states visible in component APIs: loading, empty, error, and disabled should be deliberate.
- Keep enterprise UI dense, predictable, and scannable.

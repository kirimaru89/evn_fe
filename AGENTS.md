# AGENTS.md

Project: MSM Portal — EVNNPC NPSC

Stack:
- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- Existing DS wrapper layer
- Enterprise admin/dashboard UI

Active modules:
- Admin: `admin`
- Portal MSM: `portal-msm`
- Thí nghiệm CBM: `thi-nghiem-cbm`

Supporting docs:
- Structure: `docs/architecture/PROJECT_STRUCTURE.md`
- Design system: `docs/architecture/DESIGN_SYSTEM.md`
- Feature spec template: `docs/templates/FEATURE_SPEC_TEMPLATE.md`
- Local external spec cache: `.specs/` (`.gitignore` ignored)

## Source Of Truth

Implementation priority:

1. Local synced spec in `.specs/<module>/`
2. Existing stable implementation patterns
3. Existing DS wrapper patterns
4. This `AGENTS.md`
5. New implementation

Feature Specs may live outside this repository and can be synced into `.specs/` for local agent access.

If the Feature Spec is unavailable or incomplete:
- do not invent business rules
- do not invent workflows, lifecycle states, APIs, permissions, or validations
- inspect existing implementation patterns
- mark unresolved assumptions explicitly

## React / Next.js Rules

For general React and Next.js implementation, use the local skill:

```txt
vercel-react-best-practices
```

Apply that skill when writing or reviewing:
- React components
- Next.js pages/layouts
- data fetching
- server/client component boundaries
- performance-sensitive code
- bundle-size-sensitive code

Do not duplicate generic React/Next.js best-practice rules in this file. This file only defines project-specific governance.

## Module Boundaries

Use Vietnamese slugs without accents for module folders and routes:

```txt
admin
portal-msm
thi-nghiem-cbm
```

Place module-specific code under the matching module folder:

```txt
app/<module>/
components/<module>/
hooks/<module>/
lib/<module>/
mock-data/<module>/
types/<module>/
.specs/<module>/
```

Shared code belongs in shared folders only when it is truly reused:

```txt
components/shared/
hooks/shared/
lib/shared/
types/shared/
```

Do not create empty architecture folders unless needed by the current implementation.

## Component And Layout Rules

Before creating any new UI component, inspect these folders first:

1. `components/ds/`
2. `components/shared/`
3. `components/ui/`
4. `components/<module>/`

Reuse or extend existing components before creating a new one.

Component priority:

1. Existing DS wrapper
2. Existing shared enterprise component
3. Raw shadcn primitive from `components/ui/`
4. New component

Rules:
- preserve existing app shell, sidebar, header, page layout, table, form, and status patterns
- use DS wrapper components first
- use Tailwind utilities aligned with DS tokens
- do not bypass DS wrappers unnecessarily
- do not create isolated styling systems
- do not introduce a new visual language
- do not hardcode colors, inline hex values, custom shadows, or custom spacing scales

Preferred DS components:

```txt
DSDataTable
DSFilterBar
DSStatusBadge
DSKpiCard
DSFormField
```

## Business Logic Rules

Business logic must be centralized, typed, deterministic, and traceable to the relevant spec.

Use:

```txt
lib/lifecycle/
lib/permissions/
lib/validation/
lib/mappings/
constants/workflow/
constants/status/
constants/permissions/
constants/navigation/
```

Do not:
- place business logic inside page files
- place lifecycle logic inside UI components
- hardcode workflow transitions
- hardcode permissions
- duplicate lifecycle logic
- duplicate validation logic
- duplicate status mappings

Readonly/editable behavior must derive from canonical lifecycle state and centralized permission logic.

Vietnamese workflow labels must remain unchanged:

```txt
Nháp
Chờ duyệt
Đã duyệt
Từ chối
```

## API Rules

Shared HTTP infrastructure belongs in:

```txt
lib/shared-api-client/
```

Module-specific backend endpoint functions belong in:

```txt
lib/<module>/api/
```

Dependency direction:

```txt
app / components
  -> hooks/<module>/
    -> lib/<module>/api/
      -> lib/shared-api-client/
```

Do not define raw backend HTTP requests directly in `app/`, `components/`, or hooks.

## Feature Spec Rules

Local synced specs live in:

```txt
.specs/<module>/
```

These specs are local-only because the original documents are stored outside this repository.

Spec filenames should preserve the use case or screen code when available:

```txt
.specs/thi-nghiem-cbm/CBM-UC-01.md
.specs/thi-nghiem-cbm/CBM-SCR-01.md
.specs/portal-msm/MSM-UC-01.md
.specs/admin/ADMIN-UC-01.md
```

Feature specs should include:
- user story
- description
- ASCII screen layout
- business rules
- field definitions and data source
- shared rule references
- related document links and section indexes
- acceptance criteria
- version and CR notes when applicable

Use `docs/templates/FEATURE_SPEC_TEMPLATE.md` as the standard format.

## UI State Rules

All async actions require visible loading and error states.

Required screen states:
- loading
- error
- empty
- no result
- success feedback after successful mutation

Validation behavior:
- validate before workflow transitions
- preserve entered data after validation failure
- show inline validation errors
- distinguish validation errors from integration/system errors
- do not auto-submit or auto-trigger workflow transitions

Attachment behavior:
- upload does not auto-submit workflow
- upload failure does not clear existing data
- duplicate filenames create new attachment records unless the spec says otherwise
- readonly state disables upload/remove actions but preserves viewing

## Mock Data Rules

Mock data belongs in:

```txt
mock-data/<module>/
```

Mock data must be:
- typed
- realistic for enterprise use
- large enough to exercise tables, filters, sorting, pagination, statuses, and edge cases

Include edge cases required by the feature spec, such as invalid rows, missing attachments, upload failure, readonly records, and validation failure.

## Implementation Workflow

Before implementation:

1. Read the relevant Feature Spec in `.specs/<module>/`.
2. Read `docs/architecture/PROJECT_STRUCTURE.md`.
3. Read `docs/architecture/DESIGN_SYSTEM.md` when touching UI.
4. Inspect existing module, shared, DS, lifecycle, permission, validation, and API patterns.
5. Use `vercel-react-best-practices` for React/Next.js implementation details.

Before creating new files:
- confirm the correct module boundary
- confirm no existing component/helper/API/type can be reused or extended
- keep changes localized

After implementation:
- run lint
- run type checks
- run build validation if practical
- report changed files, new files, architectural impact, and unresolved assumptions

Never finalize with:
- placeholder business logic
- invented workflow behavior
- invented API behavior
- undocumented assumptions
- inconsistent lifecycle handling
- hardcoded permissions
- hardcoded status mappings

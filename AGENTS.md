# Project Context

Project: MSM Portal — EVNNPC NPSC

Frontend Stack:
- NextJS App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- Existing DS wrapper layer
- Enterprise admin/dashboard UI

Current Governance Sources:
1. MASTER FRD
2. Domain FRD
3. FE Specs
4. Design System documentation

Current stabilized domains:
- Planning Domain

This repository uses:
- Codex-first implementation workflow
- deterministic implementation rules
- centralized lifecycle handling
- centralized permission handling

Do not:
- invent workflows
- invent lifecycle states
- invent APIs
- invent permissions
- invent validations
- redesign existing UI system

Always follow:
- MASTER FRD
- Domain FRD
- existing implementation patterns


# Source of Truth Priority

Implementation priority order:

1. FRD / FE Spec
2. Existing stable implementation patterns
3. Existing DS wrapper patterns
4. AGENTS.md governance rules
5. New implementation

Always:
- follow FRD first
- preserve stable existing behavior
- preserve existing architecture unless implementation conflict exists
- align with existing lifecycle handling before introducing new logic

Do not:
- override stabilized implementation semantics
- replace stable architecture without clear justification
- introduce conflicting workflow behavior


# Core Implementation Principles

- Reuse existing implementation patterns before creating new ones.
- Preserve existing layout architecture.
- Preserve existing sidebar/header/app shell structure.
- Preserve Screen ID traceability from FRD.
- Use centralized lifecycle logic.
- Use centralized permission logic.
- Use centralized status rendering.
- Use typed mock data only.
- Keep business logic deterministic.
- Keep UI behavior deterministic.
- Keep workflow behavior deterministic.

Do not:
- hardcode workflow transitions
- hardcode permissions
- duplicate lifecycle logic
- duplicate validation logic
- scatter business rules across components


# Minimal-Change Principle

Prefer:
- localized changes
- scoped updates
- extending existing modules
- updating existing implementations before creating new abstractions

Avoid:
- large uncontrolled rewrites
- broad architectural refactors
- unnecessary folder restructuring
- replacing stable shared logic

Before creating new modules:
- inspect reusable existing implementation first
- inspect shared DS patterns first
- inspect existing lifecycle/permission utilities first


# Implementation Priority Rules

Implementation order:

1. Reuse existing DS wrappers
2. Reuse existing business implementation patterns
3. Reuse shared lifecycle/permission utilities
4. Extend existing modules/components
5. Create new implementation only if no stable reusable pattern exists

Do not:
- create duplicate workflow handlers
- create duplicate validation systems
- create parallel status rendering logic
- introduce alternative lifecycle implementations


# Over-Engineering Prevention

Do not:
- introduce speculative abstraction layers
- create reusable systems prematurely
- build generic frameworks without proven reuse need
- introduce unnecessary indirection
- create configuration-driven systems unless already established

Prefer:
- explicit implementation
- deterministic behavior
- existing stable patterns
- simple extensions of existing modules

Only introduce new abstractions when:
- reuse is already proven
- duplication becomes operationally harmful
- implementation governance requires centralization


# Design System Rules

Use DS wrapper components first.

Preferred order:
1. Existing DS wrapper
2. Existing shared enterprise component
3. Raw shadcn primitive
4. New component

Do not:
- bypass DS wrappers unnecessarily
- redesign DS patterns
- create isolated styling systems
- create one-off component styles

Use:
- token-based styling only
- Tailwind utility classes aligned with DS
- shared spacing conventions
- shared typography conventions
- shared status badge conventions

Do not use:
- hardcoded colors
- inline hex values
- custom shadow systems
- custom spacing scales

Preserve:
- existing status badge rendering
- existing table patterns
- existing form patterns
- existing app shell structure

Prefer:
- DSDataTable
- DSFilterBar
- DSStatusBadge
- DSKpiCard
- DSFormField
- shared page layout wrappers

Do not create:
- new visual language
- alternate dashboard style
- inconsistent card patterns


# UI/UX Rules

Desktop-first responsive behavior.

Use:
- deterministic layouts
- enterprise table-first UX
- predictable interaction behavior
- consistent action placement

Workflow actions:
- place consistently
- align with lifecycle state
- align with permission state

Readonly behavior:
- derive from workflow state
- not from arbitrary component conditions

Do not:
- hide important workflow information
- move workflow actions inconsistently
- implement undocumented UI automation

Status rendering:
- use centralized mapping
- use canonical labels from FRD

Vietnamese labels must remain unchanged:
- Nháp
- Chờ duyệt
- Đã duyệt
- Từ chối

Do not invent alternate wording.


# Lifecycle & Workflow Rules

Use canonical lifecycle defined by FRD/domain governance.

Do not:
- invent lifecycle states
- invent hidden workflow transitions
- implement undocumented intermediate states

Readonly/editable behavior:
- must derive from canonical workflow state
- must reuse centralized lifecycle handling
- must remain consistent across screens/domains

Workflow behavior:
- deterministic
- auditable
- centralized
- traceable to FRD

Attachment behavior:
- upload does not auto-submit workflow
- upload failure does not clear existing data
- duplicate filenames create new attachment records
- do not overwrite existing files automatically

Import behavior:
- invalid rows cannot be confirmed
- confirm actions enabled only when validation rules pass
- do not implement undocumented partial import behavior

Approval behavior:
- only authorized actor can approve/reject
- reject behavior must follow FRD semantics
- approval actions must be audited


# Form & Validation Rules

Validation must be deterministic.

Always:
- validate before workflow transition
- preserve entered data after validation failure
- show inline validation errors
- distinguish validation errors from system errors

Do not:
- auto-correct business data silently
- auto-submit forms
- auto-trigger workflow transitions

Mandatory fields:
- derive from FRD
- do not invent additional required fields

Readonly forms:
- disable editing actions
- disable upload/remove actions if readonly
- preserve viewing capability

Submit buttons:
- disabled until data is valid
- aligned with lifecycle state

Validation logic:
- centralized
- reusable
- typed
- traceable to FRD rules


# Table & List Rules

Enterprise list screens must:
- use standardized table structure
- support deterministic filtering
- support deterministic pagination
- preserve filter state during pagination

Filter behavior:
- filter change reloads dataset
- filter change resets pagination to page 1
- reset filter restores default state

Sorting behavior:
- sorting reloads dataset
- default sorting deterministic
- sorting state visible

Pagination behavior:
- preserve current filters
- preserve sorting state

Search behavior:
- use deterministic filtering
- no undocumented fuzzy search

Do not:
- mutate table data client-side unpredictably
- invent hidden filtering logic

Status columns:
- use centralized status badge renderer
- use canonical workflow labels


# Loading / Error / Empty State Rules

All async actions require loading states.

Loading:
- deterministic
- visible
- non-blocking unless necessary

Error handling:
- explicit
- preserve current data
- distinguish:
  - validation error
  - integration error
  - system error

Empty states:
- explicit
- never blank screen

Required states:
- Empty State
- Loading State
- Error State
- No Result State

Import workflow:
- upload error visible
- validation error visible
- invalid rows highlighted

Attachment workflow:
- upload progress visible
- upload failure visible


# File & Folder Conventions

Prefer existing structure before creating new folders.

Suggested structure:

app/
  planning/
  system/

components/
  ds/
  planning/
  shared/

lib/
  lifecycle/
  permissions/
  validation/
  mappings/

constants/
  workflow/
  status/

hooks/
  planning/
  shared/

mock-data/
  planning/

types/
  planning/
  shared/

Do not:
- place business logic inside page files
- place lifecycle logic inside UI components
- duplicate type definitions

Keep:
- types centralized
- mappings centralized
- workflow constants centralized
- status constants centralized


# Mock Data Rules

Use realistic enterprise datasets.

Do not use:
- toy examples
- tiny datasets
- unrealistic IDs
- fake lorem-only content

Tables should contain:
- multiple statuses
- multiple organizations
- multiple lifecycle states
- realistic timestamps
- realistic equipment data

Mock data must include:
- Draft
- Pending Approval
- Approved
- Rejected

Include edge cases:
- invalid import rows
- missing attachment
- upload failure
- readonly workflow
- validation failure

Use typed mock data only.


# Anti-Hallucination Rules

If implementation behavior is unclear:

1. Check FRD / FE Spec
2. Check existing implementation pattern
3. Check shared DS/business utilities
4. Add TODO/reference note if ambiguity remains

Do not silently:
- invent business rules
- invent UI behavior
- invent validation logic
- invent workflow automation
- invent API behavior

Never:
- overwrite lifecycle semantics
- bypass readonly rules
- bypass permission rules

Preserve:
- Screen IDs
- FR traceability
- canonical labels
- canonical lifecycle behavior


# Implementation Workflow Rules

Before implementation:
1. Inspect existing structure
2. Inspect existing DS usage
3. Inspect existing lifecycle handling
4. Inspect existing permission handling
5. Reuse patterns first

Before major changes:
- propose implementation plan
- identify impacted files
- avoid uncontrolled rewrites

Implementation rules:
- small scoped commits
- deterministic changes
- preserve existing architecture
- avoid broad refactors unless requested

Business logic:
- centralized
- reusable
- typed
- traceable

After implementation:
- run lint
- run type checks
- run build validation if possible

Always report:
- changed files
- new files
- architectural impact
- unresolved assumptions


# Delivery Rules

Before completion:
- verify lifecycle consistency
- verify readonly behavior
- verify permission behavior
- verify validation behavior
- verify status rendering
- verify attachment behavior

Required checks:
- lint passes
- no TypeScript errors
- imports resolved
- no duplicate logic introduced

Implementation output must:
- preserve existing UI system
- preserve DS consistency
- preserve workflow semantics
- preserve FR traceability

Never finalize implementation with:
- placeholder business logic
- invented workflow behavior
- undocumented assumptions
- inconsistent lifecycle handling
- hardcoded permissions
- hardcoded status mappings

Always keep:
- implementation deterministic
- implementation traceable
- implementation reusable
- implementation governance-aligned

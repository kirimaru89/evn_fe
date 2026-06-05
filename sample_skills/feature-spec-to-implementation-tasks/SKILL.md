---
name: feature-spec-to-implementation-tasks
description: Generate a frontend implementation task plan from a product-level Feature Spec and API Contract for this EVN Next.js project. Use after feature-spec-to-api-contract and before implement-feature-spec. Creates implementation-tasks.md with repo-specific FE tasks, file placement, data mapping, UI behavior, state handling, verification steps, and unresolved assumptions. Does not write application code.
---

# Feature Spec To Implementation Tasks

Use this skill to convert a verified Feature Spec plus API Contract into a frontend implementation plan.

The output is a repo-specific task checklist that can be reviewed before code is written. This skill does not implement code.

## Inputs

Required:

```txt
.specs/<module>/<feature-folder>/feature-spec.md
.specs/<module>/<feature-folder>/api-contract.md
```

The Feature Spec must include:

```txt
UI / UX > ASCII Wireframe
```

Required references:

```txt
AGENTS.md
docs/architecture/PROJECT_STRUCTURE.md
docs/architecture/DESIGN_SYSTEM.md
```

Also inspect existing code patterns before finalizing tasks:

```txt
components/ds/
components/shared/
components/ui/
components/<module>/
app/<module>/
hooks/<module>/
lib/<module>/
mock-data/<module>/
types/<module>/
```

Valid module slugs:

```txt
admin
portal-msm
thi-nghiem-cbm
```

## Output

Create or update:

```txt
.specs/<module>/<feature-folder>/implementation-tasks.md
```

If the user asks for a different path, use that path as long as it stays under `.specs/<module>/`.

## Hard Boundaries

Do not:

- write application code
- edit app/components/hooks/lib/mock-data/types files
- invent business rules, workflow states, permissions, validations, or API behavior
- add backend implementation tasks unless they are explicitly labeled as FE dependency / BE handoff
- turn unresolved API questions into implementation decisions
- create broad refactor tasks unrelated to the target feature

Do:

- derive frontend implementation tasks from Feature Spec + API Contract
- map work to this repo's module boundaries
- prefer DS wrappers and existing patterns
- identify mock data needs when backend is unavailable
- assign every task a stable ID
- list open assumptions clearly
- include verification tasks

## What To Read

Feature Spec:

- Metadata -> module, feature name, source status
- Scope / Out of Scope -> implementation scope
- UI / UX > ASCII Wireframe -> primary UI layout and region order
- UI / UX -> layout regions, actions, screen states
- Data Model / Fields -> frontend types, filters, table columns, display fields, selection state
- Business Rules -> action availability, validation, lifecycle, permissions
- Acceptance Criteria -> task coverage checklist
- Open Questions -> assumptions/blockers

API Contract:

- Contract Scope -> what FE may call/mock
- API Capabilities -> client/mock capabilities needed
- Query Contracts -> filter/search/pagination state
- Response Contracts -> FE types and table data shape
- Mutation Contracts -> action handlers and optimistic/reload behavior
- Error Contract -> error states and validation messages
- Validation And Permission Contract -> FE checks and API error handling
- Open Questions -> assumptions/blockers

Project references:

- `AGENTS.md` -> module boundaries and governance
- `PROJECT_STRUCTURE.md` -> file placement
- `DESIGN_SYSTEM.md` -> DS components and UI rules
- existing code -> local patterns to reuse

## Task Derivation Rules

Implementation scope:

- Include only work in Feature Spec scope and API Contract scope.
- Mention out-of-scope flows as navigation/action placeholders only when the current screen must expose entry points.
- Do not create detailed tasks for out-of-scope flows.

File placement:

- Derive likely file placement from module slug and existing repo structure.
- Use paths as proposed implementation targets, not as Feature Spec truth.
- Prefer module-specific folders unless a helper is genuinely shared.

Data mapping:

- Map API response fields to frontend types.
- Map search/filter query params to UI state.
- Map `availableActions` and status rules to row/bulk action behavior.
- Map display/derived fields such as totals and range to pagination UI.

Mock data:

- Add mock data tasks when API implementation is not available.
- Mock data must cover statuses, pagination, filters, empty/no-result, long values, invalid bulk selection, mutation failure, and timeout/system error when required by spec/contract.

UI tasks:

- Derive UI layout tasks from the ASCII Wireframe section first.
- Cross-check wireframe-derived layout with `UI / UX` screen regions, actions, and states.
- Use DS wrappers first.
- Include loading, error, empty, no result, success feedback, invalid filter, selection, pagination, and mutation states when specified.
- Include accessibility/interaction details only when needed for the feature.

Behavior tasks:

- Keep workflow/action logic centralized in an appropriate helper/task if implementation will need it.
- Respect API contract decisions, for example using `items[].availableActions` when BE returns action availability.
- Define bulk invalid selection based on the API contract.

Verification:

- Include lint, typecheck, build when available.
- Include visual/manual checks for major UI screens.
- Include contract coverage checks against `feature-spec.md` and `api-contract.md`.

Task IDs:

- Every task must have a stable ID.
- Use these prefixes:
  - `FND` for foundation/data/contract setup.
  - `STATE` for hooks and state orchestration.
  - `UI` for static layout and DS composition.
  - `BIND` for binding data/actions to UI.
  - `ACT` for actions, mutations, confirmations, and feedback.
  - `EDGE` for loading/error/empty/no-result/validation edge states.
  - `VERIFY` for verification tasks.
- Use two-digit numbering, for example `FND-01`, `STATE-02`, `UI-03`.
- Coverage rows must reference task IDs, not task prose.

## Output Template

Use this exact section structure:

```md
# Implementation Tasks: <Feature Name>

## Scope

### In Scope

- <frontend work in scope>

### Out of Scope

- <out-of-scope flows or implementation avoided>

## Planned Files

| Type | Path | Notes |
| --- | --- | --- |
| Page | <path or TBD after code inspection> | <notes> |
| Components | <path> | <notes> |
| Types | <path> | <notes> |
| Mock data | <path> | <notes> |
| API adapter | <path> | <notes> |
| Helpers | <path> | <notes> |

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

- [ ] FND-01 <task>

### STATE — State

- [ ] STATE-01 <task>

### UI — Layout

- [ ] UI-01 <task>

### BIND — Binding

- [ ] BIND-01 <task>

### ACT — Actions

- [ ] ACT-01 <task>

### EDGE — Edge States

- [ ] EDGE-01 <task>

### VERIFY — Verification

- [ ] VERIFY-01 <task>

## Coverage

| Spec / Contract Item | Task |
| --- | --- |
| <item> | <task ID(s)> |

## Open Items

| Item | Owner | Impact |
| --- | --- | --- |
| <assumption or blocker> | <owner> | <impact> |
```

## Final Response

After generating tasks, respond with:

```txt
Created/updated:
- <implementation-tasks path>

Source files used:
- <feature-spec path>
- <api-contract path>

Open assumptions/blockers:
- <item or "None">

Notes:
- <short planning notes>
```

Keep the response concise.

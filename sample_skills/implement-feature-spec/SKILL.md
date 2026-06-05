---
name: implement-feature-spec
description: Implement frontend tasks from a verified Feature Spec folder in this EVN Next.js project. Use after feature-spec-to-implementation-tasks, when the user asks to implement a task ID or task group such as FND-01, STATE, UI, ACT, EDGE, or VERIFY. Reads feature-spec.md, api-contract.md, and implementation-tasks.md; follows AGENTS.md, project structure, DS wrappers, existing patterns, and vercel-react-best-practices.
---

# Implement Feature Spec

Use this skill after a Feature Spec has been normalized, API Contract has been drafted, and `implementation-tasks.md` exists.

The goal is to implement only the requested frontend task ID or task group without inventing business rules, workflow states, API behavior, permissions, or validations.

## Inputs

Required feature folder:

```txt
.specs/<module>/<feature-folder>/
```

Required files in that folder:

```txt
feature-spec.md
api-contract.md
implementation-tasks.md
```

If the user passes a specific task ID or group, use it as the implementation scope:

```txt
FND-01
FND
STATE
UI-03
ACT
```

If no task ID/group is provided, inspect `implementation-tasks.md` and implement the next unchecked task in execution order.

## Required References

Read only what is needed for the requested scope:

```txt
AGENTS.md
docs/architecture/PROJECT_STRUCTURE.md
docs/architecture/DESIGN_SYSTEM.md
```

Also apply:

```txt
vercel-react-best-practices
```

for React, Next.js, data fetching, server/client boundaries, rendering, and bundle-performance decisions.

## Valid Modules

```txt
admin
portal-msm
thi-nghiem-cbm
```

## Workflow

1. Read `implementation-tasks.md` first.
2. Resolve the requested task ID/group, or choose the next unchecked task in execution order.
3. Read the relevant sections of `feature-spec.md` and `api-contract.md` for that task.
4. Read project references and inspect existing code patterns before creating files.
5. Implement the smallest scoped change that satisfies only the resolved task scope.
6. Do not implement later task groups just because they are convenient.
7. Run focused checks, then `npm run lint` and `npm run typecheck` when practical.
8. Mark completed task checkboxes in `implementation-tasks.md` only after implementation and verification pass.
9. Leave unchecked any task that is blocked, partial, or not verified.
10. Report changed files, completed task IDs, checks, and unresolved assumptions.

## Task Scope Rules

- Implement task IDs exactly as written in `implementation-tasks.md`.
- For a group request such as `STATE`, implement all unchecked tasks under that group when feasible.
- Preserve execution order: `FND` -> `STATE` -> `UI` -> `BIND` -> `ACT` -> `EDGE` -> `VERIFY`.
- If a requested task depends on incomplete earlier tasks, implement the missing prerequisite first only when it is clearly required and report it.
- Do not expand scope into out-of-scope flows listed in the Feature Spec or task plan.
- Do not turn open questions into implementation decisions. Keep them as assumptions or blockers.

## What To Read From Each Artifact

`implementation-tasks.md`:

- Execution order
- Requested task IDs and task prose
- Planned files
- Coverage mapping
- Open items

`feature-spec.md`:

- Scope / Out of Scope
- UI / UX and ASCII Wireframe when touching UI
- Data fields and data concepts
- Business rules, status rules, lifecycle rules
- Acceptance criteria
- Open questions

`api-contract.md`:

- API capabilities
- Query and response contracts
- Mutation contracts
- Error contract
- Validation and permission contract
- Open questions

## Reuse First

Before creating UI components, inspect:

```txt
components/ds/
components/shared/
components/ui/
components/<module>/
```

Priority:

1. Existing DS wrapper
2. Existing shared enterprise component
3. Raw shadcn primitive from `components/ui/`
4. New module component

Do not create a new component when an existing component can be reused or extended cleanly.

## File Placement

Place files by module:

```txt
app/<module>/
components/<module>/
hooks/<module>/
lib/<module>/api/
mock-data/<module>/
types/<module>/
```

Shared code only when truly reused:

```txt
components/shared/
hooks/shared/
lib/shared/
types/shared/
```

Shared HTTP infrastructure belongs in:

```txt
lib/shared-api-client/
```

Hooks may call module API functions from `lib/<module>/api/`, but must not define raw backend HTTP requests.

## Implementation Boundaries

Do:

- preserve existing app shell, layout, table, form, and status patterns
- use DS wrappers first
- use typed mock data when backend endpoints are unavailable
- centralize lifecycle, permission, validation, mapping, and status logic
- keep changes localized to the target module unless shared behavior is truly needed
- preserve Vietnamese labels from the spec and contract
- use BE/API-provided fields such as `items[].availableActions` when the contract says so

Do not:

- invent business rules, workflow states, API behavior, permissions, or validations
- hardcode status mappings in UI components
- scatter lifecycle or validation logic across components
- define raw backend HTTP requests in pages, components, or hooks
- rewrite unrelated files
- introduce broad refactors without explicit request
- mark a task complete before checks pass or before the requested behavior exists

## State And Validation Requirements

All async actions require visible state management:

- loading
- error
- empty
- no result
- success feedback after successful mutation
- inline validation error when applicable

Validation must:

- run before submit/workflow actions
- preserve entered data after failure
- distinguish validation errors from integration/system errors
- use Feature Spec / API Contract rules only

Readonly/editable behavior must come from canonical lifecycle and centralized permission logic when such logic exists.

## Checks

Run when available and practical:

```txt
npm run lint
npm run typecheck
npm run build
```

For UI tasks, also verify layout manually or with browser tooling when a local route is available.

If a command does not exist or cannot run, report that clearly.

## Updating Implementation Tasks

After successful implementation:

- Change `[ ] <TASK-ID>` to `[x] <TASK-ID>` for completed tasks.
- Do not mark dependent, partial, blocked, or unverified tasks as done.
- Keep task prose stable unless the user asks to revise the plan.
- If implementation reveals a new assumption, add it to `Open Items` instead of hiding it in code.

## Final Response

Use this concise structure:

```txt
Implemented:
- <completed task IDs and short summary>

Changed files:
- <file>

Checks:
- <command>: <pass/fail/not run>

Task status:
- <task IDs marked done or left open>

Unresolved assumptions:
- <assumption or None>
```

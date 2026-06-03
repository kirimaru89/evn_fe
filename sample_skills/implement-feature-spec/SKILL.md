---
name: implement-feature-spec
description: Implement a verified local Feature Spec into the Next.js frontend. Use when building or updating screens from `.specs/<module>/<code>.md`, following AGENTS.md, project structure, DS wrappers, existing components, and vercel-react-best-practices.
---

# Implement Feature Spec

Use this skill only after the Feature Spec has been verified or the user explicitly accepts remaining assumptions.

The goal is to implement the requested frontend behavior without inventing business rules, workflow states, APIs, permissions, or validations.

## Inputs

Required:

```txt
.specs/<module>/<FEATURE-CODE>.md
```

Required references:

```txt
AGENTS.md
docs/architecture/PROJECT_STRUCTURE.md
docs/architecture/DESIGN_SYSTEM.md
docs/templates/FEATURE_SPEC_TEMPLATE.md
```

Also apply:

```txt
vercel-react-best-practices
```

for React, Next.js, data fetching, server/client boundaries, rendering, and bundle-performance decisions.

## Workflow

1. Read the target Feature Spec.
2. Confirm the module is valid:

```txt
admin
portal-msm
thi-nghiem-cbm
```

3. Read `AGENTS.md`.
4. Read `docs/architecture/PROJECT_STRUCTURE.md`.
5. Read `docs/architecture/DESIGN_SYSTEM.md` when touching UI.
6. Use `vercel-react-best-practices` for React/Next.js implementation details.
7. Inspect existing code before writing new files.
8. Implement with the smallest scoped change that satisfies the spec.
9. Run lint and typecheck when possible.
10. Report changed files, new files, checks run, and unresolved assumptions.

## Reuse First

Before creating any UI component, inspect:

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

Shared HTTP client infrastructure:

```txt
lib/shared-api-client/
```

Do not put raw backend HTTP requests in `app/`, `components/`, or hooks.

## Implementation Rules

Do:

- preserve existing app shell, layout, table, form, and status patterns
- use DS wrappers first
- use typed mock data when backend contracts are unavailable
- centralize lifecycle, permission, validation, mapping, and status logic
- keep changes localized to the target module unless shared behavior is truly needed
- preserve Vietnamese labels from the spec

Do not:

- invent business rules
- invent workflow states
- invent API behavior
- invent permissions
- invent validations
- hardcode status mappings in UI components
- scatter lifecycle or validation logic across components
- rewrite unrelated files
- introduce broad refactors without explicit request

## State Requirements

Implement required UI states from the Feature Spec.

If the spec does not define exact copy, follow existing DS/project patterns and report the wording as an assumption.

Common required states:

- loading
- error
- empty
- no result
- success feedback after successful mutation
- inline validation error

## Validation And Workflow

Validation must:

- run before submit/workflow actions
- preserve entered data after failure
- show inline errors
- distinguish validation errors from integration/system errors

Readonly/editable behavior must come from centralized lifecycle and permission logic when such logic exists.

If required lifecycle, permission, or validation behavior is missing from the spec, stop and report it unless the user explicitly accepted an assumption.

## Checks

Run when available:

```txt
npm run lint
npm run typecheck
npm run build
```

If a command does not exist or cannot run, report that clearly.

## Output Format

Use this structure in the final response:

```txt
Implemented:
- <short summary>

Changed files:
- <file>

New files:
- <file or None>

Checks:
- <command>: <result>

Unresolved assumptions:
- <assumption or None>
```

Keep the report concise.

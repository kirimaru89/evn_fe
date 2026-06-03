---
name: review-feature-diff
description: Review implementation diffs against project rules and the target Feature Spec. Use after a Feature Spec implementation to find regressions, rule violations, invented behavior, misplaced files, missing states, missing validations, DS misuse, and missing verification.
---

# Review Feature Diff

Use this skill after implementation, before accepting or merging changes.

The goal is to review the diff against project rules and the target Feature Spec. Prioritize bugs, regressions, rule violations, and missing required behavior. Do not rewrite code while using this skill unless the user explicitly asks for fixes.

## Inputs

Required:

```txt
.specs/<module>/<FEATURE-CODE>.md
git diff
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

for React/Next.js correctness, performance, server/client boundaries, rendering, and bundle risks.

## Workflow

1. Read the target Feature Spec.
2. Read `AGENTS.md`.
3. Read `docs/architecture/PROJECT_STRUCTURE.md`.
4. Read `docs/architecture/DESIGN_SYSTEM.md` when UI changed.
5. Inspect the diff with `git diff`.
6. Review changed files only, unless the diff requires checking existing dependencies.
7. Report findings first, ordered by severity.

## Review Checklist

Feature Spec alignment:

- Implementation matches the user story, description, layout, fields, business rules, validations, and acceptance criteria.
- No business rule, workflow, API, permission, or validation was invented.
- Unclear spec behavior is reported as an assumption, not silently implemented.

File placement:

- Routes are under `app/<module>/`.
- Module components are under `components/<module>/`.
- Shared components are only under `components/shared/` when truly reused.
- Module API functions are under `lib/<module>/api/`.
- Shared API client code is under `lib/shared-api-client/`.
- Types and mock data are under the correct module folders.

Component and DS usage:

- Existing components were reused before new components were created.
- DS wrappers are preferred over raw shadcn primitives.
- Raw `components/ui/` primitives are used only when no DS/shared component fits.
- No isolated styling system, hardcoded colors, inline hex values, custom shadows, or custom spacing scales were added.
- App shell, sidebar, header, table, form, and status patterns are preserved.

Lifecycle, permission, validation:

- Workflow state and readonly/editable behavior come from centralized lifecycle/permission logic when relevant.
- No workflow transitions, permissions, or status mappings are hardcoded in UI components.
- Validation runs before submit/workflow actions.
- Validation failure preserves entered data and shows inline errors.
- Validation errors are distinguished from integration/system errors.

UI states:

- Loading state exists for async actions.
- Error state exists and preserves current data when appropriate.
- Empty/no-result states exist when needed.
- Success feedback exists for successful mutations.
- Upload behavior follows the Feature Spec and project rules.

React/Next.js:

- Apply `vercel-react-best-practices`.
- Check server/client component boundaries.
- Check data fetching placement and waterfalls.
- Check avoidable rerenders and expensive client components.
- Check bundle-size risks from broad imports or unnecessary client code.

Verification:

- Lint/typecheck/build were run when available.
- If checks were not run, the reason is reported.
- Imports resolve and TypeScript types are not weakened unnecessarily.

## Severity

Use these severities:

```txt
Blocker: must fix before implementation can be accepted.
High: likely bug, regression, or project-rule violation.
Medium: important maintainability, UX, validation, or DS issue.
Low: minor cleanup or clarity issue.
```

## Output Format

Use this exact structure:

```txt
Findings:
- [Severity] <title>
  File: <path:line if available>
  Issue: <what is wrong>
  Why it matters: <impact>
  Recommendation: <specific fix>

Open questions:
- <question or "None">

Checks reviewed:
- Feature Spec: <path>
- Diff base: <branch/ref or unstaged/staged diff>
- Commands: <checks run or observed>

Summary:
- <short summary>
```

If there are no findings, say:

```txt
Findings:
- None
```

Still mention residual risks, missing test coverage, or checks that were not run.

Keep the review concise and evidence-based.

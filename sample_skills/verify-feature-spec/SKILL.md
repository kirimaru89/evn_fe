---
name: verify-feature-spec
description: Verify a local Feature Spec before implementation. Use when checking whether `.specs/<module>/<code>.md` is complete enough to implement, comparing it against `docs/templates/FEATURE_SPEC_TEMPLATE.md`, and reporting blocking issues, warnings, assumptions, and readiness.
---

# Verify Feature Spec

Use this skill before implementing any feature from `.specs/<module>/`.

The goal is to decide whether a Feature Spec is ready for implementation. Do not implement code while using this skill.

## Inputs

Required:

```txt
.specs/<module>/<FEATURE-CODE>.md
```

Reference:

```txt
docs/templates/FEATURE_SPEC_TEMPLATE.md
AGENTS.md
docs/architecture/PROJECT_STRUCTURE.md
```

## Workflow

1. Read the target Feature Spec.
2. Read `docs/templates/FEATURE_SPEC_TEMPLATE.md`.
3. Confirm the module is one of:

```txt
admin
portal-msm
thi-nghiem-cbm
```

4. Check that the spec includes enough information for implementation.
5. Do not invent missing business rules, validations, permissions, APIs, or workflow behavior.
6. Report readiness clearly.

## Required Checks

Check these sections:

- Metadata
- User Story
- Description
- UI / UX
- Business Rules
- Data Fields
- Shared Rules References
- Acceptance Criteria
- Implementation Notes
- Change Request, only when the spec is a CR

## Detailed Checklist

Metadata:

- Module is present and valid.
- Module slug matches the target `.specs/<module>/` folder.
- Use case ID or screen ID is present.
- Version is present.
- Owner/status are present or explicitly marked TBD.

UI / UX:

- Spec has either ASCII layout or a Figma/design link.
- Primary layout regions are clear.
- Primary actions are visible.
- Empty/loading/error/success states are described or referenced.

Data Fields:

- Each field has a UI type.
- Required/optional state is specified or marked TBD.
- Data source is specified or marked TBD.
- Shared rules are linked or marked TBD.
- Upload fields define file count, file type, max size, and failure behavior, or mark them TBD.

Business Rules:

- Rules are explicit enough to implement.
- Missing rules are marked `TODO(<owner>)` or `TBD`.
- No hidden workflow behavior is implied without being written.

Validation:

- Validation requirements are explicit or linked.
- Error behavior is clear.
- Validation failure preserves entered data.

Acceptance Criteria:

- ACs are testable.
- ACs cover success and failure paths.
- ACs do not contradict business rules or UI details.

Implementation Notes:

- Route/module placement is clear enough.
- Expected API/mock-data/type needs are clear enough.
- Any permission/lifecycle dependency is explicit or marked TBD.

Change Request:

- Old version and new version are declared.
- Old/new spec links are included.
- Current behavior and requested change are both described.
- Impact is listed for UI, validation, API, permissions, lifecycle, and mock data where relevant.

## Readiness Rules

Return `Ready for implementation: No` when any blocking issue exists.

Blocking issues include:

- Missing target spec file.
- Invalid or unclear module.
- No user story or description.
- No UI layout or design reference.
- Data fields are too incomplete to build the screen.
- Business rules required for behavior are missing.
- Validation rules required for submit/save are missing.
- Acceptance Criteria are absent or not testable.
- API/workflow/permission behavior is required but unspecified.
- Spec contains contradictions.

Return `Ready for implementation: Yes` only when implementation can proceed without inventing business behavior.

Warnings are allowed when they do not block implementation, for example:

- Minor copy text TBD.
- Non-critical empty state wording TBD.
- Nice-to-have edge case not specified.
- Design spacing can follow existing DS pattern.

## Output Format

Use this exact structure:

```txt
Ready for implementation: Yes/No

Spec:
- Path: <path>
- Module: <module>
- Code: <code>
- Version: <version or TBD>

Blocking issues:
- <issue or "None">

Warnings:
- <warning or "None">

Assumptions:
- <assumption or "None">

Implementation scope:
- Routes:
- Components:
- Hooks:
- API:
- Types:
- Mock data:

Reviewer notes:
- <short notes for designer/BA/dev>
```

Keep the result concise and actionable.

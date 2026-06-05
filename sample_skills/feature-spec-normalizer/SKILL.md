---
name: feature-spec-normalizer
description: Normalize BA notes, business/screen specs, ASCII wireframes, and source snippets into a product-level Feature Spec for this EVN Next.js project. Use before verify-feature-spec when source material is business-focused, fragmented, or not yet in the project Feature Spec format. Do not generate frontend/backend implementation details such as routes, component paths, API URLs, database tables, hooks, or service names.
---

# Feature Spec Normalizer

Use this skill to convert BA-provided notes, screen specs, SRS excerpts, and ASCII wireframes into a clean product-level Feature Spec under `.specs/<module>/`.

The goal is to define what must be true for the feature: user value, business context, UI behavior, fields, rules, states, and acceptance criteria. This skill does not implement code and does not produce FE/BE implementation design.

## Inputs

Typical inputs:

```txt
.specs/<module>/<feature-folder>/spec.md
.specs/<module>/<feature-folder>/wireframe.md
.specs/<module>/<feature-folder>/<screen>.md
```

Reference files:

```txt
AGENTS.md
docs/architecture/PROJECT_STRUCTURE.md
docs/templates/FEATURE_SPEC_TEMPLATE.md
```

Valid module slugs:

```txt
admin
portal-msm
thi-nghiem-cbm
```

## Output

Create or update one normalized Feature Spec:

```txt
.specs/<module>/<feature-folder>/feature-spec.md
```

If the user asks for a different path, use that path as long as it stays under `.specs/<module>/`.

## Hard Boundaries

Do not include implementation details such as:

- Next.js route paths
- React component paths
- hook names
- API endpoint URLs
- database tables
- backend service names
- DTO filenames
- design-system component mappings

Those are derived later by implementation agents from the Feature Spec, project structure, and codebase patterns.

Do include product-level contracts such as:

- fields and data sources
- filter/search/sort/pagination behavior when specified
- UI states and user-visible outcomes
- business rules
- workflow, permission, validation, and lifecycle rules
- FE-visible acceptance criteria
- BE/API behavior acceptance criteria, when source material states the behavior
- validation and error acceptance criteria

## Workflow

1. Read all source files for the target feature folder.
2. Identify the module and confirm it is one of the valid module slugs.
3. Extract source-of-truth statements from BA notes, SRS sections, and wireframes.
4. Preserve exact Vietnamese business labels unless the source contains a contradiction.
5. Normalize the content into the template below.
6. When information is missing, write `TBD(<owner>)` or add an Open Question. Do not invent business rules, workflows, permissions, validations, or API behavior.
7. If source files conflict, preserve both values in `Open Questions / TBD` and explain the conflict.
8. Keep out-of-scope items explicit, especially related popups or flows that are visible from the screen but not part of the current feature.
9. Write the normalized Feature Spec to the output path.
10. Report the output path, source files used, and unresolved TBD/open questions.

## Normalization Rules

Metadata:

- Use the folder module slug when the source omits module slug.
- Use `TBD(BA)` for missing Feature ID, Use Case ID, Screen ID, status, owner, or last updated.
- Keep version from source documents when present; otherwise use `TBD(BA)`.

User Story:

- Convert BA prose into `Là <vai trò>, tôi muốn <hành động/mục tiêu> để <giá trị nghiệp vụ>.`
- If value is missing, keep the action and mark the value as `TBD(BA)`.

Business Context:

- Summarize what the feature does and why it exists.
- Separate `Scope` and `Out of Scope`.
- Treat linked but separately specified popups/import/sync/detail flows as out of scope unless the source says this spec owns them.

UI / UX:

- Include the ASCII wireframe exactly when available.
- Convert screen regions, actions, and states into tables.
- Include visible loading, empty, no-result, error, and success behavior when specified.
- If only a state name is listed and behavior is not described, mark expected behavior as `TBD(BA/UX)`.

Data Model / Fields:

- Split fields by purpose so FE and BE can tell what is domain data, query input, display-only, or interaction state.
- `Business Entity Fields` are fields that belong to the business object or domain record.
- `Search / Filter Fields` are inputs used to query or narrow the data set.
- `Display / Derived Fields` are values shown to users but derived from data, pagination, or workflow rules.
- `Selection / Interaction Fields` are UI interaction state that affects feature behavior but is not a business entity.
- Use product-level types such as `Text`, `Date`, `DateTime`, `Enum`, `Number`, `Boolean`, `File`, `List`, `Object`.
- Use `TBD(BA)` for required/source/validation when not specified.
- Preserve stated external sources such as `PMIS`, `MSM`, or `User input`.

Business Rules:

- Keep rule IDs from source when available.
- Group rules under workflow, permission, validation, and lifecycle.
- If a rule does not fit those groups, put it under `Other Business Rules`.
- Do not translate a UI availability hint into a permission rule unless the source states it as permission.

Acceptance Criteria:

- Keep existing AC IDs and wording when possible.
- Group ACs as FE-visible, BE/API, and validation/error.
- If an AC spans multiple groups, place it where the externally visible behavior is clearest.
- Do not create new ACs that add behavior not present in source.

Open Questions:

- Add contradictions, missing ownership, unclear labels, undefined statuses, unspecified rule references, and ambiguous action behavior.
- Include the owner when obvious: `BA`, `BE`, `FE`, `PO`, or `UX`; otherwise use `TBD`.

## Feature Spec Template

Use this exact section structure:

````md
# <Feature Name>

## Metadata

| Field | Value |
| --- | --- |
| Module | <Admin / Portal MSM / Thí nghiệm CBM> |
| Module slug | <admin / portal-msm / thi-nghiem-cbm> |
| Feature ID | <ID or TBD(BA)> |
| Use Case ID | <ID or TBD(BA)> |
| Screen ID | <ID or TBD(BA)> |
| Version | <major.minor or TBD(BA)> |
| Status | <Draft / In Review / Approved / TBD(BA)> |
| Owner | <name/team or TBD(BA)> |
| Last updated | <dd/mm/YYYY or TBD(BA)> |
| Source documents | <doc name, section, link/path> |

## User Story

Là `<vai trò>`, tôi muốn `<hành động / mục tiêu>` để `<giá trị nghiệp vụ>`.

## Business Context

<Mô tả ngắn gọn tính năng, bối cảnh sử dụng, người dùng chính, phạm vi nghiệp vụ.>

### Scope

- <Trong phạm vi 1>
- <Trong phạm vi 2>

### Out of Scope

- <Ngoài phạm vi 1>
- <Ngoài phạm vi 2>

## UI / UX

### ASCII Wireframe

```txt
<ASCII wireframe>
```

### Screen Regions

| Region | Description |
| --- | --- |
| <Region name> | <Purpose / content> |

### Actions

| Action | Trigger | Availability | Result |
| --- | --- | --- | --- |
| <Action name> | <Button/menu/link> | <When available> | <Expected result> |

### Screen States

| State | Condition | Expected Behavior |
| --- | --- | --- |
| Default | <condition> | <behavior> |
| Loading | <condition> | <behavior> |
| Empty | <condition> | <behavior> |
| No result | <condition> | <behavior> |
| Error | <condition> | <behavior> |
| Success | <condition> | <behavior> |

## Data Model / Fields

### Business Entity Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| <Field name> | <Text/Date/Enum/File/etc.> | <Yes/No/TBD(BA)> | <PMIS/MSM/User input/System/etc.> | <Rule or TBD(BA)> |

### Search / Filter Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| <Field name> | <Text/Date/Enum/etc.> | <Yes/No/TBD(BA)> | <User input/System/etc.> | <Rule or TBD(BA)> |

### Display / Derived Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| <Field name> | <Text/Number/List/etc.> | <Yes/No/TBD(BA)> | <Derived/System/Workflow/etc.> | <Rule or TBD(BA)> |

### Selection / Interaction Fields

| Field | Type | Required | Source | Validation |
| --- | --- | --- | --- | --- |
| <Field name> | <Boolean/List/Object/etc.> | <Yes/No/TBD(BA)> | <User input/UI state/etc.> | <Rule or TBD(BA)> |

## Business Rules

### Workflow Rules

- `<Rule ID>`: <rule>

### Permission Rules

- `<Rule ID>`: <rule>

### Validation Rules

- `<Rule ID>`: <rule>

### Lifecycle Rules

- `<Rule ID>`: <rule>

### Other Business Rules

- `<Rule ID>`: <rule>

## Acceptance Criteria

### FE-visible AC

1. <User-visible behavior>
2. <User-visible behavior>

### BE / API AC

1. <Data/query/persistence/integration behavior>
2. <Data/query/persistence/integration behavior>

### Validation / Error AC

1. <Validation behavior>
2. <Error handling behavior>

## Open Questions / TBD

| Item | Owner | Impact |
| --- | --- | --- |
| <Question or TBD> | <BA/FE/BE/PO/UX/TBD> | <What is blocked or affected> |
````

## Final Response

After normalizing, respond with:

```txt
Created/updated:
- <feature-spec path>

Source files used:
- <path>

Open questions:
- <question or "None">

Notes:
- <short normalization notes>
```

Keep the response concise.

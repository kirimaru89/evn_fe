---
name: feature-spec-to-api-contract
description: Derive a draft FE/BE API contract from a product-level Feature Spec in this EVN project. Use after feature-spec-normalizer and verify-feature-spec when frontend implementation needs request/response/error contracts. Reads feature-spec.md and creates api-contract.md without inventing endpoint URLs, database schema, backend services, DTO filenames, or BE domain model decisions.
---

# Feature Spec To API Contract

Use this skill to derive a draft API contract from a product-level Feature Spec.

The API contract is the FE/BE boundary for implementing a feature. It describes API capabilities, query inputs, response shape, mutation inputs, validation/error behavior, and unresolved BE confirmation items. It does not define backend architecture.

## Inputs

Required:

```txt
.specs/<module>/<feature-folder>/feature-spec.md
```

Reference files:

```txt
AGENTS.md
docs/architecture/PROJECT_STRUCTURE.md
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
.specs/<module>/<feature-folder>/api-contract.md
```

If the user asks for a different path, use that path as long as it stays under `.specs/<module>/`.

## Hard Boundaries

Do not invent:

- endpoint URLs
- HTTP methods
- database tables
- backend service names
- DTO filenames
- aggregate roots
- persistence model
- authentication implementation
- permission internals
- final enum values when Feature Spec marks them unresolved

Only include endpoint URL or HTTP method when the Feature Spec or source material explicitly provides it.

Use product/API operation names instead:

```txt
List CBM plans
Get CBM plan filter options
Delete CBM plan
Bulk delete CBM plans
Transfer CBM plan to execution
```

When the contract is derived from product behavior rather than confirmed BE design, mark it:

```txt
Status: Draft
Needs BE confirmation: Yes
```

## What To Read From Feature Spec

Read these sections with this intent:

Metadata:

- module, module slug, feature ID, use case ID, screen ID, version, source documents
- use for API contract metadata

User Story and Business Context:

- infer whether the feature is list/query, detail, create, update, delete, import, sync, workflow action, or mixed
- identify the main API capabilities needed

Scope / Out of Scope:

- generate API contract only for in-scope behavior
- list out-of-scope operations only under `Contract Scope > Out of Scope`
- do not add out-of-scope operations to `API Capabilities`

UI / UX Actions:

- identify operations that likely need API support
- do not turn visible actions into API operations when the action is out of scope

UI / UX Screen States:

- derive loading, empty, no-result, validation, timeout, failed mutation, and system error cases

Data Model / Fields:

- `Business Entity Fields` -> response item fields
- `Search / Filter Fields` -> query/filter params
- `Display / Derived Fields` -> response metadata or client-derived values
- `Selection / Interaction Fields` -> mutation inputs or client-side interaction state

Business Rules:

- derive server-side constraints and validation expectations
- include permission scope, workflow action availability, lifecycle constraints, data-source constraints, pagination, and shared validation rules

Acceptance Criteria:

- ensure every BE/API AC and validation/error AC is covered
- use FE-visible ACs to confirm response data needed by the UI

Open Questions / TBD:

- copy API-relevant unresolved questions into the contract
- mark the contract as requiring BE confirmation when API-relevant TBDs exist

## Output Template

Use this exact section structure:

````md
# API Contract: <Feature Name>

## Metadata

| Field | Value |
| --- | --- |
| Module | <module label> |
| Module slug | <module slug> |
| Feature ID | <ID or TBD> |
| Use Case ID | <ID or TBD> |
| Screen ID | <ID or TBD> |
| Feature Spec | <relative path> |
| Contract status | Draft |
| Needs BE confirmation | Yes/No |
| Source documents | <source docs> |

## Contract Scope

### In Scope

- <API-supported behavior derived from feature scope>

### Out of Scope

- <Related behavior not covered by this contract>

## API Capabilities

| Capability | Product Operation | Scope | Confirmation |
| --- | --- | --- | --- |
| <Capability name> | <Operation intent, not endpoint URL> | <In scope / Related / Out of scope> | <Confirmed / Draft / TBD(BE)> |

## Query Contracts

### <Query Name>

Purpose: <what this query returns and why>

| Param | Type | Required | Source Feature Field | Validation / Notes |
| --- | --- | --- | --- | --- |
| <paramName> | <Text/Date/Enum/Number/etc.> | <Yes/No/TBD> | <Feature field> | <rule or TBD> |

## Response Contracts

### <Response Name>

| Field | Type | Required | Source Feature Field | Notes |
| --- | --- | --- | --- | --- |
| <fieldName> | <Text/Date/Enum/List/Object/etc.> | <Yes/No/TBD> | <Feature field> | <notes> |

### Pagination / Metadata

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| <fieldName> | <Number/Text/etc.> | <Yes/No/TBD> | <notes> |

## Mutation Contracts

### <Mutation Name>

Purpose: <what state/action this mutation changes>

| Input | Type | Required | Source | Validation / Notes |
| --- | --- | --- | --- | --- |
| <inputName> | <Text/List/etc.> | <Yes/No/TBD> | <Feature field/rule> | <rule or TBD> |

Expected result:

- <success behavior>

## Error Contract

| Error Case | Trigger | Expected API Behavior | Expected FE Behavior | Source |
| --- | --- | --- | --- | --- |
| <case> | <condition> | <behavior or TBD(BE)> | <behavior> | <Feature Spec rule/AC/state> |

## Validation And Permission Contract

| Rule | API Responsibility | FE Responsibility | Source |
| --- | --- | --- | --- |
| <rule> | <responsibility> | <responsibility> | <Feature Spec rule/AC> |

## Data Source Notes

| Data | Source System | Contract Note |
| --- | --- | --- |
| <data> | <PMIS/MSM/System/etc.> | <note or TBD(BE)> |

## Open Questions / TBD

| Item | Owner | Impact |
| --- | --- | --- |
| <question> | <BE/BA/FE/TBD> | <impact> |
````

## Derivation Rules

Query params:

- Derive params from `Search / Filter Fields`.
- Use stable descriptive names in camelCase only when no source name exists.
- Mark enum values as `TBD(BA/BE)` when Feature Spec has unresolved labels.
- Include pagination when Feature Spec mentions pagination, current range, total records, page size, or paging rules.

Response fields:

- Derive item fields from `Business Entity Fields`.
- Derive metadata fields from `Display / Derived Fields`.
- Do not include UI-only `Selection / Interaction Fields` in the response unless Feature Spec says the API returns them.
- `Actions` may become `availableActions` only as a draft option. If Feature Spec does not say API returns available actions, mark as `TBD(BE): API returns action availability or FE derives from workflow rules`.

Mutations:

- Derive mutation contracts from in-scope actions and business rules.
- If an action is visible but out of scope, list it under `Contract Scope > Out of Scope`, not under `API Capabilities` or `Mutation Contracts`.
- For delete/update/transfer actions, include validation/error cases from workflow and lifecycle rules.

Error cases:

- Include invalid filters, permission/scope failures, invalid workflow status, validation failures, failed mutations, empty/no-result, timeout/system error when present in Feature Spec.
- Do not invent numeric error codes. Use semantic error case names unless codes are provided.

Open questions:

- Carry forward unresolved API-relevant questions from Feature Spec.
- Add derived API questions when the implementation boundary is ambiguous, for example:
  - whether action availability is returned by API or derived by FE
  - whether filter options are fetched separately or bundled with list response
  - whether export uses current filters or all data

## Final Response

After generating the contract, respond with:

```txt
Created/updated:
- <api-contract path>

Source files used:
- <feature-spec path>

Open questions:
- <question or "None">

Notes:
- <short notes about draft/confirmation status>
```

Keep the response concise.

# Project Structure

This repository is a multi-application enterprise frontend. The active modules are Admin, Portal MSM, and Thí nghiệm CBM. Folder names for business modules use Vietnamese slugs without accents. UI labels should keep the full Vietnamese business names.

## Application Routes

Next.js App Router routes live in `app/`.

```txt
app/
  admin/
  portal-msm/
  thi-nghiem-cbm/
  system/
```

Use these folders for route segments, pages, layouts, loading states, and route-level composition. Do not place reusable business logic directly in page files.

## Local Specification Cache

Externally owned feature, layout, and screen specifications can be synced into `.specs/` for local agent access.

```txt
.specs/
  admin/
  portal-msm/
  thi-nghiem-cbm/
```

Use `.specs/<module>/` for module-specific specifications, including use cases, screen specs, layout specs, validation rules, and FE implementation notes.

The `.specs/` folder is ignored by Git because these documents are originally stored outside this repository.

Spec files should preserve the module code or screen code in the filename when available.

```txt
.specs/thi-nghiem-cbm/CBM-UC-01.md
.specs/thi-nghiem-cbm/CBM-SCR-01.md
.specs/portal-msm/MSM-UC-01.md
.specs/admin/ADMIN-UC-01.md
```

When implementing a feature, read the relevant local cached Feature Spec before changing code. If the cached file was synced from an external system, treat the cached Feature Spec as the local implementation reference.

Use `docs/templates/FEATURE_SPEC_TEMPLATE.md` for local synced specs. Specs should include user story, description, ASCII UI layout, business rules, data fields, shared rule references, related document links, acceptance criteria, and CR/version information when applicable.

## Components

```txt
components/
  ds/
  ui/
  shared/
  admin/
  portal-msm/
  thi-nghiem-cbm/
```

- `components/ds/`: project design-system wrappers. Prefer these first.
- `components/ui/`: raw shadcn/ui primitives.
- `components/shared/`: reusable enterprise UI shared across modules.
- `components/<module>/`: module-specific UI components.

Do not bypass DS wrappers unless no suitable wrapper exists.

## Library Code

```txt
lib/
  shared-api-client/
    client.ts
    errors.ts
    endpoints.ts
    types.ts
    auth.ts

  shared/
  lifecycle/
  permissions/
  validation/
  mappings/

  admin/
    api/
  portal-msm/
    api/
  thi-nghiem-cbm/
    api/
```

- `lib/shared-api-client/`: shared HTTP request infrastructure, including base client, auth headers, response parsing, error normalization, and common API types.
- `lib/<module>/api/`: backend endpoint functions for each business module.
- `lib/lifecycle/`: centralized workflow and readonly lifecycle logic.
- `lib/permissions/`: centralized permission checks.
- `lib/validation/`: deterministic validation rules.
- `lib/mappings/`: shared mappings, including status and display mappings when appropriate.
- `lib/shared/`: non-UI utilities shared across modules.

Pages, components, and hooks must not define raw backend HTTP requests directly.

Preferred dependency flow:

```txt
app / components
  -> hooks/<module>/
    -> lib/<module>/api/
      -> lib/shared-api-client/
```

## Constants

```txt
constants/
  workflow/
  status/
  permissions/
  navigation/
```

Use constants for canonical workflow states, status values, permission identifiers, and navigation definitions. Do not hardcode workflow states, status labels, or permissions inside components.

Vietnamese workflow labels must remain canonical:

```txt
Nháp
Chờ duyệt
Đã duyệt
Từ chối
```

## Hooks

```txt
hooks/
  shared/
  admin/
  portal-msm/
  thi-nghiem-cbm/
```

Hooks may orchestrate UI state and call API functions from `lib/<module>/api/`. Hooks should not contain raw `fetch` or `axios` request logic.

## Mock Data

```txt
mock-data/
  admin/
  portal-msm/
  thi-nghiem-cbm/
```

Mock data must be typed, realistic, and enterprise-oriented. Include multiple organizations, statuses, lifecycle states, timestamps, and edge cases required by the Feature Spec.

## Types

```txt
types/
  shared/
  admin/
  portal-msm/
  thi-nghiem-cbm/
```

Use `types/shared/` for cross-module types. Use `types/<module>/` for module-specific domain types. Avoid duplicate type definitions.

## Module Slugs and Labels

Use stable Vietnamese slugs without accents for folders and routes.

```txt
admin
portal-msm
thi-nghiem-cbm
```

Use full Vietnamese labels in navigation and UI configuration.

```ts
export const APP_MODULES = [
  { id: "admin", label: "Admin", href: "/admin" },
  { id: "portal-msm", label: "Portal MSM (báo cáo)", href: "/portal-msm" },
  { id: "thi-nghiem-cbm", label: "Thí nghiệm CBM", href: "/thi-nghiem-cbm" },
]
```

## Placement Rules

- Put route files in `app/<module>/`.
- Put synced local feature and screen specs in `.specs/<module>/`.
- Put reusable DS wrappers in `components/ds/`.
- Put raw shadcn primitives in `components/ui/`.
- Put module-specific components in `components/<module>/`.
- Put shared backend client infrastructure in `lib/shared-api-client/`.
- Put module-specific backend endpoint functions in `lib/<module>/api/`.
- Put workflow logic in `lib/lifecycle/`.
- Put permission logic in `lib/permissions/`.
- Put validation logic in `lib/validation/`.
- Put canonical workflow, status, permission, and navigation constants in `constants/`.
- Put React hooks in `hooks/<module>/` or `hooks/shared/`.
- Put typed mock data in `mock-data/<module>/`.
- Put shared and module-specific types in `types/`.

Do not create empty architecture folders unless they are needed by the current implementation.

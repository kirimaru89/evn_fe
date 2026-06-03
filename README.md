# MSM Portal Frontend

Frontend repository for MSM Portal — EVNNPC NPSC.

Stack:

- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- Project DS wrapper layer

## Active Modules

```txt
admin
portal-msm
thi-nghiem-cbm
```

Module folders use Vietnamese slugs without accents. UI labels should use the full Vietnamese business names.

## Key Documents

```txt
AGENTS.md
CONTRIBUTING.md
docs/architecture/PROJECT_STRUCTURE.md
docs/architecture/DESIGN_SYSTEM.md
docs/templates/FEATURE_SPEC_TEMPLATE.md
```

Use `AGENTS.md` for project-specific AI agent rules.

Use `CONTRIBUTING.md` for the AI-assisted FE workflow.

## Feature Spec Workflow

Feature Specs are synced locally into:

```txt
.specs/<module>/<FEATURE-CODE>.md
```

Example:

```txt
.specs/thi-nghiem-cbm/CBM-UC-01.md
```

`.specs/` is a local cache and is ignored by Git.

Standard workflow:

```txt
1. Sync Feature Spec
2. Verify Feature Spec
3. Implement Feature Spec
4. Review Feature Diff
```

Local workspace skills:

```txt
verify-feature-spec
implement-feature-spec
review-feature-diff
vercel-react-best-practices
```

## Component Rules

Before creating a new UI component, inspect and reuse in this order:

```txt
components/ds/
components/shared/
components/ui/
components/<module>/
```

`components/ui/` contains raw shadcn primitives.

`components/ds/` contains project DS wrappers and should be preferred.

`components/shared/` contains shared enterprise components.

## Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Validate:

```bash
npm run lint
npm run typecheck
npm run build
```

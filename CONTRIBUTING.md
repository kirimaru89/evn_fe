# Contributing

Quy trình làm FE bằng AI agent:

```txt
1. Sync Feature Spec
2. Verify Feature Spec
3. Implement Feature Spec
4. Review kết quả
```

## 1. Sync Feature Spec

Đưa spec từ nguồn ngoài về local (Notion, Confluence page, Azure):

```txt
.specs/<module>/<FEATURE-CODE>.md
```

Modules hiện có:

```txt
admin
portal-msm
thi-nghiem-cbm
```

Ví dụ:

```txt
.specs/thi-nghiem-cbm/CBM-UC-01.md
```

`.specs/` chỉ là cache local và không commit lên Git.

## 2. Verify Feature Spec

Trước khi code, yêu cầu AI agent verify spec:

```txt
Verify .specs/thi-nghiem-cbm/CBM-UC-01.md using docs/templates/FEATURE_SPEC_TEMPLATE.md.
Report Ready for implementation: Yes/No.
List blocking issues, warnings, and assumptions.
```

Chỉ implement khi spec đủ rõ hoặc các TODO/assumption đã được chấp nhận.

## 3. Implement Feature Spec

Prompt mẫu:

```txt
Implement .specs/thi-nghiem-cbm/CBM-UC-01.md.

Follow AGENTS.md.
Use docs/architecture/PROJECT_STRUCTURE.md.
Use docs/architecture/DESIGN_SYSTEM.md.
Use existing components before creating new ones.
Use vercel-react-best-practices for React/Next.js implementation.
Do not invent business rules.
Run lint and typecheck after implementation.
```

AI agent phải reuse trước khi tạo mới:

```txt
components/ds/
components/shared/
components/ui/
components/<module>/
```

## 4. Review Kết Quả

Kiểm tra nhanh:

- Màn hình đúng spec/layout
- Text tiếng Việt đúng
- Field, validation, action đúng spec
- Loading/error/empty state đầy đủ
- Không tự bịa rule/API/workflow
- File đặt đúng module
- Có reuse component sẵn có

## 5. Sửa Sau Review

Prompt mẫu:

```txt
Update .specs/thi-nghiem-cbm/CBM-UC-01.md implementation.

Change:
- <mô tả thay đổi>

Keep existing structure.
Do not rewrite unrelated files.
Follow AGENTS.md and existing DS components.
```

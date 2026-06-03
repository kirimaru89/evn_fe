import { FileText } from "lucide-react"

import { DSStatusBadge, type DSDataTableColumn } from "@/components/ds"

import type { PatternRow } from "./demo-data"

const patternColumns = [
  {
    key: "record",
    header: "Bản ghi",
    accessor: (row) => row.title,
    renderLeading: () => (
      <span
        aria-hidden="true"
        className="flex size-7 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground"
      >
        <FileText className="size-3.5" />
      </span>
    ),
    render: (_value, row) => (
      <span className="block truncate font-medium">{row.title}</span>
    ),
  },
  {
    key: "category",
    header: "Danh mục",
    accessor: "category",
    hideable: true,
  },
  {
    key: "owner",
    header: "Chủ sở hữu",
    accessor: "owner",
    hideable: true,
  },
  {
    key: "status",
    header: "Trạng thái",
    accessor: "status",
    render: (_value, row) => (
      <DSStatusBadge status={row.status}>{row.statusLabel}</DSStatusBadge>
    ),
    hideable: true,
  },
  {
    key: "meta",
    header: "Thông tin",
    accessor: "meta",
    align: "right",
    sortable: true,
    sortKey: "meta",
    hideable: true,
  },
] satisfies readonly DSDataTableColumn<PatternRow>[]

export { patternColumns }

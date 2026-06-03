import {
  DSBadge,
  DSButton,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSInput,
  DSSection,
} from "@/components/ds"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { kpis } from "../_data/demo-data"

export function OverviewSection() {
  return (
    <>
      <header className="flex flex-col gap-6 border-b border-border pb-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <DSBadge variant="outline">Playground shadcn</DSBadge>
            <DSBadge variant="secondary">Quản trị doanh nghiệp</DSBadge>
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-medium tracking-normal sm:text-4xl">
              Trung tâm điều khiển Design System
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Bản xem trước cục bộ của hệ thống giao diện hiện tại, sử dụng
              component shadcn và token biến CSS sẵn có.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select defaultValue="quarter">
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Kỳ báo cáo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kỳ báo cáo</SelectLabel>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">Tuần này</SelectItem>
                <SelectItem value="month">Tháng này</SelectItem>
                <SelectItem value="quarter">Quý này</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <DSButton variant="outline">Xuất nhật ký kiểm toán</DSButton>
          <Dialog>
            <DialogTrigger asChild>
              <DSButton>Tạo quy trình</DSButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo quy trình phê duyệt</DialogTitle>
                <DialogDescription>
                  Cấu hình quy trình có kiểm soát cho phê duyệt, ngoại lệ và
                  theo dõi vận hành.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="workflow">
                    Tên quy trình
                  </label>
                  <DSInput id="workflow" placeholder="Rà soát truy cập hằng quý" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nhóm phụ trách</label>
                  <Select defaultValue="operations">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn nhóm phụ trách" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">Vận hành</SelectItem>
                      <SelectItem value="finance">Tài chính</SelectItem>
                      <SelectItem value="security">Bảo mật</SelectItem>
                      <SelectItem value="legal">Pháp chế</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter showCloseButton>
                <DSButton>Tạo quy trình</DSButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <DSSection className="md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <DSCard key={kpi.label}>
            <DSCardHeader className="pb-2">
              <DSCardDescription>{kpi.label}</DSCardDescription>
              <DSCardTitle className="font-heading text-2xl font-medium">
                {kpi.value}
              </DSCardTitle>
            </DSCardHeader>
            <DSCardContent className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                {kpi.helper}
              </span>
              <DSBadge
                variant={
                  kpi.tone === "negative"
                    ? "destructive"
                    : kpi.tone === "neutral"
                      ? "secondary"
                      : "default"
                }
              >
                {kpi.delta}
              </DSBadge>
            </DSCardContent>
          </DSCard>
        ))}
      </DSSection>
    </>
  )
}

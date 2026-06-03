"use client"

import { useState } from "react"

import {
  DSBadge,
  DSButton,
  DSCalendar,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSConfirmDialog,
  DSDatePicker,
  DSInput,
  DSSearchInput,
  DSSelectField,
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

export function FormsSection() {
  const [defaultConfirmOpen, setDefaultConfirmOpen] = useState(false)
  const [destructiveConfirmOpen, setDestructiveConfirmOpen] = useState(false)
  const [reviewDate, setReviewDate] = useState<Date | undefined>(
    new Date(2026, 4, 8)
  )

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <DSCard>
        <DSCardHeader>
          <DSCardTitle>Điều khiển biểu mẫu</DSCardTitle>
          <DSCardDescription>
            Input và select trong một luồng quản trị thực tế.
          </DSCardDescription>
        </DSCardHeader>
        <DSCardContent className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="account">
              Tài khoản
            </label>
            <DSInput
              id="account"
              defaultValue="Vega Vận hành"
              placeholder="Nhập tên tài khoản"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="owner">
              Chủ sở hữu yêu cầu
            </label>
            <DSSearchInput
              id="owner"
              placeholder="Tìm theo tên hoặc nhóm"
              aria-label="Tìm chủ sở hữu yêu cầu"
            />
          </div>
          <DSSelectField
            id="priority"
            label="Mức ưu tiên"
            defaultValue="medium"
            options={[
              { label: "Thấp", value: "low" },
              { label: "Trung bình", value: "medium" },
              { label: "Cao", value: "high" },
              { label: "Nghiêm trọng", value: "critical" },
            ]}
            placeholder="Chọn mức ưu tiên"
          />
          <DSDatePicker
            id="review-date"
            label="Ngày rà soát"
            description="Dùng cho SLA và nhắc kiểm toán."
            value={reviewDate}
            onChange={setReviewDate}
            placeholder="Chọn ngày rà soát"
          />
          <DSDatePicker
            id="disabled-review-date"
            label="Ngày rà soát bị khóa"
            value={new Date(2026, 4, 15)}
            disabled
          />
          <DSDatePicker
            id="errored-review-date"
            label="Hạn bằng chứng"
            error="Chọn hạn trước khi phát hành."
            placeholder="Chọn hạn"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <DSButton className="sm:w-fit">Gửi yêu cầu</DSButton>
            <DSButton className="sm:w-fit" variant="outline">
              Lưu nháp
            </DSButton>
          </div>
        </DSCardContent>
      </DSCard>

      <DSCard>
        <DSCardHeader>
          <DSCardTitle>Lịch</DSCardTitle>
          <DSCardDescription>
            Lịch primitive được bọc để dùng trong DS và các bộ lọc khoảng ngày.
          </DSCardDescription>
        </DSCardHeader>
        <DSCardContent>
          <DSCalendar
            mode="single"
            selected={reviewDate}
            onSelect={setReviewDate}
          />
        </DSCardContent>
      </DSCard>

      <DSCard>
        <DSCardHeader>
          <DSCardTitle>Demo hộp thoại</DSCardTitle>
          <DSCardDescription>
            Xác nhận dạng modal cho thay đổi vận hành có kiểm soát.
          </DSCardDescription>
        </DSCardHeader>
        <DSCardContent className="grid gap-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">
                  Phê duyệt lô rà soát truy cập
                </div>
                <p className="text-sm text-muted-foreground">
                  18 yêu cầu đã sẵn sàng phê duyệt sau khi kiểm tra chính sách
                  và chủ sở hữu.
                </p>
              </div>
              <DSBadge variant="secondary">Sẵn sàng</DSBadge>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <DSButton className="w-fit">Mở hộp thoại phê duyệt</DSButton>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Phê duyệt lô rà soát truy cập</DialogTitle>
                <DialogDescription>
                  Xác nhận phê duyệt 18 yêu cầu. Hệ thống sẽ thông báo cho chủ
                  sở hữu và ghi sự kiện kiểm toán.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-2">
                <label className="text-sm font-medium" htmlFor="note">
                  Ghi chú phê duyệt
                </label>
                <DSInput id="note" placeholder="Ghi chú tùy chọn của người rà soát" />
              </div>
              <DialogFooter showCloseButton>
                <DSButton>Phê duyệt lô</DSButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Pattern xác nhận</div>
              <p className="text-sm text-muted-foreground">
                Xác nhận tái sử dụng cho thay đổi trạng thái và thao tác phá hủy.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <DSButton
                className="sm:w-fit"
                onClick={() => setDefaultConfirmOpen(true)}
                variant="outline"
              >
                Kích hoạt truy cập
              </DSButton>
              <DSButton
                className="sm:w-fit"
                onClick={() => setDestructiveConfirmOpen(true)}
                variant="destructive"
              >
                Vô hiệu hóa truy cập
              </DSButton>
            </div>
          </div>

          <DSConfirmDialog
            open={defaultConfirmOpen}
            onOpenChange={setDefaultConfirmOpen}
            title="Kích hoạt truy cập?"
            description="Tài khoản này sẽ có thể truy cập hệ thống trở lại."
            confirmLabel="Kích hoạt truy cập"
            onConfirm={async () => {
              await new Promise((resolve) => window.setTimeout(resolve, 400))
              setDefaultConfirmOpen(false)
            }}
          />
          <DSConfirmDialog
            open={destructiveConfirmOpen}
            onOpenChange={setDestructiveConfirmOpen}
            title="Vô hiệu hóa truy cập?"
            description="Tài khoản này sẽ không còn quyền truy cập hệ thống."
            confirmLabel="Vô hiệu hóa truy cập"
            variant="destructive"
            onConfirm={() => setDestructiveConfirmOpen(false)}
          />
        </DSCardContent>
      </DSCard>
    </div>
  )
}

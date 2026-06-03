"use client"

import {
  DSBadge,
  DSButton,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSDataTable,
  DSFilterBar,
  DSKpiCard,
  DSSection,
  DSStateError,
} from "@/components/ds"
import { patternRows } from "../_data/demo-data"
import { patternColumns } from "../_data/table-config"

export function StatesSection() {
  return (
    <DSSection>
      <div className="flex flex-col gap-2">
        <DSBadge className="w-fit" variant="outline">
          Trạng thái và phản hồi
        </DSBadge>
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-medium">
            Trạng thái tương tác chuẩn hóa
          </h2>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            Pattern tải, trống, lỗi và vô hiệu dùng chung với ngữ nghĩa hỗ trợ
            truy cập rõ ràng cho luồng doanh nghiệp.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DSKpiCard
          title="KPI đang tải"
          description="Đang lấy dữ liệu nguồn"
          loading
        />
        <DSKpiCard
          title="KPI bị vô hiệu"
          value="$0"
          description="Bị khóa bởi quyền truy cập"
          trend="Bị giới hạn"
          tone="neutral"
          disabled
        />
        <DSKpiCard
          title="KPI trống"
          description="Chưa có bản ghi được phê duyệt trong phân khúc này"
          empty
        />
        <DSKpiCard
          title="KPI lỗi"
          error="Dịch vụ chỉ số trả về phản hồi không khả dụng."
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DSCard>
          <DSCardHeader>
            <DSCardTitle>Bảng đang tải</DSCardTitle>
            <DSCardDescription>
              Trạng thái tải cung cấp văn bản trạng thái cho công nghệ hỗ trợ,
              trong khi hàng skeleton trang trí được ẩn.
            </DSCardDescription>
          </DSCardHeader>
          <DSCardContent className="grid gap-4">
            <DSFilterBar
              loading
              filterLabel="Bộ lọc trạng thái đang tải"
              searchPlaceholder="Tìm kiểm soát..."
              filterPlaceholder="Trạng thái"
              filterOptions={[
                { label: "Tất cả", value: "all" },
                { label: "Đang hoạt động", value: "active" },
              ]}
              actions={
                <DSButton loading variant="outline">
                  Đang đồng bộ
                </DSButton>
              }
            />
            <DSDataTable
              columns={patternColumns}
              data={[]}
              loading
              loadingMessage="Đang tải kiểm soát vận hành."
              renderActions={() => (
                <DSButton disabled size="sm" variant="outline">
                  Đang tải
                </DSButton>
              )}
            />
          </DSCardContent>
        </DSCard>

        <DSCard>
          <DSCardHeader>
            <DSCardTitle>Bảng trống</DSCardTitle>
            <DSCardDescription>
              Trạng thái trống dùng tiêu đề, mô tả rõ ràng và thao tác khôi
              phục tùy chọn.
            </DSCardDescription>
          </DSCardHeader>
          <DSCardContent className="grid gap-4">
            <DSFilterBar
              filterLabel="Bộ lọc trạng thái ngoại lệ"
              searchPlaceholder="Tìm ngoại lệ..."
              filterPlaceholder="Trạng thái"
              filterOptions={[
                { label: "Tất cả", value: "all" },
                { label: "Bị chặn", value: "blocked" },
              ]}
              actions={
                <DSButton variant="outline" disabled>
                  Xóa bộ lọc
                </DSButton>
              }
            />
            <DSDataTable
              columns={patternColumns}
              data={[]}
              emptyMessage="Không có kiểm soát bị chặn nào khớp với bộ lọc đã chọn."
              renderActions={() => (
                <DSButton disabled size="sm" variant="outline">
                  Mở
                </DSButton>
              )}
            />
          </DSCardContent>
        </DSCard>

        <DSCard>
          <DSCardHeader>
            <DSCardTitle>Trạng thái lỗi</DSCardTitle>
            <DSCardDescription>
              Trạng thái lỗi dùng ngữ nghĩa cảnh báo và có thể liên kết với vùng
              bị ảnh hưởng.
            </DSCardDescription>
          </DSCardHeader>
          <DSCardContent className="grid gap-4">
            <DSStateError
              title="Không thể tải kiểm soát"
              description="API quản trị không trả về phản hồi hợp lệ cho hệ thống này."
              action={<DSButton variant="outline">Thử lại yêu cầu</DSButton>}
            />
            <DSDataTable
              columns={patternColumns}
              data={[]}
              error="Không thể tải bản ghi kiểm soát. Hãy thử lại sau khi đồng bộ hiện tại hoàn tất."
              renderActions={() => (
                <DSButton disabled size="sm" variant="outline">
                  Thử lại
                </DSButton>
              )}
            />
          </DSCardContent>
        </DSCard>

        <DSCard>
          <DSCardHeader>
            <DSCardTitle>Điều khiển bị vô hiệu</DSCardTitle>
            <DSCardDescription>
              Trạng thái vô hiệu giữ nguyên bố cục trong khi ngăn tương tác bộ
              lọc và thao tác dòng.
            </DSCardDescription>
          </DSCardHeader>
          <DSCardContent className="grid gap-4">
            <DSFilterBar
              disabled
              filterLabel="Trạng thái hệ thống bị khóa"
              searchPlaceholder="Tìm hệ thống bị khóa..."
              filterPlaceholder="Trạng thái"
              filterOptions={[
                { label: "Tất cả", value: "all" },
                { label: "Đang chờ", value: "pending" },
              ]}
              actions={
                <DSButton disabled variant="outline">
                  Đã khóa
                </DSButton>
              }
            />
            <DSDataTable
              columns={patternColumns}
              data={patternRows.slice(0, 2)}
              disabled
              getRowId={(row) => row.id}
              renderActions={(row, { disabled }) => (
                <DSButton
                  disabled={disabled}
                  size="sm"
                  variant={row.actionVariant}
                >
                  {row.actionLabel}
                </DSButton>
              )}
            />
          </DSCardContent>
        </DSCard>
      </div>
    </DSSection>
  )
}

import {
  ArrowRight,
  Download,
  Plus,
  Settings2,
} from "lucide-react"

import {
  DSBadge,
  DSButton,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSIconButtonTooltip,
  DSSearchInput,
  DSSpinner,
  DSStateEmpty,
  DSStatusBadge,
} from "@/components/ds"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  activity,
  badgeVariantByStatus,
  buttonVariants,
  requests,
  statusMatrix,
} from "../_data/demo-data"
import { FormsSection } from "./forms-section"

export function TableSection() {
  return (
    <Tabs defaultValue="dashboard" className="gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <TabsList className="w-fit">
          <TabsTrigger value="dashboard">Tổng quan</TabsTrigger>
          <TabsTrigger value="components">Component</TabsTrigger>
          <TabsTrigger value="forms">Biểu mẫu</TabsTrigger>
          <TabsTrigger value="states">Trạng thái</TabsTrigger>
        </TabsList>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <DSSearchInput
            className="w-full sm:w-72"
            placeholder="Tìm tài khoản, yêu cầu, chủ sở hữu..."
            aria-label="Tìm tài khoản, yêu cầu, chủ sở hữu"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DSButton variant="outline">Thao tác hệ thống</DSButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hệ thống</DropdownMenuLabel>
              <DropdownMenuItem>Làm mới dữ liệu</DropdownMenuItem>
              <DropdownMenuItem>Gán mục đã chọn</DropdownMenuItem>
              <DropdownMenuItem>Tải CSV</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                Leo thang ngoại lệ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <TabsContent value="dashboard">
        <div className="grid gap-5 xl:grid-cols-[1.5fr_0.85fr]">
          <DSCard>
            <DSCardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1.5">
                <DSCardTitle>Hàng đợi yêu cầu vận hành</DSCardTitle>
                <DSCardDescription>
                  Khối lượng công việc doanh nghiệp với chủ sở hữu, ưu tiên và
                  trạng thái SLA.
                </DSCardDescription>
              </div>
              <div className="flex gap-2">
                <DSButton variant="outline" size="sm">
                  Lọc
                </DSButton>
                <DSButton size="sm">Rà soát mục đã chọn</DSButton>
              </div>
            </DSCardHeader>
            <DSCardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Yêu cầu</TableHead>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Chủ sở hữu</TableHead>
                    <TableHead>Ưu tiên</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hạn</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.account}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.type}
                      </TableCell>
                      <TableCell>{request.owner}</TableCell>
                      <TableCell>{request.priority}</TableCell>
                      <TableCell>
                        <DSBadge variant={badgeVariantByStatus[request.status]}>
                          {request.status}
                        </DSBadge>
                      </TableCell>
                      <TableCell className="text-right">{request.due}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DSCardContent>
          </DSCard>

          <div className="grid gap-5">
            <DSCard>
              <DSCardHeader>
                <DSCardTitle>Sức khỏe hệ thống</DSCardTitle>
                <DSCardDescription>
                  Thành phần trạng thái dựa trên token.
                </DSCardDescription>
              </DSCardHeader>
              <DSCardContent className="grid gap-4">
                {[
                  ["Khả dụng API", "99.98%", "w-[92%]", "bg-primary"],
                  ["Thông lượng hàng đợi", "84%", "w-[84%]", "bg-primary/70"],
                  ["Tỷ lệ ngoại lệ", "7%", "w-[18%]", "bg-destructive"],
                ].map(([label, value, width, color]) => (
                  <div className="grid gap-2" key={label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-md bg-muted">
                      <div className={`h-full rounded-md ${width} ${color}`} />
                    </div>
                  </div>
                ))}
              </DSCardContent>
            </DSCard>

            <DSCard>
              <DSCardHeader>
                <DSCardTitle>Hoạt động gần đây</DSCardTitle>
                <DSCardDescription>
                  Xem trước timeline thân thiện với kiểm toán.
                </DSCardDescription>
              </DSCardHeader>
              <DSCardContent className="grid gap-4">
                {activity.map((item) => (
                  <div
                    className="grid gap-1 border-b border-border pb-4 last:border-b-0 last:pb-0"
                    key={item.title}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.meta}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </DSCardContent>
            </DSCard>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="components">
        <div className="grid gap-5 lg:grid-cols-2">
          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Biến thể nút</DSCardTitle>
              <DSCardDescription>
                Phân cấp thao tác, kích thước, trạng thái vô hiệu và tải.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-5">
              <div className="flex flex-wrap gap-2">
                {buttonVariants.map((variant) => (
                  <DSButton key={variant} variant={variant}>
                    {variant}
                  </DSButton>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DSButton size="sm">Nhỏ</DSButton>
                <DSButton>Mặc định</DSButton>
                <DSButton size="lg">Lớn</DSButton>
                <DSButton disabled>Vô hiệu</DSButton>
                <DSButton loading>
                  Đang đồng bộ
                </DSButton>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <DSButton leftIcon={<Plus />}>Icon đầu</DSButton>
                <DSButton rightIcon={<ArrowRight />} variant="outline">
                  Icon cuối
                </DSButton>
                <DSButton loading leftIcon={<Plus />} variant="outline">
                  Đang tải kèm icon
                </DSButton>
                <DSIconButtonTooltip label="Tải báo cáo">
                  <DSButton
                    aria-label="Tải báo cáo"
                    leftIcon={<Download />}
                    size="icon-sm"
                    variant="ghost"
                  />
                </DSIconButtonTooltip>
                <DSIconButtonTooltip label="Cấu hình chế độ xem">
                  <DSButton
                    aria-label="Cấu hình chế độ xem"
                    leftIcon={<Settings2 />}
                    size="icon-sm"
                    variant="outline"
                  />
                </DSIconButtonTooltip>
              </div>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Spinner</DSCardTitle>
              <DSCardDescription>
                Chỉ báo tải chuẩn cho trạng thái và thao tác bất đồng bộ.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="flex flex-wrap items-center gap-4">
              <DSSpinner size="sm" label="Đang tải trạng thái nhỏ" />
              <DSSpinner label="Đang tải trạng thái mặc định" />
              <DSSpinner size="lg" label="Đang tải trạng thái lớn" />
              <DSButton loading variant="outline">
                Đang lưu
              </DSButton>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Ma trận trạng thái</DSCardTitle>
              <DSCardDescription>
                Hiển thị trạng thái ngữ nghĩa với nhãn chữ và chấm trang trí.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="flex flex-wrap gap-2">
              {statusMatrix.map((status) => (
                <DSStatusBadge key={status} status={status} />
              ))}
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Thẻ nội dung</DSCardTitle>
              <DSCardDescription>
                Bề mặt hiển thị cho nội dung doanh nghiệp theo nhóm.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-sm text-muted-foreground">
                  Phê duyệt tháng
                </div>
                <div className="mt-2 font-heading text-2xl font-medium">
                  1,284
                </div>
                <DSBadge className="mt-3">Đúng tiến độ</DSBadge>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground">
                  Rà soát thủ công
                </div>
                <div className="mt-2 font-heading text-2xl font-medium">48</div>
                <DSBadge className="mt-3" variant="secondary">
                  Trung bình
                </DSBadge>
              </div>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Menu thả xuống</DSCardTitle>
              <DSCardDescription>
                Thao tác theo ngữ cảnh với trạng thái phá hủy.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <DSButton variant="outline">Mở menu bản ghi</DSButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Thao tác bản ghi</DropdownMenuLabel>
                  <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                  <DropdownMenuItem>Gán người rà soát</DropdownMenuItem>
                  <DropdownMenuItem>Sao chép mã tham chiếu</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    Đánh dấu bị chặn
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DSCardContent>
          </DSCard>
        </div>
      </TabsContent>

      <TabsContent value="forms">
        <FormsSection />
      </TabsContent>

      <TabsContent value="states">
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Trạng thái trống</DSCardTitle>
              <DSCardDescription>
                Hướng xử lý rõ ràng khi dữ liệu đã lọc không có kết quả.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSStateEmpty
                className="min-h-72 bg-muted/20"
                title="Không tìm thấy ngoại lệ"
                description="Bộ lọc hiện tại không trả về yêu cầu bị chặn nào. Điều chỉnh bộ lọc hoặc tạo quy tắc giám sát cho hệ thống này."
                action={
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <DSButton>Tạo quy tắc</DSButton>
                    <DSButton variant="outline">Xóa bộ lọc</DSButton>
                  </div>
                }
              />
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Ma trận trạng thái</DSCardTitle>
              <DSCardDescription>
                Các trạng thái vận hành phổ biến trong hệ thống giao diện hiện tại.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-3">
              {[
                ["Đồng bộ ổn định", "Tất cả hệ thống nguồn đã đối soát", "Ổn định"],
                ["Chờ phê duyệt", "Đang chờ chủ sở hữu tài chính", "Đang chờ"],
                ["Chính sách bị chặn", "Cần ngoại lệ bảo mật", "Bị chặn"],
              ].map(([title, description, badge]) => (
                <div
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  key={title}
                >
                  <div>
                    <div className="text-sm font-medium">{title}</div>
                    <div className="text-sm text-muted-foreground">
                      {description}
                    </div>
                  </div>
                  <DSBadge
                    variant={
                      badge === "Bị chặn"
                        ? "destructive"
                        : badge === "Đang chờ"
                          ? "secondary"
                          : "default"
                    }
                  >
                    {badge}
                  </DSBadge>
                </div>
              ))}
            </DSCardContent>
          </DSCard>
        </div>
      </TabsContent>
    </Tabs>
  )
}

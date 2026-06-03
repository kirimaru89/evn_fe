"use client"

import { useState } from "react"

import {
  DSActionBar,
  DSAlert,
  DSBadge,
  DSBreadcrumb,
  DSButton,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSCheckboxField,
  DSFormField,
  DSGrid,
  DSInput,
  DSPagination,
  DSPageActions,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
  DSSection,
  DSSearchInput,
  DSSelectField,
  DSStack,
  DSStatusBadge,
  DSSheet,
  DSSwitchField,
  DSTextarea,
  DSTooltip,
} from "@/components/ds"

export function PrimitivesSection() {
  const [demoPage, setDemoPage] = useState(2)

  return (
    <>
      <DSSection>
        <div className="flex flex-col gap-2">
          <DSBadge className="w-fit" variant="outline">
            Primitive trang và biểu mẫu
          </DSBadge>
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-medium">
              Nền tảng màn hình sản phẩm
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Primitive trang, bố cục, thao tác và trường nhập tái sử dụng cho
              màn hình sản phẩm nhất quán.
            </p>
          </div>
        </div>

        <DSCard>
          <DSCardContent className="grid gap-6 pt-6">
            <DSPageHeader showDivider={false}>
              <DSStack className="max-w-3xl gap-2">
                <DSBadge className="w-fit" variant="secondary">
                  Mua sắm
                </DSBadge>
                <DSPageTitle>Không gian rà soát nhà cung cấp</DSPageTitle>
                <DSPageDescription>
                  Theo dõi kiểm soát nhà cung cấp, điều phối nhiệm vụ rà soát
                  và xử lý ngoại lệ trước khi kết thúc quý.
                </DSPageDescription>
              </DSStack>
              <DSPageActions>
                <DSButton variant="outline">Lưu chế độ xem</DSButton>
                <DSButton>Tạo rà soát</DSButton>
              </DSPageActions>
            </DSPageHeader>

            <DSPageHeader density="compact" titleSize="compact">
              <DSStack className="max-w-3xl gap-1">
                <DSPageTitle>Header danh sách compact</DSPageTitle>
                <DSPageDescription>
                  Mặc định ẩn trong chế độ compact trừ khi bật rõ ràng.
                </DSPageDescription>
              </DSStack>
              <DSPageActions>
                <DSButton variant="outline">Xuất dữ liệu</DSButton>
                <DSButton>Tạo bản ghi</DSButton>
              </DSPageActions>
            </DSPageHeader>

            <DSGrid className="lg:grid-cols-3">
              <DSFormField
                description="Hiển thị trong hàng đợi rà soát và file xuất kiểm toán."
                htmlFor="primitive-workspace-name"
                label="Tên không gian làm việc"
                required
              >
                <DSInput
                  id="primitive-workspace-name"
                  defaultValue="Rà soát rủi ro nhà cung cấp"
                  placeholder="Nhập tên không gian làm việc"
                />
              </DSFormField>

              <DSSelectField
                description="Chọn nhóm chịu trách nhiệm theo dõi."
                id="primitive-owner"
                label="Nhóm phụ trách"
                defaultValue="operations"
                options={[
                  { label: "Vận hành", value: "operations" },
                  { label: "Tài chính", value: "finance" },
                  { label: "Bảo mật", value: "security" },
                ]}
                placeholder="Chọn nhóm phụ trách"
              />

              <DSFormField
                error="Cần có chủ sở hữu chính sách trước khi phát hành."
                htmlFor="primitive-policy-owner"
                label="Chủ sở hữu chính sách"
                required
              >
                <DSSearchInput
                  id="primitive-policy-owner"
                  placeholder="Tìm chủ sở hữu"
                  aria-label="Tìm chủ sở hữu chính sách"
                />
              </DSFormField>
            </DSGrid>

            <DSActionBar>
              <DSButton variant="outline">Hủy</DSButton>
              <DSButton>Phát hành không gian làm việc</DSButton>
            </DSActionBar>
          </DSCardContent>
        </DSCard>
      </DSSection>

      <DSSection>
        <div className="flex flex-col gap-2">
          <DSBadge className="w-fit" variant="outline">
            Wrapper sản phẩm phổ biến
          </DSBadge>
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-medium">
              Wrapper DS có trọng tâm
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
              Nhu cầu lặp lại của sản phẩm được bọc một lần, trong khi
              primitive shadcn cấp thấp vẫn dùng để ghép DS.
            </p>
          </div>
        </div>

        <DSGrid className="xl:grid-cols-4">
          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Tùy chọn biểu mẫu</DSCardTitle>
              <DSCardDescription>
                Pattern checkbox, switch và textarea ở cấp trường.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-4">
              <DSCheckboxField
                id="wrapper-approval"
                label="Yêu cầu phê duyệt trước khi phát hành"
                description="Điều phối thay đổi đến chủ sở hữu chính sách được gán."
                defaultChecked
              />
              <DSSwitchField
                id="wrapper-notifications"
                label="Thông báo người rà soát"
                description="Gửi thay đổi trạng thái đến thành viên hệ thống."
                defaultChecked
              />
              <DSFormField
                description="Hiển thị cho người rà soát trong quá trình bàn giao."
                htmlFor="wrapper-notes"
                label="Ghi chú rà soát"
              >
                <DSTextarea
                  id="wrapper-notes"
                  placeholder="Thêm bối cảnh cho nhóm rà soát..."
                />
              </DSFormField>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Trường select</DSCardTitle>
              <DSCardDescription>
                Trạng thái select chuẩn cho biểu mẫu sản phẩm.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-4">
              <DSSelectField
                id="select-normal"
                label="Khu vực"
                defaultValue="north"
                options={[
                  { label: "Miền Bắc", value: "north" },
                  { label: "Miền Trung", value: "central" },
                  { label: "Miền Nam", value: "south" },
                ]}
                placeholder="Chọn khu vực"
              />
              <DSSelectField
                id="select-required"
                label="Luồng phê duyệt"
                required
                options={[
                  { label: "Vận hành", value: "operational" },
                  { label: "Tài chính", value: "financial" },
                  { label: "Bảo mật", value: "security" },
                ]}
                placeholder="Chọn luồng phê duyệt"
              />
              <DSSelectField
                id="select-error"
                label="Chủ sở hữu rủi ro"
                required
                error="Chọn chủ sở hữu rủi ro trước khi phát hành."
                options={[
                  { label: "Vận hành", value: "operations" },
                  { label: "Tài chính", value: "finance" },
                  { label: "Bảo mật", value: "security" },
                ]}
                placeholder="Chọn chủ sở hữu rủi ro"
              />
              <DSSelectField
                id="select-disabled"
                label="Kỳ bị khóa"
                disabled
                defaultValue="quarter"
                options={[
                  { label: "Tháng này", value: "month" },
                  { label: "Quý này", value: "quarter" },
                ]}
                placeholder="Chọn kỳ"
              />
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Điều hướng và phản hồi</DSCardTitle>
              <DSCardDescription>
                Wrapper breadcrumb, tooltip, alert và phân trang.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-4">
              <DSBreadcrumb
                items={[
                  { label: "Quản trị", href: "#" },
                  { label: "Kiểm soát", href: "#" },
                  { label: "Hàng đợi rà soát" },
                ]}
              />
              <DSAlert
                title="Sắp hết thời hạn rà soát"
                description="12 kiểm soát vẫn cần chủ sở hữu xác nhận trước kỳ chốt tháng."
                action={
                  <DSTooltip content="Mở hàng đợi đã lọc">
                    <DSButton size="sm" variant="outline">
                      Xem
                    </DSButton>
                  </DSTooltip>
                }
              />
              <DSPagination
                page={demoPage}
                totalPages={4}
                onPageChange={setDemoPage}
              />
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Luồng sheet</DSCardTitle>
              <DSCardDescription>
                Luồng panel bên compact cho chi tiết rà soát.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSSheet
                title="Chi tiết kiểm soát"
                description="Rà soát trạng thái chính sách mới nhất và phân công chủ sở hữu."
                trigger={<DSButton variant="outline">Mở sheet</DSButton>}
                footer={<DSButton>Lưu thay đổi</DSButton>}
              >
                <DSStack>
                  <DSStatusBadge status="warning">Cần rà soát</DSStatusBadge>
                  <p className="text-sm text-muted-foreground">
                    Xác nhận truy cập đặc quyền cần chủ sở hữu bảo mật xác nhận
                    trước khi đánh dấu hoàn tất.
                  </p>
                </DSStack>
              </DSSheet>
            </DSCardContent>
          </DSCard>
        </DSGrid>
      </DSSection>
    </>
  )
}

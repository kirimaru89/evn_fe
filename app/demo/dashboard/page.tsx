import {
  DSAppShell,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSPage,
  DSPageBody,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
  DSStateEmpty,
} from "@/components/ds"

export default function DashboardPage() {
  return (
    <DSAppShell
      breadcrumbs={[{ label: "Tổng quan" }]}
      headerSticky={true}
      pageTitle="Tổng quan"
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader>
            <div>
              <DSPageTitle>Tổng quan</DSPageTitle>
              <DSPageDescription>
                Tổng quan hệ thống, sức khỏe vận hành và hoạt động chính sẽ
                hiển thị tại đây.
              </DSPageDescription>
            </div>
          </DSPageHeader>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Không gian tổng quan</DSCardTitle>
              <DSCardDescription>
                Trang tạm cho điểm đến Tổng quan trong sidebar.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSStateEmpty
                title="Module tổng quan chưa được cấu hình"
                description="Thêm tóm tắt KPI, biểu đồ quy trình và hàng đợi vận hành khi phạm vi dashboard sẵn sàng."
              />
            </DSCardContent>
          </DSCard>
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

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

export default function ReportsPage() {
  return (
    <DSAppShell
      breadcrumbs={[{ label: "Báo cáo" }]}
      headerSticky={true}
      pageTitle="Báo cáo"
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader>
            <div>
              <DSPageTitle>Báo cáo</DSPageTitle>
              <DSPageDescription>
                Báo cáo định kỳ, xuất dữ liệu và luồng phân tích sẽ hiển thị
                tại đây.
              </DSPageDescription>
            </div>
          </DSPageHeader>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Không gian báo cáo</DSCardTitle>
              <DSCardDescription>
                Trang tạm cho điểm đến Báo cáo trong sidebar.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSStateEmpty
                title="Module báo cáo chưa được cấu hình"
                description="Thêm danh mục báo cáo, lịch sử xuất dữ liệu và điều khiển gửi định kỳ khi phạm vi báo cáo sẵn sàng."
              />
            </DSCardContent>
          </DSCard>
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

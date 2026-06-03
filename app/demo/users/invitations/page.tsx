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

export default function UserInvitationsPage() {
  return (
    <DSAppShell
      breadcrumbs={[
        { label: "Danh sách người dùng", href: "/demo/users" },
        { label: "Lời mời" },
      ]}
      headerSticky={true}
      pageTitle="Lời mời"
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader>
            <div>
              <DSPageTitle>Lời mời</DSPageTitle>
              <DSPageDescription>
                Theo dõi lời mời đang chờ và trạng thái onboarding của người
                dùng hệ thống.
              </DSPageDescription>
            </div>
          </DSPageHeader>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Hàng đợi lời mời</DSCardTitle>
              <DSCardDescription>
                Trang tạm cho submenu Người dùng.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSStateEmpty
                title="Hàng đợi lời mời chưa được cấu hình"
                description="Thêm lời mời đang chờ, điều khiển gửi lại và luồng hết hạn khi phạm vi onboarding sẵn sàng."
              />
            </DSCardContent>
          </DSCard>
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

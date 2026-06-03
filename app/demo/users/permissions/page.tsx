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

export default function UserPermissionsPage() {
  return (
    <DSAppShell
      breadcrumbs={[
        { label: "Danh sách người dùng", href: "/demo/users" },
        { label: "Quyền truy cập" },
      ]}
      headerSticky={true}
      pageTitle="Quyền truy cập"
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader>
            <div>
              <DSPageTitle>Quyền truy cập</DSPageTitle>
              <DSPageDescription>
                Rà soát năng lực, quyền theo chính sách và ranh giới quyền.
              </DSPageDescription>
            </div>
          </DSPageHeader>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Danh mục quyền</DSCardTitle>
              <DSCardDescription>
                Trang tạm cho submenu Người dùng.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSStateEmpty
                title="Danh mục quyền chưa được cấu hình"
                description="Thêm nhóm quyền, ánh xạ chính sách và điều khiển rà soát truy cập khi mô hình sẵn sàng."
              />
            </DSCardContent>
          </DSCard>
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

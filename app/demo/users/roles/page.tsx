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

export default function UserRolesPage() {
  return (
    <DSAppShell
      breadcrumbs={[
        { label: "Danh sách người dùng", href: "/demo/users" },
        { label: "Vai trò" },
      ]}
      headerSticky={true}
      pageTitle="Vai trò"
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader>
            <div>
              <DSPageTitle>Vai trò</DSPageTitle>
              <DSPageDescription>
                Định nghĩa hồ sơ truy cập và quyền quản trị cho người dùng
                hệ thống.
              </DSPageDescription>
            </div>
          </DSPageHeader>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Quản lý vai trò</DSCardTitle>
              <DSCardDescription>
                Trang tạm cho submenu Người dùng.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSStateEmpty
                title="Quản lý vai trò chưa được cấu hình"
                description="Thêm danh mục vai trò, tóm tắt quyền và luồng gán quyền khi mô hình truy cập sẵn sàng."
              />
            </DSCardContent>
          </DSCard>
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

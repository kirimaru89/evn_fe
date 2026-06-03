"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Pencil } from "lucide-react"

import {
  DSAppShell,
  DSBadge,
  DSButton,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSConfirmDialog,
  DSPage,
  DSPageActions,
  DSPageBody,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
  DSStateError,
  DSStatusBadge,
  notifyStatusChange,
} from "@/components/ds"
import { waitForDemoLoading } from "../_components/demo-loading"
import { getDemoUser, type UserStatus } from "../_data/users"

export default function UserDetailPage() {
  const params = useParams<{ id: string }>()
  const user = useMemo(() => getDemoUser(params.id), [params.id])
  const [status, setStatus] = useState<UserStatus | undefined>(user?.status)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!user) {
    return (
      <DSAppShell
        breadcrumbs={[
          { label: "Danh sách người dùng", href: "/demo/users" },
          { label: "Chi tiết người dùng" },
        ]}
        headerSticky={true}
        pageTitle="Chi tiết người dùng"
      >
        <DSPage className="bg-transparent">
          <DSPageBody>
            <DSStateError
              title="Không tìm thấy người dùng"
              description="Người dùng demo được yêu cầu không tồn tại."
              action={
                <DSButton asChild variant="outline">
                  <Link href="/demo/users">Quay lại người dùng</Link>
                </DSButton>
              }
            />
          </DSPageBody>
        </DSPage>
      </DSAppShell>
    )
  }

  const currentStatus = status ?? user.status
  const isInactive = currentStatus === "inactive"

  const confirmStatusChange = async () => {
    const nextStatus = isInactive ? "active" : "inactive"

    await waitForDemoLoading()
    setStatus(nextStatus)
    setConfirmOpen(false)
    notifyStatusChange({
      entity: "Người dùng",
      name: user.name,
      status: nextStatus === "active" ? "enabled" : "disabled",
    })
  }

  return (
    <DSAppShell
      breadcrumbs={[
        { label: "Danh sách người dùng", href: "/demo/users" },
        { label: "Chi tiết người dùng" },
      ]}
      headerSticky={true}
      pageTitle={user.name}
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader density="default">
            <div>
              <DSPageTitle>{user.name}</DSPageTitle>
              <DSPageDescription>
                Xem hồ sơ, trạng thái tài khoản, quyền truy cập và hoạt động
                gần đây của {user.email}.
              </DSPageDescription>
            </div>
            <DSPageActions>
              <DSButton asChild leftIcon={<ArrowLeft />} variant="outline">
                <Link href="/demo/users">Quay lại người dùng</Link>
              </DSButton>
              <DSButton asChild leftIcon={<Pencil />} variant="outline">
                <Link href={`/demo/users/${user.id}/edit`}>Chỉnh sửa người dùng</Link>
              </DSButton>
              <DSButton
                onClick={() => setConfirmOpen(true)}
                variant={isInactive ? "outline" : "destructive"}
              >
                {isInactive ? "Kích hoạt người dùng" : "Vô hiệu hóa người dùng"}
              </DSButton>
            </DSPageActions>
          </DSPageHeader>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="grid gap-6">
              <DSCard>
                <DSCardHeader>
                  <DSCardTitle>Tóm tắt hồ sơ</DSCardTitle>
                  <DSCardDescription>
                    Thông tin định danh và phụ trách chính.
                  </DSCardDescription>
                </DSCardHeader>
                <DSCardContent className="grid gap-4 md:grid-cols-2">
                  {[
                    { label: "Mã người dùng", value: user.id },
                    { label: "Email", value: user.email },
                    { label: "Vai trò", value: user.role },
                    { label: "Phòng ban", value: user.department },
                    { label: "Quản lý", value: user.manager },
                    { label: "Hoạt động gần nhất", value: user.lastActive },
                  ].map((item) => (
                    <div className="grid gap-1" key={item.label}>
                      <dt className="text-sm font-medium">{item.label}</dt>
                      <dd className="text-sm text-muted-foreground">
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </DSCardContent>
              </DSCard>

              <DSCard>
                <DSCardHeader>
                  <DSCardTitle>Quyền truy cập</DSCardTitle>
                  <DSCardDescription>
                    Các quyền hiện tại được gán thông qua vai trò người dùng.
                  </DSCardDescription>
                </DSCardHeader>
                <DSCardContent className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <DSBadge key={permission} variant="secondary">
                      {permission}
                    </DSBadge>
                  ))}
                </DSCardContent>
              </DSCard>

              <DSCard>
                <DSCardHeader>
                  <DSCardTitle>Hoạt động gần đây</DSCardTitle>
                  <DSCardDescription>
                    Hoạt động dạng kiểm toán cục bộ của tài khoản demo này.
                  </DSCardDescription>
                </DSCardHeader>
                <DSCardContent className="grid gap-4">
                  {user.activity.map((item) => (
                    <div
                      className="grid gap-1 border-b border-border pb-4 last:border-b-0 last:pb-0"
                      key={`${item.label}-${item.timestamp}`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.timestamp}
                      </span>
                    </div>
                  ))}
                </DSCardContent>
              </DSCard>
            </div>

            <div className="grid gap-6">
              <DSCard>
                <DSCardHeader>
                  <DSCardTitle>Trạng thái tài khoản</DSCardTitle>
                  <DSCardDescription>
                    Mức sẵn sàng vận hành của tài khoản này.
                  </DSCardDescription>
                </DSCardHeader>
                <DSCardContent className="grid gap-4">
                  <DSStatusBadge status={currentStatus} />
                  <p className="text-sm text-muted-foreground">{user.notes}</p>
                </DSCardContent>
              </DSCard>

              <DSCard>
                <DSCardHeader>
                  <DSCardTitle>Liên hệ</DSCardTitle>
                  <DSCardDescription>
                    Thông tin liên hệ cho quản trị viên hệ thống.
                  </DSCardDescription>
                </DSCardHeader>
                <DSCardContent className="grid gap-4">
                  <div className="grid gap-1">
                    <dt className="text-sm font-medium">Điện thoại</dt>
                    <dd className="text-sm text-muted-foreground">
                      {user.phone}
                    </dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="text-sm font-medium">Địa điểm</dt>
                    <dd className="text-sm text-muted-foreground">
                      {user.location}
                    </dd>
                  </div>
                </DSCardContent>
              </DSCard>
            </div>
          </div>
        </DSPageBody>
      </DSPage>
      <DSConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isInactive ? "Kích hoạt người dùng?" : "Vô hiệu hóa người dùng?"}
        description={
          isInactive
            ? `${user.name} sẽ có thể truy cập hệ thống trở lại.`
            : `${user.name} sẽ không còn quyền truy cập hệ thống.`
        }
        confirmLabel={isInactive ? "Kích hoạt người dùng" : "Vô hiệu hóa người dùng"}
        variant={isInactive ? "default" : "destructive"}
        onConfirm={confirmStatusChange}
      />
    </DSAppShell>
  )
}

"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

import {
  DSAppShell,
  DSButton,
  DSPage,
  DSPageBody,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
  DSStateError,
  toastSuccess,
} from "@/components/ds"
import { waitForDemoLoading } from "../../_components/demo-loading"
import { UserForm, type UserFormValues } from "../../_components/user-form"
import { getDemoUser } from "../../_data/users"

export default function EditUserPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const user = useMemo(() => getDemoUser(params.id), [params.id])
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return (
      <DSAppShell
        breadcrumbs={[
          { label: "Danh sách người dùng", href: "/demo/users" },
          { label: "Chỉnh sửa người dùng" },
        ]}
        headerSticky={true}
        pageTitle="Chỉnh sửa người dùng"
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

  const saveUser = async (values: UserFormValues) => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await waitForDemoLoading()
      toastSuccess(
        "Đã lưu thay đổi người dùng",
        `Thay đổi của ${values.name} đã được lưu thành công.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DSAppShell
      breadcrumbs={[
        { label: "Danh sách người dùng", href: "/demo/users" },
        { label: "Chỉnh sửa người dùng" },
      ]}
      headerSticky={true}
      pageTitle={`Chỉnh sửa ${user.name}`}
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader density="default">
            <div>
              <DSPageTitle>Chỉnh sửa người dùng</DSPageTitle>
              <DSPageDescription>
                Cập nhật thông tin hồ sơ, thiết lập truy cập và ghi chú quản
                trị cho {user.name}.
              </DSPageDescription>
            </div>
          </DSPageHeader>

          <UserForm
            mode="edit"
            initialValues={{
              name: user.name,
              email: user.email,
              department: user.department,
              role: user.role,
              status: user.status,
              permissionGroup: "standard",
              requirePasswordReset: false,
              notes: user.notes,
            }}
            loading={isSubmitting}
            onCancel={() => router.push(`/demo/users/${user.id}`)}
            onSubmit={saveUser}
            submitLabel="Lưu thay đổi"
          />
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

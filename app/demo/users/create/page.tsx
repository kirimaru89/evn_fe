"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  DSAppShell,
  DSPage,
  DSPageBody,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
  toastSuccess,
} from "@/components/ds"
import { waitForDemoLoading } from "../_components/demo-loading"
import { UserForm, type UserFormValues } from "../_components/user-form"

export default function CreateUserPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createUser = async (values: UserFormValues) => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      await waitForDemoLoading()
      toastSuccess(
        "Đã tạo người dùng",
        `${values.name} đã được kiểm tra và sẵn sàng tạo mới.`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DSAppShell
      breadcrumbs={[
        { label: "Danh sách người dùng", href: "/demo/users" },
        { label: "Tạo người dùng" },
      ]}
      headerSticky={true}
      pageTitle="Tạo người dùng"
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader density="default">
            <div>
              <DSPageTitle>Tạo người dùng</DSPageTitle>
              <DSPageDescription>
                Thêm tài khoản hệ thống với vai trò, phòng ban và ghi chú
                onboarding.
              </DSPageDescription>
            </div>
          </DSPageHeader>

          <UserForm
            mode="create"
            loading={isSubmitting}
            onCancel={() => router.push("/demo/users")}
            onSubmit={createUser}
            submitLabel="Tạo người dùng"
          />
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

import Link from "next/link"

import {
  DSButton,
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
} from "@/components/ds"

export default function HomePage() {
  return (
    <DSPage>
      <DSPageBody>
        <DSPageHeader>
          <div>
            <DSPageTitle>Nền tảng giao diện MSM Portal</DSPageTitle>
            <DSPageDescription>
              Mở playground hệ thống thiết kế hoặc demo CRUD người dùng để xem
              các pattern giao diện tái sử dụng trên nền shadcn.
            </DSPageDescription>
          </div>
        </DSPageHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Playground hệ thống thiết kế</DSCardTitle>
              <DSCardDescription>
                Xem primitive DS, pattern nghiệp vụ, trạng thái, bộ lọc và hành
                vi bảng.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSButton asChild>
                <Link href="/system">Mở /system</Link>
              </DSButton>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Demo CRUD người dùng</DSCardTitle>
              <DSCardDescription>
                Kiểm tra app shell, sidebar, bộ lọc, bảng, import, tạo mới,
                chi tiết và chỉnh sửa.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSButton asChild variant="outline">
                <Link href="/demo/users">Mở /demo/users</Link>
              </DSButton>
            </DSCardContent>
          </DSCard>
        </div>
      </DSPageBody>
    </DSPage>
  )
}

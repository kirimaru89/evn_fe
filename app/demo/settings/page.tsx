"use client"

import { useMemo, useState } from "react"

import {
  DSAppShell,
  DSButton,
  DSCard,
  DSCardContent,
  DSCardDescription,
  DSCardHeader,
  DSCardTitle,
  DSFormField,
  DSGrid,
  DSInput,
  DSPage,
  DSPageActions,
  DSPageBody,
  DSPageDescription,
  DSPageHeader,
  DSPageTitle,
  DSSelectField,
  DSSwitchField,
  DSTextarea,
  toastError,
  toastInfo,
  toastSuccess,
} from "@/components/ds"

type SettingsForm = {
  organizationName: string
  workspaceSlug: string
  contactEmail: string
  website: string
  defaultLanguage: string
  timezone: string
  dateFormat: string
  compactMode: boolean
  emailNotifications: boolean
  requireTwoFactor: boolean
  sessionTimeout: string
  allowedDomains: string
  defaultReportRange: string
  scheduledReports: boolean
  reportRecipients: string
}

type SettingsErrors = Partial<Record<keyof SettingsForm, string>>

const initialSettings: SettingsForm = {
  organizationName: "Vega Vận hành",
  workspaceSlug: "vega-operations",
  contactEmail: "admin@vega.example",
  website: "https://vega.example",
  defaultLanguage: "en",
  timezone: "asia-ho-chi-minh",
  dateFormat: "yyyy-mm-dd",
  compactMode: false,
  emailNotifications: true,
  requireTwoFactor: true,
  sessionTimeout: "30",
  allowedDomains: "vega.example, partners.vega.example",
  defaultReportRange: "30",
  scheduledReports: true,
  reportRecipients: "finance@vega.example, security@vega.example",
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const slugPattern = /^[a-z0-9-]+$/

const languageOptions = [
  { label: "Tiếng Anh", value: "en" },
  { label: "Tiếng Việt", value: "vi" },
  { label: "Tiếng Pháp", value: "fr" },
]

const timezoneOptions = [
  { label: "Châu Á/TP. Hồ Chí Minh", value: "asia-ho-chi-minh" },
  { label: "UTC", value: "utc" },
  { label: "Mỹ/New York", value: "america-new-york" },
]

const dateFormatOptions = [
  { label: "YYYY-MM-DD", value: "yyyy-mm-dd" },
  { label: "DD-MM-YYYY", value: "dd-mm-yyyy" },
  { label: "MM-DD-YYYY", value: "mm-dd-yyyy" },
]

const sessionTimeoutOptions = [
  { label: "15 phút", value: "15" },
  { label: "30 phút", value: "30" },
  { label: "1 giờ", value: "60" },
  { label: "8 giờ", value: "480" },
]

const reportRangeOptions = [
  { label: "7 ngày qua", value: "7" },
  { label: "30 ngày qua", value: "30" },
  { label: "90 ngày qua", value: "90" },
  { label: "12 tháng qua", value: "365" },
]

function validateEmailList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .every((email) => emailPattern.test(email))
}

export default function DemoSettingsPage() {
  const [settings, setSettings] = useState<SettingsForm>(initialSettings)
  const [savedSettings, setSavedSettings] =
    useState<SettingsForm>(initialSettings)
  const [errors, setErrors] = useState<SettingsErrors>({})

  const isDirty = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(savedSettings),
    [settings, savedSettings]
  )

  const updateSetting = <TKey extends keyof SettingsForm>(
    key: TKey,
    value: SettingsForm[TKey]
  ) => {
    setSettings((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const resetChanges = () => {
    setSettings(savedSettings)
    setErrors({})
    toastInfo(
      "Đã đặt lại thay đổi",
      "Các thay đổi cài đặt hệ thống chưa lưu đã bị hủy."
    )
  }

  const validateSettings = () => {
    const nextErrors: SettingsErrors = {}

    if (!settings.organizationName.trim()) {
      nextErrors.organizationName = "Vui lòng nhập tên tổ chức."
    }

    if (!settings.workspaceSlug.trim()) {
      nextErrors.workspaceSlug = "Vui lòng nhập slug hệ thống."
    } else if (!slugPattern.test(settings.workspaceSlug)) {
      nextErrors.workspaceSlug =
        "Chỉ dùng chữ thường, số và dấu gạch nối."
    }

    if (!emailPattern.test(settings.contactEmail.trim())) {
      nextErrors.contactEmail = "Vui lòng nhập email liên hệ hợp lệ."
    }

    if (settings.website.trim() && !settings.website.startsWith("https://")) {
      nextErrors.website = "Website phải bắt đầu bằng https://."
    }

    if (
      settings.scheduledReports &&
      !validateEmailList(settings.reportRecipients)
    ) {
      nextErrors.reportRecipients =
        "Nhập các địa chỉ email hợp lệ, phân tách bằng dấu phẩy."
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const saveSettings = () => {
    if (!validateSettings()) {
      toastError(
        "Không thể lưu cài đặt",
        "Kiểm tra các trường được đánh dấu và thử lại."
      )
      return
    }

    setSavedSettings(settings)
    toastSuccess(
      "Đã lưu cài đặt",
      "Cấu hình hệ thống đã được cập nhật cục bộ."
    )
  }

  return (
    <DSAppShell
      breadcrumbs={[{ label: "Cài đặt" }]}
      headerSticky={true}
      pageTitle="Cài đặt"
    >
      <DSPage className="bg-transparent">
        <DSPageBody>
          <DSPageHeader>
            <div className="space-y-1">
              <DSPageTitle>Cài đặt</DSPageTitle>
              <DSPageDescription>
                Cấu hình hồ sơ tổ chức, tùy chọn, bảo mật và mặc định báo cáo
                cho hệ thống.
              </DSPageDescription>
            </div>
            <DSPageActions>
              <DSButton
                disabled={!isDirty}
                onClick={resetChanges}
                variant="outline"
              >
                Đặt lại thay đổi
              </DSButton>
              <DSButton disabled={!isDirty} onClick={saveSettings}>
                Lưu cài đặt
              </DSButton>
            </DSPageActions>
          </DSPageHeader>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Hồ sơ tổ chức</DSCardTitle>
              <DSCardDescription>
                Thông tin định danh và liên hệ dùng trong các luồng quản trị.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent>
              <DSGrid>
                <DSFormField
                  htmlFor="organization-name"
                  label="Tên tổ chức"
                  error={errors.organizationName}
                  required
                >
                  <DSInput
                    id="organization-name"
                    onChange={(event) =>
                      updateSetting("organizationName", event.target.value)
                    }
                    placeholder="Nhập tên tổ chức"
                    value={settings.organizationName}
                  />
                </DSFormField>
                <DSFormField
                  htmlFor="workspace-slug"
                  label="Slug hệ thống"
                  description="Định danh hệ thống dạng chữ thường dùng trong URL và file xuất dữ liệu."
                  error={errors.workspaceSlug}
                  required
                >
                  <DSInput
                    id="workspace-slug"
                    onChange={(event) =>
                      updateSetting("workspaceSlug", event.target.value)
                    }
                    placeholder="Nhập slug hệ thống"
                    value={settings.workspaceSlug}
                  />
                </DSFormField>
                <DSFormField
                  htmlFor="contact-email"
                  label="Email liên hệ"
                  error={errors.contactEmail}
                  required
                >
                  <DSInput
                    id="contact-email"
                    onChange={(event) =>
                      updateSetting("contactEmail", event.target.value)
                    }
                    placeholder="Nhập email liên hệ"
                    type="email"
                    value={settings.contactEmail}
                  />
                </DSFormField>
                <DSFormField
                  htmlFor="website"
                  label="Website"
                  error={errors.website}
                >
                  <DSInput
                    id="website"
                    onChange={(event) =>
                      updateSetting("website", event.target.value)
                    }
                    placeholder="https://"
                    value={settings.website}
                  />
                </DSFormField>
              </DSGrid>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Tùy chọn</DSCardTitle>
              <DSCardDescription>
                Ngôn ngữ mặc định, mật độ hiển thị và hành vi thông báo.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-6">
              <DSGrid>
                <DSSelectField
                  id="default-language"
                  label="Ngôn ngữ mặc định"
                  onValueChange={(value) =>
                    updateSetting("defaultLanguage", value)
                  }
                  options={languageOptions}
                  placeholder="Chọn ngôn ngữ"
                  value={settings.defaultLanguage}
                />
                <DSSelectField
                  id="timezone"
                  label="Múi giờ"
                  onValueChange={(value) => updateSetting("timezone", value)}
                  options={timezoneOptions}
                  placeholder="Chọn múi giờ"
                  value={settings.timezone}
                />
                <DSSelectField
                  id="date-format"
                  label="Định dạng ngày"
                  onValueChange={(value) =>
                    updateSetting("dateFormat", value)
                  }
                  options={dateFormatOptions}
                  placeholder="Chọn định dạng ngày"
                  value={settings.dateFormat}
                />
              </DSGrid>
              <div className="grid gap-4 md:grid-cols-2">
                <DSSwitchField
                  checked={settings.compactMode}
                  description="Giảm khoảng cách trong bảng và panel quản trị mật độ cao."
                  id="compact-mode"
                  label="Chế độ compact"
                  onCheckedChange={(value) =>
                    updateSetting("compactMode", value)
                  }
                />
                <DSSwitchField
                  checked={settings.emailNotifications}
                  description="Gửi cập nhật quy trình và nhắc phê duyệt qua email."
                  id="email-notifications"
                  label="Thông báo email"
                  onCheckedChange={(value) =>
                    updateSetting("emailNotifications", value)
                  }
                />
              </div>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Bảo mật</DSCardTitle>
              <DSCardDescription>
                Kiểm soát bảo vệ tài khoản, phiên đăng nhập và domain email tin
                cậy.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <DSSwitchField
                  checked={settings.requireTwoFactor}
                  description="Yêu cầu người dùng đã đăng ký xác minh đăng nhập bằng yếu tố thứ hai."
                  id="require-two-factor"
                  label="Yêu cầu xác thực hai yếu tố"
                  onCheckedChange={(value) =>
                    updateSetting("requireTwoFactor", value)
                  }
                />
                <DSSelectField
                  id="session-timeout"
                  label="Thời gian hết phiên"
                  onValueChange={(value) =>
                    updateSetting("sessionTimeout", value)
                  }
                  options={sessionTimeoutOptions}
                  placeholder="Chọn thời gian"
                  value={settings.sessionTimeout}
                />
              </div>
              <DSFormField
                htmlFor="allowed-domains"
                label="Domain được phép"
                description="Dùng danh sách domain phân tách bằng dấu phẩy. Người dùng ngoài các domain này cần phê duyệt thủ công."
              >
                <DSTextarea
                  id="allowed-domains"
                  onChange={(event) =>
                    updateSetting("allowedDomains", event.target.value)
                  }
                  placeholder="example.com, company.vn"
                  rows={4}
                  value={settings.allowedDomains}
                />
              </DSFormField>
            </DSCardContent>
          </DSCard>

          <DSCard>
            <DSCardHeader>
              <DSCardTitle>Dữ liệu và báo cáo</DSCardTitle>
              <DSCardDescription>
                Cấu hình mặc định báo cáo và lịch phân phối.
              </DSCardDescription>
            </DSCardHeader>
            <DSCardContent className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <DSSelectField
                  id="default-report-range"
                  label="Khoảng báo cáo mặc định"
                  onValueChange={(value) =>
                    updateSetting("defaultReportRange", value)
                  }
                  options={reportRangeOptions}
                  placeholder="Chọn khoảng thời gian"
                  value={settings.defaultReportRange}
                />
                <DSSwitchField
                  checked={settings.scheduledReports}
                  description="Gửi tóm tắt định kỳ đến danh sách người nhận đã cấu hình."
                  id="scheduled-reports"
                  label="Bật báo cáo định kỳ"
                  onCheckedChange={(value) =>
                    updateSetting("scheduledReports", value)
                  }
                />
              </div>
              <DSFormField
                htmlFor="report-recipients"
                label="Người nhận báo cáo"
                description="Dùng các địa chỉ email phân tách bằng dấu phẩy để gửi báo cáo định kỳ."
                error={errors.reportRecipients}
              >
                <DSTextarea
                  id="report-recipients"
                  onChange={(event) =>
                    updateSetting("reportRecipients", event.target.value)
                  }
                  placeholder="ops@example.com, finance@example.com"
                  rows={4}
                  value={settings.reportRecipients}
                />
              </DSFormField>
            </DSCardContent>
          </DSCard>
        </DSPageBody>
      </DSPage>
    </DSAppShell>
  )
}

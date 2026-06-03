"use client"

import { toastInfo, toastSuccess, toastWarning } from "@/components/ds/toast"

type DSStatusAction = "enabled" | "disabled" | "archived" | "restored"

type NotifyStatusChangeOptions = {
  entity: string
  name?: string
  status: DSStatusAction
}

const statusCopy = {
  enabled: {
    title: "đã được kích hoạt",
    description: "có thể truy cập hệ thống trở lại.",
    notify: toastSuccess,
  },
  disabled: {
    title: "đã bị vô hiệu hóa",
    description: "không còn quyền truy cập hệ thống.",
    notify: toastWarning,
  },
  archived: {
    title: "đã được lưu trữ",
    description: "đã được đưa ra khỏi luồng xử lý đang hoạt động.",
    notify: toastInfo,
  },
  restored: {
    title: "đã được khôi phục",
    description: "đã có lại trong luồng xử lý đang hoạt động.",
    notify: toastSuccess,
  },
} as const

function notifyStatusChange({
  entity,
  name,
  status,
}: NotifyStatusChangeOptions) {
  const copy = statusCopy[status]
  const label = name?.trim() || entity

  return copy.notify(`${entity} ${copy.title}`, `${label} ${copy.description}`)
}

function notifyStatusEnabled(entityName: string, entity = "Bản ghi") {
  return notifyStatusChange({
    entity,
    name: entityName,
    status: "enabled",
  })
}

function notifyStatusDisabled(entityName: string, entity = "Bản ghi") {
  return notifyStatusChange({
    entity,
    name: entityName,
    status: "disabled",
  })
}

export {
  notifyStatusChange,
  notifyStatusDisabled,
  notifyStatusEnabled,
}
export type { DSStatusAction, NotifyStatusChangeOptions }

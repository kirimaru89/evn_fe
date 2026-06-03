"use client"

import * as React from "react"
import { toast } from "sonner"

import { Toaster as DSToaster } from "@/components/ui/sonner"

type DSToastDescription = React.ReactNode

function toastSuccess(message: React.ReactNode, description?: DSToastDescription) {
  return toast.success(message, { description })
}

function toastError(message: React.ReactNode, description?: DSToastDescription) {
  return toast.error(message, { description })
}

function toastInfo(message: React.ReactNode, description?: DSToastDescription) {
  return toast.info(message, { description })
}

function toastWarning(
  message: React.ReactNode,
  description?: DSToastDescription
) {
  return toast.warning(message, { description })
}

export {
  DSToaster,
  toastError,
  toastInfo,
  toastSuccess,
  toastWarning,
}
export type { DSToastDescription }

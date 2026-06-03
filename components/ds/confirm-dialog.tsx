"use client"

import * as React from "react"

import { DSButton } from "@/components/ds/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type DSConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "default" | "destructive"
  loading?: boolean
  trigger?: React.ReactNode
  onConfirm: () => void | Promise<void>
}

function DSConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  variant = "default",
  loading = false,
  trigger,
  onConfirm,
}: DSConfirmDialogProps) {
  const [pending, setPending] = React.useState(false)
  const isLoading = loading || pending

  const handleOpenChange = (nextOpen: boolean) => {
    if (isLoading && !nextOpen) {
      return
    }

    onOpenChange(nextOpen)
  }

  const handleConfirm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    try {
      setPending(true)
      await onConfirm()
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <DSButton
              loading={isLoading}
              onClick={handleConfirm}
              variant={variant === "destructive" ? "destructive" : "default"}
            >
              {confirmLabel}
            </DSButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DSConfirmDialog }
export type { DSConfirmDialogProps }

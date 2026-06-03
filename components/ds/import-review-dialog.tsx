"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSConfirmDialog } from "./confirm-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type DSImportReviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmDisabled?: boolean
  confirmLoading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  preventCloseWhenDirty?: boolean
}

function DSImportReviewDialog({
  open,
  onOpenChange,
  title,
  children,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  confirmDisabled = false,
  confirmLoading = false,
  onConfirm,
  onCancel,
  preventCloseWhenDirty = false,
}: DSImportReviewDialogProps) {
  const [closeConfirmOpen, setCloseConfirmOpen] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const isConfirming = confirmLoading || pending

  const closeDialog = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const requestClose = () => {
    if (isConfirming) {
      return
    }

    if (preventCloseWhenDirty) {
      setCloseConfirmOpen(true)
      return
    }

    closeDialog()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      requestClose()
      return
    }

    onOpenChange(true)
  }

  const handleConfirm = async () => {
    try {
      setPending(true)
      await onConfirm()
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className={cn(
            "flex max-h-[88svh] w-[calc(100vw-2rem)] max-w-[96vw] grid-rows-none flex-col gap-0 overflow-hidden p-0 sm:max-w-[96vw]"
          )}
        >
          <DialogHeader className="sticky top-0 z-10 border-b border-border bg-popover p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <DialogTitle>{title}</DialogTitle>
              <div className="flex shrink-0 items-center gap-2">
                <DSButton
                  disabled={isConfirming}
                  onClick={requestClose}
                  type="button"
                  variant="outline"
                >
                  {cancelLabel}
                </DSButton>
                <DSButton
                  disabled={confirmDisabled}
                  loading={isConfirming}
                  onClick={handleConfirm}
                  type="button"
                >
                  {confirmLabel}
                </DSButton>
              </div>
            </div>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-auto p-4">
            <div className="flex min-h-full min-w-0 flex-1">{children}</div>
          </div>
        </DialogContent>
      </Dialog>
      <DSConfirmDialog
        open={closeConfirmOpen}
        onOpenChange={setCloseConfirmOpen}
        title="Đóng rà soát import?"
        description="Các chỉnh sửa chưa xác nhận sẽ bị mất nếu đóng hộp thoại này."
        confirmLabel="Đóng"
        cancelLabel="Tiếp tục rà soát"
        variant="destructive"
        onConfirm={() => {
          setCloseConfirmOpen(false)
          closeDialog()
        }}
      />
    </>
  )
}

export { DSImportReviewDialog }
export type { DSImportReviewDialogProps }

"use client"

import * as React from "react"
import { Download, Upload } from "lucide-react"

import { cn } from "@/lib/utils"
import { DSButton } from "./button"
import { DSConfirmDialog } from "./confirm-dialog"
import { DSSpinner } from "./spinner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type DSImportFileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  acceptedFormats?: string[]
  maxFileSizeLabel?: string
  templateLabel?: string
  onDownloadTemplate?: () => void
  onUploadFile?: (file: File) => void | Promise<void>
  onUploadComplete?: (file: File) => void
  uploadDurationMs?: number
  preventCloseWhileUploading?: boolean
  loading?: boolean
}

type UploadState = "idle" | "uploading" | "completed" | "error"

function getAcceptValue(acceptedFormats: string[]) {
  return acceptedFormats
    .map((format) => {
      const normalized = format.trim().toLowerCase()

      return normalized.startsWith(".") ? normalized : `.${normalized}`
    })
    .join(",")
}

function DSImportFileDialog({
  open,
  onOpenChange,
  title,
  description,
  acceptedFormats = ["CSV", "XLSX"],
  maxFileSizeLabel,
  templateLabel = "Tải file mẫu",
  onDownloadTemplate,
  onUploadFile,
  onUploadComplete,
  uploadDurationMs = 800,
  preventCloseWhileUploading = true,
  loading = false,
}: DSImportFileDialogProps) {
  const inputId = React.useId()
  const intervalRef = React.useRef<number | null>(null)
  const closeTimeoutRef = React.useRef<number | null>(null)
  const uploadRunRef = React.useRef(0)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [pending, setPending] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [uploadState, setUploadState] = React.useState<UploadState>("idle")
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false)
  const isLoading = loading || pending
  const isUploading = uploadState === "uploading"
  const guidance = [
    acceptedFormats.length
      ? `Định dạng chấp nhận: ${acceptedFormats.join(", ")}`
      : null,
    maxFileSizeLabel,
  ]
    .filter(Boolean)
    .join(". ")

  const clearProgressInterval = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  React.useEffect(() => {
    return () => {
      clearProgressInterval()
      clearCloseTimeout()
    }
  }, [])

  const resetUploadState = () => {
    clearProgressInterval()
    clearCloseTimeout()
    setSelectedFile(null)
    setPending(false)
    setProgress(0)
    setUploadState("idle")
    setCancelConfirmOpen(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isUploading && preventCloseWhileUploading) {
      setCancelConfirmOpen(true)
      return
    }

    if (!nextOpen) {
      resetUploadState()
    }

    onOpenChange(nextOpen)
  }

  const simulateProgress = (runId: number) =>
    new Promise<void>((resolve) => {
      const startedAt = Date.now()
      clearProgressInterval()
      intervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startedAt
        const nextProgress = Math.min(
          95,
          10 + Math.round((elapsed / uploadDurationMs) * 85)
        )

        if (uploadRunRef.current === runId) {
          setProgress(nextProgress)
        }

        if (elapsed >= uploadDurationMs) {
          clearProgressInterval()
          resolve()
        }
      }, 120)
    })

  const uploadFile = async (file: File) => {
    const runId = uploadRunRef.current + 1

    uploadRunRef.current = runId
    setSelectedFile(file)
    setUploadState("uploading")
    setProgress(10)
    setPending(true)

    try {
      await Promise.all([onUploadFile?.(file), simulateProgress(runId)])

      if (uploadRunRef.current !== runId) {
        return
      }

      clearProgressInterval()
      setProgress(100)
      setUploadState("completed")
      setPending(false)

      closeTimeoutRef.current = window.setTimeout(() => {
        if (uploadRunRef.current !== runId) {
          return
        }

        resetUploadState()
        onOpenChange(false)
        onUploadComplete?.(file)
      }, 500)
    } catch {
      if (uploadRunRef.current === runId) {
        clearProgressInterval()
        setUploadState("error")
        setPending(false)
      }
    } finally {
      if (uploadRunRef.current !== runId) {
        setPending(false)
      }
    }
  }

  const cancelUpload = () => {
    uploadRunRef.current += 1
    resetUploadState()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="grid gap-4">
          <label
            htmlFor={inputId}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card p-6 text-center transition-colors hover:bg-muted/40",
              isLoading && "pointer-events-none opacity-60"
            )}
          >
            <Upload aria-hidden="true" className="size-5 text-muted-foreground" />
            <span className="grid gap-1">
              <span className="text-sm font-medium">
                {selectedFile ? selectedFile.name : "Chọn file import"}
              </span>
              <span className="text-sm text-muted-foreground">
                {uploadState === "uploading"
                  ? "Đang tải lên..."
                  : uploadState === "completed"
                    ? "Tải lên hoàn tất"
                    : uploadState === "error"
                      ? "Tải lên thất bại. Hãy chọn lại file để thử lại."
                    : selectedFile
                      ? "Đã chọn file."
                      : "Chọn file từ thiết bị của bạn."}
              </span>
            </span>
          </label>
          {guidance ? (
            <p className="text-sm text-muted-foreground">{guidance}</p>
          ) : null}
          {isUploading ? (
            <p className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              Đang tải lên. Vui lòng giữ cửa sổ này mở cho đến khi hoàn tất.
            </p>
          ) : null}
          <input
            id={inputId}
            type="file"
            className="sr-only"
            accept={getAcceptValue(acceptedFormats)}
            disabled={isLoading}
            onChange={(event) => {
              const file = event.target.files?.[0]

              if (file) {
                void uploadFile(file)
              }

              event.target.value = ""
            }}
          />
          {uploadState === "uploading" || uploadState === "completed" ? (
            <div className="grid gap-2" role="status" aria-live="polite">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="inline-flex items-center gap-2 font-medium">
                  {uploadState === "uploading" ? (
                    <DSSpinner size="sm" aria-hidden="true" />
                  ) : null}
                  {uploadState === "completed"
                    ? "Tải lên hoàn tất"
                    : "Đang tải lên..."}
                </span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  role="progressbar"
                  aria-label="Tiến độ tải lên"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <DSButton
            disabled={isLoading}
            leftIcon={<Download />}
            onClick={onDownloadTemplate}
            type="button"
            variant="outline"
          >
            {templateLabel}
          </DSButton>
        </DialogFooter>
      </DialogContent>
      <DSConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        title="Hủy tải lên?"
        description="File vẫn đang được tải lên. Đóng cửa sổ này sẽ dừng lượt tải hiện tại."
        confirmLabel="Hủy tải lên"
        cancelLabel="Tiếp tục tải lên"
        variant="destructive"
        onConfirm={cancelUpload}
      />
    </Dialog>
  )
}

export { DSImportFileDialog }
export type { DSImportFileDialogProps }

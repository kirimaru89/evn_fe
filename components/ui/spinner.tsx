import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

type SpinnerProps = Omit<
  React.ComponentProps<typeof HugeiconsIcon>,
  "icon" | "strokeWidth"
> & {
  strokeWidth?: number
}

function Spinner({ className, strokeWidth = 2, ...props }: SpinnerProps) {
  return (
    <div className={cn("size-4 animate-spin", className)}>
      <HugeiconsIcon
        icon={Loading03Icon}
        strokeWidth={strokeWidth}
        role="status"
        aria-label="Loading"
        className="size-full"
        {...props}
      />
    </div>
  )
}

export { Spinner }
export type { SpinnerProps }

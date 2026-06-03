import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DSSpinner } from "./spinner"

type DSButtonProps = React.ComponentProps<typeof Button> & {
  leftIcon?: React.ReactNode
  loading?: boolean
  rightIcon?: React.ReactNode
}

function DSButton({
  className,
  children,
  disabled,
  leftIcon,
  loading = false,
  rightIcon,
  asChild,
  ...props
}: DSButtonProps) {
  const leadingIcon = loading ? (
    <DSSpinner data-icon="inline-start" size="sm" />
  ) : leftIcon ? (
    <span
      data-icon="inline-start"
      className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0"
      aria-hidden="true"
    >
      {leftIcon}
    </span>
  ) : null
  const trailingIcon = rightIcon ? (
    <span
      data-icon="inline-end"
      className="inline-flex size-4 shrink-0 items-center justify-center [&_svg]:size-4 [&_svg]:shrink-0"
      aria-hidden="true"
    >
      {rightIcon}
    </span>
  ) : null
  const content = (
    <>
      {leadingIcon}
      {children}
      {trailingIcon}
    </>
  )
  const buttonChildren =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? React.cloneElement(children, {
          children: (
            <>
              {leadingIcon}
              {children.props.children}
              {trailingIcon}
            </>
          ),
        })
      : content

  return (
    <Button
      asChild={asChild}
      data-slot="ds-button"
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn("min-w-fit gap-2", className)}
      {...props}
    >
      {buttonChildren}
    </Button>
  )
}

export { DSButton }
export type { DSButtonProps }

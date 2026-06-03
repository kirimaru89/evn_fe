import * as React from "react"

import { cn } from "@/lib/utils"

type DSFormFieldProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode
  required?: boolean
  description?: React.ReactNode
  error?: React.ReactNode
  htmlFor: string
  children:
    | React.ReactNode
    | ((fieldProps: DSFormFieldControlProps) => React.ReactNode)
}

type DSFormFieldControlProps = {
  id: string
  "aria-describedby"?: string
  "aria-invalid"?: boolean
  "aria-required"?: boolean
}

function DSFormField({
  label,
  required = false,
  description,
  error,
  htmlFor,
  children,
  className,
  ...props
}: DSFormFieldProps) {
  const descriptionId = description ? `${htmlFor}-description` : undefined
  const errorId = error ? `${htmlFor}-error` : undefined
  const describedBy = [descriptionId, errorId].filter(Boolean).join(" ")
  const fieldProps: DSFormFieldControlProps = {
    id: htmlFor,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : undefined,
    "aria-required": required || undefined,
  }

  const control =
    typeof children === "function"
      ? children(fieldProps)
      : React.isValidElement<
            React.HTMLAttributes<HTMLElement> & { id?: string }
          >(children)
        ? React.cloneElement(children, {
            id: children.props.id ?? htmlFor,
            "aria-describedby":
              describedBy || children.props["aria-describedby"],
            "aria-invalid": error ? true : children.props["aria-invalid"],
            "aria-required": required || children.props["aria-required"],
          })
        : children

  return (
    <div
      data-slot="ds-form-field"
      className={cn("grid gap-2", className)}
      {...props}
    >
      <label className="text-sm font-medium" htmlFor={htmlFor}>
        {label}
        {required ? (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {control}
      {description ? (
        <p
          className="text-sm text-muted-foreground"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

export { DSFormField }
export type { DSFormFieldControlProps, DSFormFieldProps }

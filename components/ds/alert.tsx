import * as React from "react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type DSAlertProps = React.ComponentProps<typeof Alert> & {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

function DSAlert({
  title,
  description,
  action,
  children,
  ...props
}: DSAlertProps) {
  return (
    <Alert data-slot="ds-alert" {...props}>
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {description ? (
        <AlertDescription>{description}</AlertDescription>
      ) : null}
      {children}
      {action ? <AlertAction>{action}</AlertAction> : null}
    </Alert>
  )
}

export { DSAlert }
export type { DSAlertProps }

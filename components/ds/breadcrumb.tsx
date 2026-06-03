import * as React from "react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type DSBreadcrumbItem = {
  label: React.ReactNode
  href?: string
}

type DSBreadcrumbProps = Omit<React.ComponentProps<typeof Breadcrumb>, "children"> & {
  items: readonly DSBreadcrumbItem[]
}

function DSBreadcrumb({ items, ...props }: DSBreadcrumbProps) {
  return (
    <Breadcrumb data-slot="ds-breadcrumb" {...props}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={`${item.href ?? "page"}-${index}`}>
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? <BreadcrumbSeparator /> : null}
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { DSBreadcrumb }
export type { DSBreadcrumbItem, DSBreadcrumbProps }

type DSNotificationBadgeProps = {
  count: number
}

function DSNotificationBadge({ count }: DSNotificationBadgeProps) {
  if (count === 0) {
    return null
  }

  return (
    <span
      data-slot="ds-notification-badge"
      className="pointer-events-none absolute -right-1.5 -top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-medium leading-none text-destructive-foreground text-[color:var(--destructive-foreground,var(--primary-foreground))]"
      aria-hidden="true"
    >
      {count > 9 ? "9+" : count}
    </span>
  )
}

export { DSNotificationBadge }
export type { DSNotificationBadgeProps }

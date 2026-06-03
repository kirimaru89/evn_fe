"use client"

import * as React from "react"
import Link from "next/link"
import { HelpCircle } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DSButton } from "./button"
import { DSIconButtonTooltip } from "./icon-button-tooltip"

type DSHelpMenuItem = {
  label: string
  href?: string
  onSelect?: () => void
}

type DSHelpMenuProps = {
  helpItem?: DSHelpMenuItem
  trainingItem?: DSHelpMenuItem
  termsItem?: DSHelpMenuItem
  feedbackItem?: DSHelpMenuItem
}

function HelpMenuItem({ item }: { item: DSHelpMenuItem }) {
  if (item.href) {
    return (
      <DropdownMenuItem asChild>
        <Link href={item.href}>{item.label}</Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem onSelect={item.onSelect}>{item.label}</DropdownMenuItem>
  )
}

function DSHelpMenu({
  helpItem = { label: "Trợ giúp" },
  trainingItem = { label: "Hướng dẫn sử dụng" },
  termsItem = { label: "Điều khoản và chính sách" },
  feedbackItem = { label: "Gửi phản hồi" },
}: DSHelpMenuProps) {
  return (
    <DropdownMenu>
      <DSIconButtonTooltip label="Trợ giúp">
        <DropdownMenuTrigger asChild>
          <DSButton
            aria-label="Trợ giúp"
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <HelpCircle aria-hidden="true" />
          </DSButton>
        </DropdownMenuTrigger>
      </DSIconButtonTooltip>
      <DropdownMenuContent align="end" className="w-64">
        <HelpMenuItem item={helpItem} />
        <HelpMenuItem item={trainingItem} />
        <DropdownMenuSeparator />
        <HelpMenuItem item={termsItem} />
        <DropdownMenuSeparator />
        <HelpMenuItem item={feedbackItem} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DSHelpMenu }
export type { DSHelpMenuItem, DSHelpMenuProps }

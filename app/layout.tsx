import {
  Geist_Mono,
  Instrument_Sans,
  Space_Grotesk,
} from "next/font/google"

import "./globals.css"
import { DSToaster } from "@/components/ds"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const instrumentSansHeading = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        fontMono.variable,
        spaceGrotesk.variable,
        instrumentSansHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <DSToaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "sonner"
import { getDictionary } from "@/lib/i18n"
import "./globals.css"

export const runtime = "edge"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Folio — Premium Digital Flipbooks",
    template: "%s | Folio",
  },
  description:
    "Create and share beautiful digital flipbooks. Add rich text, images, and videos to stunning page-flipping books.",
  keywords: ["flipbook", "ebook", "digital book", "publishing", "reading"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Folio",
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getDictionary()

  return (
    <html
      lang={messages.meta.htmlLang}
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a
          href="#main-content"
          className="sr-only absolute left-4 top-4 z-[100] rounded-md bg-paper px-4 py-2 text-sm font-medium text-ink shadow-card focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-gold"
        >
          Skip to main content
        </a>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FFFDF9",
              border: "1px solid #D8CFC4",
              color: "#2C2C2C",
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  )
}

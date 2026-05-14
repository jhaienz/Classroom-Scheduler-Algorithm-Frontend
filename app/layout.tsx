import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

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
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body className="h-screen overflow-hidden bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex h-full w-full">
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto bg-gradient-to-br from-background via-background to-muted/20">
              <div className="h-full px-8 py-6 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}

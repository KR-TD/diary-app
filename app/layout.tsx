import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AdFitScript } from "../components/ad-script"
import "./globals.css"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "하루의 끝 - 일기 쓰기",
  description: "감성적인 일기 작성 플랫폼",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <AdFitScript />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

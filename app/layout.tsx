import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "../components/theme-provider"

import "./globals.css"


const inter = Inter({ subsets: ["latin"] })

const siteName = "하루의 끝"
const siteUrl = "https://www.haru2end.com"
const title = "하루의 끝 - 당신의 하루를 기록하는 감성 온라인 일기장"
const description =
  "오늘의 감정과 생각을 기록하세요. '하루의 끝'은 배경음악과 함께하는 감성 다이어리 및 온라인 일기장입니다. 당신의 소중한 하루를 안전하게 보관하고 언제든 다시 돌아보세요."
const ogImage = `${siteUrl}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteName}`,
  },
  description: description,
  keywords: [
    "하루의 끝",
    "일기장",
    "온라인 일기",
    "감성 일기",
    "다이어리",
    "하루 마무리",
    "haru2end",
  ],
  openGraph: {
    title: title,
    description: description,
    url: siteUrl,
    siteName: siteName,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "하루의 끝 미리보기 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: siteUrl,
              logo: `${siteUrl}/icon-512x512.png`
            })
          }}
        />
         <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "author": {
                "@type": "Organization",
                "name": "하루의 끝 개발팀"
              },
              "headline": title,
              "description": description,
              "image": ogImage,
              "publisher": {
                "@type": "Organization",
                "name": "하루의 끝",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${siteUrl}/icon-512x512.png`
                }
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

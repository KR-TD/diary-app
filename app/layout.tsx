import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from 'next/headers'

import { ThemeProvider } from "../components/theme-provider"

import "./globals.css"

// New import for Providers
import { Providers } from "./providers"


const inter = Inter({ subsets: ["latin"] })

const siteName = "하루의 끝"
const siteUrl = "https://www.haru2end.com"
const title = "하루의 끝 - 당신의 하루를 기록하는 감성 온라인 일기장"
const description =
  "하루의 끝에서 당신의 하루를 특별하게 마무리하세요. 이곳은 잔잔한 배경음악과 함께 오늘의 감정과 생각을 기록할 수 있는 감성 온라인 일기장이자 다이어리입니다. 매일의 소중한 순간, 스트레스, 비밀스러운 마음까지 안전하게 기록하고 보관하세요. 익명성이 보장되는 이 공간에서 마음 챙김과 스트레스 해소를 위한 글쓰기를 통해 자신을 돌아보는 시간을 가질 수 있습니다. 당신의 모든 하루를 응원합니다."
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
    "일기쓰기",
    "일기장",
    "일기장 사이트",
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const lang = headersList.get('accept-language')?.split(',')[0] || 'ko'

  return (
    <html lang={lang} suppressHydrationWarning>
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
        <Providers initialLocale={lang}>
          {children}
        </Providers>
      </body>
    </html>
  )
}
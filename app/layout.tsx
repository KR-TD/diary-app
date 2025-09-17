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
const title = "하루의 끝 - 감성 온라인 일기장 | 매일의 생각과 감정 기록, 다이어리 꾸미기"
const description =
  "하루의 끝에서 당신의 하루를 특별하게 마무리하세요. 감성적인 온라인 일기장에 오늘의 순간, 감정, 생각을 기록하며 나만의 다이어리를 만들고 꾸밀 수 있습니다."
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
    "온라인 일기장",
    "감성 다이어리",
    "하루 기록",
    "다이어리 꾸미기",
    "매일의 생각",
    "감정 기록",
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
        <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KS38JN7W');`,
          }}
        />
        {/* End Google Tag Manager */}
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
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KS38JN7W"
        height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
"use client"

import type React from "react"

import { useEffect } from "react"

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface GoogleAdProps {
  adSlot: string
  adFormat?: string
  adLayout?: string
  adLayoutKey?: string
  style?: React.CSSProperties
  className?: string
}

export function GoogleAd({ adSlot, adFormat = "auto", adLayout, adLayoutKey, style, className = "" }: GoogleAdProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [])

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-3964150123386513" // 실제 애드센스 클라이언트 ID로 교체하세요
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// 배너 광고 컴포넌트
export function BannerAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="1234567890" // 실제 광고 슬롯 ID로 교체하세요
      adFormat="horizontal"
      className={`banner-ad ${className}`}
    />
  )
}

// 사각형 광고 컴포넌트
export function SquareAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="0987654321" // 실제 광고 슬롯 ID로 교체하세요
      adFormat="rectangle"
      className={`square-ad ${className}`}
    />
  )
}

// 사이드바 광고 컴포넌트
export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="1122334455" // 실제 광고 슬롯 ID로 교체하세요
      adFormat="vertical"
      className={`sidebar-ad ${className}`}
    />
  )
}

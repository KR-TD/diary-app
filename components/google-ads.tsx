"use client"

import type React from "react"
import { useEffect, useState } from "react"

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
  const [showAd, setShowAd] = useState(true)

  useEffect(() => {
    const adTimer = setTimeout(() => {
      const adElement = document.querySelector(`.ad-container[data-ad-slot="${adSlot}"] .adsbygoogle`)
      if (adElement && adElement.innerHTML.trim() === "") {
        setShowAd(false)
      }
    }, 3000) // 3초 후에도 광고가 없으면 대체 이미지 표시

    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("AdSense error:", error)
      setShowAd(false)
    }

    return () => clearTimeout(adTimer)
  }, [adSlot])

  if (!showAd) {
    return (
      <div className={`ad-placeholder ${className}`} style={{ ...style, height: 'auto', backgroundColor: '#f0f0f0' }}>
        <img src="/광고 대체.png" alt="Advertisement" style={{ width: "100%", height: "auto", display: 'block' }} />
      </div>
    )
  }

  return (
    <div className={`ad-container ${className}`} style={style} data-ad-slot={adSlot}>
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
      style={{ width: "100%", height: "100px" }}
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
      style={{ width: "300px", height: "250px" }}
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
      style={{ width: "160px", height: "600px" }}
    />
  )
}

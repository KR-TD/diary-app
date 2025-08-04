"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"

interface KakaoAdProps {
  adUnit: string
  adWidth: string
  adHeight: string
  className?: string
}

export function KakaoAd({ adUnit, adWidth, adHeight, className = "" }: KakaoAdProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement) return;

    const timer = setTimeout(() => {
      if (adElement && !adElement.querySelector("iframe")) {
        setShowPlaceholder(true)
      }
    }, 2500)

    return () => clearTimeout(timer)
  }, [adUnit])

  if (showPlaceholder) {
    return (
      <div className={`ad-placeholder ${className}`} style={{ width: `${adWidth}px`, height: `${adHeight}px`, backgroundColor: '#f0f0f0', margin: '0 auto' }}>
        <img src="/ad-placeholder.png" alt="Advertisement" style={{ width: "100%", height: "100%", display: 'block', objectFit: 'cover' }} />
      </div>
    )
  }

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ width: `${adWidth}px`, height: `${adHeight}px`, margin: '0 auto' }}
    >
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={adUnit}
        data-ad-width={adWidth}
        data-ad-height={adHeight}
      />
    </div>
  )
}

// 배너 광고 컴포넌트
export function BannerAd({ className = "" }: { className?: string }) {
  return (
    <KakaoAd
      adUnit="DAN-4JpNW8o4ndtLhmy8"
      adWidth="728"
      adHeight="90"
      className={`banner-ad ${className}`}
    />
  )
}

// 사각형 광고 컴포넌트
export function SquareAd({ className = "" }: { className?: string }) {
  return (
    <KakaoAd
      adUnit="DAN-4JpNW8o4ndtLhmy8"
      adWidth="300"
      adHeight="250"
      className={`square-ad ${className}`}
    />
  )
}

// 사이드바 광고 컴포넌트
export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <KakaoAd
      adUnit="DAN-4JpNW8o4ndtLhmy8"
      adWidth="160"
      adHeight="600"
      className={`sidebar-ad ${className}`}
    />
  )
}
"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from 'next/navigation'

interface KakaoAdProps {
  adUnit: string
  adWidth: string
  adHeight: string
  className?: string
}

export function KakaoAd({ adUnit, adWidth, adHeight, className = "" }: KakaoAdProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname() // Get the current route

  useEffect(() => {
    const adElement = adRef.current
    if (!adElement) return

    // Clear previous ad content on path change
    adElement.innerHTML = ""

    const ins = document.createElement("ins")
    ins.className = "kakao_ad_area"
    ins.style.display = "none"
    ins.setAttribute("data-ad-unit", adUnit)
    ins.setAttribute("data-ad-width", adWidth)
    ins.setAttribute("data-ad-height", adHeight)
    adElement.appendChild(ins)

    // The AdFit script is loaded globally in layout.tsx
    // We need to re-initialize the ad unit for SPA navigation
    if (window.kakaoAdFit) {
        window.kakaoAdFit.display(ins)
    } else {
        // Fallback for the first load
        const script = document.createElement("script")
        script.type = "text/javascript"
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js"
        script.async = true
        adElement.appendChild(script)
    }

    // Cleanup function to remove the ad on component unmount
    return () => {
      if (adElement) {
        adElement.innerHTML = ""
      }
    }
  }, [adUnit, adWidth, adHeight, pathname]) // Re-run effect when path changes

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ width: `${adWidth}px`, height: `${adHeight}px`, margin: "0 auto" }}
    />
  )
}

// 반응형 배너 광고
export function BannerAd({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <KakaoAd
        adUnit="DAN-OdbuLQOqVTkMus4q"
        adWidth="320"
        adHeight="100"
        className={`banner-ad-mobile ${className}`}
      />
    )
  }

  return (
    <KakaoAd
      adUnit="DAN-4JpNW8o4ndtLhmy8"
      adWidth="728"
      adHeight="90"
      className={`banner-ad-desktop ${className}`}
    />
  )
}

// 사각형 광고 컴포넌트 (반응형)
export function SquareAd({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <KakaoAd
        adUnit="DAN-4JpNW8o4ndtLhmy8" // 모바일용 광고 단위 ID
        adWidth="320"
        adHeight="250"
        className={`square-ad-mobile ${className}`}
      />
    )
  }

  return (
    <KakaoAd
      adUnit="DAN-4JpNW8o4ndtLhmy8"
      adWidth="300"
      adHeight="250"
      className={`square-ad-desktop ${className}`}
    />
  )
}

// 사이드바 광고는 모바일에서 숨김
export function SidebarAd({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return null // 모바일에서는 사이드바 광고를 표시하지 않음
  }

  return (
    <KakaoAd
      adUnit="DAN-4JpNW8o4ndtLhmy8"
      adWidth="160"
      adHeight="600"
      className={`sidebar-ad ${className}`}
    />
  )
}
"use client"

import type React from "react"
import { useIsMobile } from "@/hooks/use-mobile"

/**
 * A "dumb" component that only renders the <ins> tag for an ad.
 * The actual ad loading and script management is handled by the parent page.
 */
interface KakaoAdInsProps {
  adUnit: string
  adWidth: string
  adHeight: string
  className?: string
}

function KakaoAdIns({ adUnit, adWidth, adHeight, className = "" }: KakaoAdInsProps) {
  return (
    <div className={`ad-container ${className}`} style={{ width: `${adWidth}px`, height: `${adHeight}px`, margin: "0 auto" }}>
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

// Top Banner Ad
export function TopBannerAd({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <KakaoAdIns
      adUnit="DAN-OdbuLQOqVTkMus4q"
      adWidth="320"
      adHeight="100"
      className={`banner-ad-mobile ${className}`}
    />
  ) : (
    <KakaoAdIns
      adUnit="DAN-4JpNW8o4ndtLhmy8"
      adWidth="728"
      adHeight="90"
      className={`banner-ad-desktop ${className}`}
    />
  )
}

// Bottom Banner Ad
export function BottomBannerAd({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <KakaoAdIns
      adUnit="DAN-yiP4TSU5JEWvwReg"
      adWidth="320"
      adHeight="100"
      className={`banner-ad-mobile ${className}`}
    />
  ) : (
    <KakaoAdIns
      adUnit="DAN-e1av4mDSH2ie0Ehw"
      adWidth="728"
      adHeight="90"
      className={`banner-ad-desktop ${className}`}
    />
  )
}

// Square Ad
export function SquareAd({ className = "" }: { className?: string }) {
  const isMobile = useIsMobile()
  return (
    <KakaoAdIns
      adUnit="DAN-4JpNW8o4ndtLhmy8" // This can be a different ad unit ID
      adWidth={isMobile ? "320" : "300"}
      adHeight="250"
      className={`square-ad ${className}`}
    />
  )
}
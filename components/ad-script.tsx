"use client"

import Script from "next/script"

export function AdFitScript() {
  return (
    <Script
      async
      src="//t1.daumcdn.net/kas/static/ba.min.js"
      strategy="afterInteractive"
      onError={(e) => {
        console.error("AdFit script failed to load", e)
      }}
    />
  )
}
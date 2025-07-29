"use client"

import Script from "next/script"

export function AdSenseScript() {
  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3964150123386513"
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onError={(e) => {
        console.error("AdSense script failed to load", e)
      }}
    />
  )
}

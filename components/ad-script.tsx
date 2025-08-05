"use client"

import Script from "next/script"

export function AdFitScript() {
  return (
    <>
      <Script
        id="kakao-adfit-script"
        async
        src="//t1.daumcdn.net/kas/static/ba.min.js"
        strategy="afterInteractive"
        onError={(e) => {
          console.error("AdFit script failed to load", e)
        }}
      />
      <Script id="kakao-adfit-init">
        {
          `
          window.kakaoAsyncInit = function() {
            // 여기에 애드핏 API 초기화 코드를 넣을 수 있습니다.
          }
          `
        }
      </Script>
    </>
  )
}
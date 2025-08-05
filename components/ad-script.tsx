"use client";

import Script from "next/script";

declare global {
  interface Window {
    adfitScriptLoaded?: boolean;
  }
}

export function AdFitScript() {
  return (
    <Script
      id="kakao-adfit-script"
      src="//t1.daumcdn.net/kas/static/ba.min.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log("Kakao AdFit Script Loaded");
        window.adfitScriptLoaded = true;
        window.dispatchEvent(new Event('adfit-loaded'));
      }}
      onError={(e) => {
        console.error("AdFit script failed to load", e);
      }}
    />
  );
}

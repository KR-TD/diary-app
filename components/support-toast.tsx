"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"

export function SupportToast() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // 로컬 스토리지에서 토스트 해제 상태 확인
    const dismissed = localStorage.getItem("supportToastDismissed")
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // 5초 후에 토스트 표시
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem("supportToastDismissed", "true")
  }

  const handleSupport = () => {
    // 후원 페이지로 이동하는 이벤트 발생
    window.dispatchEvent(new CustomEvent("showSupport"))
    handleDismiss()
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 animate-pulse" />
            <div>
              <p className="font-medium text-sm">개발자를 응원해주세요!</p>
              <p className="text-xs opacity-90 mt-1">여러분의 후원이 큰 힘이 됩니다 💝</p>
            </div>
          </div>
          <Button onClick={handleDismiss} variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1 h-auto">
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleSupport}
            size="sm"
            className="bg-white text-pink-600 hover:bg-gray-100 text-xs px-3 py-1"
          >
            후원하기
          </Button>
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 text-xs px-3 py-1"
          >
            나중에
          </Button>
        </div>
      </div>
    </div>
  )
}

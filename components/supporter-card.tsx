"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Trophy, Award, Medal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { formatDistanceToNow } from "date-fns"
import { ko, enUS, ja, zhCN } from "date-fns/locale"

interface SupporterCardProps {
  name: string
  amount: string
  date: string
  message?: string
  tier: "vip" | "gold" | "silver" | "bronze"
  isDarkMode: boolean
}

const localeMap = {
  ko: ko,
  en: enUS,
  ja: ja,
  zh: zhCN,
}

export function SupporterCard({ name, amount, date, message, tier, isDarkMode }: SupporterCardProps) {
  const { i18n } = useTranslation()
  const currentLocale = localeMap[i18n.language] || enUS

  const formattedDate = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: currentLocale,
  })

  const getTierIcon = () => {
    switch (tier) {
      case "vip":
        return <Trophy className="w-6 h-6 text-purple-500" />
      case "gold":
        return <Award className="w-5 h-5 text-yellow-500" />
      case "silver":
        return <Medal className="w-5 h-5 text-gray-400" />
      case "bronze":
        return <Medal className="w-4 h-4 text-orange-600" />
    }
  }

  const getTierStyle = () => {
    switch (tier) {
      case "vip":
        return isDarkMode
          ? "border-purple-400/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20"
          : "border-purple-300/50 bg-gradient-to-r from-purple-100/50 to-pink-100/50"
      case "gold":
        return isDarkMode
          ? "border-yellow-400/30 bg-gradient-to-r from-yellow-900/20 to-orange-900/20"
          : "border-yellow-300/50 bg-gradient-to-r from-yellow-100/50 to-orange-100/50"
      case "silver":
        return isDarkMode
          ? "border-gray-400/30 bg-gradient-to-r from-gray-800/20 to-slate-800/20"
          : "border-gray-300/50 bg-gradient-to-r from-gray-100/50 to-slate-100/50"
      case "bronze":
        return isDarkMode
          ? "border-orange-400/30 bg-gradient-to-r from-orange-900/20 to-red-900/20"
          : "border-orange-300/50 bg-gradient-to-r from-orange-100/50 to-red-100/50"
    }
  }

  return (
    <Card className={`border-2 ${getTierStyle()} transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          {getTierIcon()}
          <div>
            <div className={`font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{name}</div>
            <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {amount} • {formattedDate}
            </div>
          </div>
        </div>
        {message && <p className={`text-sm italic ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>"{message}"</p>}
        <div className="flex justify-end mt-2">
          <Heart className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse`} />
        </div>
      </CardContent>
    </Card>
  )
}

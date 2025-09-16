'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

type View = "write" | "list" | "support" | "hall" | "contact" | "community";

interface HallViewProps {
  isDarkMode: boolean;
  setCurrentView: (view: View) => void;
}

export function HallView({ isDarkMode, setCurrentView }: HallViewProps) {
  const { t } = useTranslation();

  return (
    <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-yellow-500/30 border border-slate-700/50" : "bg-white/90 border border-yellow-200/50 shadow-yellow-200/30"}`}>
      <CardHeader className="text-center pb-4 sm:pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="text-3xl sm:text-4xl animate-bounce">🏆</div>
          <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>{t("hall_of_fame_title")}</h2>
          <div className="text-3xl sm:text-4xl animate-bounce delay-100">🏆</div>
        </div>
        <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-yellow-700"}`}>{t("hall_of_fame_description")}</p>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-6">
        {/* 후원자 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
            <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
              49
            </div>
            <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>{t("total_supporters")}</div>
          </div>
          <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
            <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
              ₩862,200
            </div>
            <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>{t("total_donations")}</div>
          </div>
          <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
            <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
              235
            </div>
            <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>{t("total_diaries")}</div>
          </div>
        </div>

        {/* VIP 후원자 (10만원 이상) */}
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
            {t("vip_supporters")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {[
              { name: "김**님", amount: "150,000원", date: "2025.08.01", message: "좋은 서비스 감사합니다!" },
              { name: "이**님", amount: "200,000원", date: "2025.07.20", message: "개발자님 화이팅!" },
              { name: "박**님", amount: "100,000원", date: "2025.08.03", message: "매일 사용하고 있어요 ❤️" },
            ].map((supporter, index) => (
              <div key={index} className={`p-3 sm:p-4 rounded-xl border-2 ${isDarkMode ? "border-yellow-400/30 bg-gradient-to-r from-yellow-900/20 to-orange-900/20" : "border-yellow-300/50 bg-gradient-to-r from-yellow-100/50 to-orange-100/50"}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">💎</div>
                  <div>
                    <div className={`font-semibold ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                      {supporter.name}
                    </div>
                    <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-600"}`}>
                      {supporter.amount} • {supporter.date}
                    </div>
                  </div>
                </div>
                <p className={`text-sm italic ${isDarkMode ? "text-gray-300" : "text-yellow-600"}`}>
                  "{supporter.message}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 골드 후원자 (5만원 이상) */}
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
            {t("gold_supporters")}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {["최**님", "정**님", "강**님", "윤**님", "조**님", "장**님", "임**님", "한**님"].map(
              (name, index) => (
                <div key={index} className={`p-2 sm:p-3 rounded-lg text-center ${isDarkMode ? "bg-yellow-900/30 border border-yellow-600/30" : "bg-yellow-100/70 border border-yellow-300/50"}`}>
                  <div className="text-xl mb-1">🥇</div>
                  <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                    {name}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* 실버 후원자 (1만원 이상) */}
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
            {t("silver_supporters")}
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {[
              "쯔나미님", "이**님", "박**님", "최**님", "정**님", "강**님", "윤**님", "조**님",
              "장**님", "임**님", "한**님", "오**님", "신**님", "유**님", "홍**님", "송**님",
              "안**님", "황**님",
            ].map((name, index) => (
              <div key={index} className={`p-2 rounded text-center ${isDarkMode ? "bg-gray-700/50" : "bg-gray-100/70"}`}>
                <div className="text-sm mb-1">🥈</div>
                <div className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 브론즈 후원자 (1만원 미만) */}
        <div>
          <h3 className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
            {t("bronze_supporters")}
          </h3>
          <div className={`p-3 sm:p-4 rounded-xl text-center ${isDarkMode ? "bg-slate-800/30" : "bg-orange-50/50"}`}>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "강**님", "김동하님", "현**님", "문**님", "김태린님", "배**님", "김나윤님", "정태영님",
                "사내미아내님", "백**님", "노**님", "심**님", "원**님", "남**님", "고**님", "문**님",
                "양**님", "손**님", "배**님", "조**님",
              ].map((name, index) => (
                <span key={index} className={`inline-block px-2 py-1 rounded text-xs ${isDarkMode ? "bg-orange-900/30 text-orange-300" : "bg-orange-100 text-orange-700"}`}>
                  🥉 {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 감사 메시지 */}
        <div className="text-center space-y-4">
          <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
            <h4 className={`text-base sm:text-lg font-semibold mb-3 ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
              💌 {t("developer_thanks_message_title")}
            </h4>
            <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-yellow-600"}`}>
              {t("developer_thanks_message")}
            </p>
            <div className="mt-4 flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart key={i} className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse`} style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* 후원하기 버튼 */}
        <div className="text-center">
          <Button onClick={() => setCurrentView("support")} className={`px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${isDarkMode ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700" : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"}`}>
            <Heart className="w-5 h-5 mr-2" />
            {t("donate_now")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
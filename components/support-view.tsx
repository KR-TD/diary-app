'use client'

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface SupportViewProps {
  isDarkMode: boolean;
}

export function SupportView({ isDarkMode }: SupportViewProps) {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("1000-8490-8014");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-pink-500/30 border border-slate-700/50" : "bg-white/90 border border-pink-200/50 shadow-pink-200/30"}`}>
      <CardHeader className="text-center pb-4 sm:pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className={`w-6 h-6 ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
          <h2 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>{t("support_developer")}</h2>
          <Heart className={`w-6 h-6 ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
        </div>
        <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>{t("support_thanks")}</p>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-6">
        <div className="text-center space-y-4">
          <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-rose-50/80"}`}>
            <h3 className={`text-lg sm:text-xl font-semibold mb-3 ${isDarkMode ? "text-pink-300" : "text-rose-700"}`}>{t("support_message")}</h3>
            <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-rose-600"}`}>{t("support_message_detail")}</p>
          </div>
        </div>
        <div className="text-center space-y-4">
          <div className={`p-6 sm:p-8 rounded-xl border-2 border-dashed ${isDarkMode ? "border-pink-400/50 bg-pink-900/20" : "border-pink-300/50 bg-pink-100/50"}`}>
            <div className="mb-4">
              <img src="/placeholder.svg" alt={t("toss_bank")} className="mx-auto mb-3 rounded-lg h-16 w-auto" loading="lazy" />
              <h4 className={`text-base sm:text-lg font-semibold ${isDarkMode ? "text-pink-300" : "text-pink-700"}`}>{t("toss_bank")}</h4>
            </div>
            <div className={`text-2xl sm:text-3xl font-bold mb-2 font-mono tracking-wider ${isDarkMode ? "text-pink-200" : "text-pink-800"}`}>1000-8490-8014</div>
            <div className="flex items-center justify-center gap-2">
              <Button onClick={handleCopy} className={`px-5 sm:px-6 py-2 rounded-full transition-all duration-300 ${isDarkMode ? "bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30" : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 border border-pink-300/50"}`} variant="outline">
                {t("copy_account_number")}
              </Button>
              {isCopied && <span className="copy-success-animation text-sm text-pink-500">{t("copied")}</span>}
            </div>
          </div>
        </div>
        <div className="text-center space-y-4">
          <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? "bg-slate-800/30" : "bg-amber-50/50"}`}>
            <p className={`text-xs sm:text-sm italic ${isDarkMode ? "text-gray-400" : "text-amber-700"}`}>{t("small_support_message")}</p>
            <div className="mt-4 flex justify-center gap-2"><Heart className={`${isDarkMode ? "text-pink-400" : "text-pink-500"} w-4 h-4 animate-pulse`} /><Heart className={`${isDarkMode ? "text-pink-400" : "text-pink-500"} w-4 h-4 animate-pulse delay-100`} /><Heart className={`${isDarkMode ? "text-pink-400" : "text-pink-500"} w-4 h-4 animate-pulse delay-200`} /></div>
          </div>
        </div>
        <div className="text-center">
          <div className={`inline-block p-4 rounded-full ${isDarkMode ? "bg-slate-800/50" : "bg-rose-100/50"}`}>
            <div className={`text-3xl mb-2`}>👨‍💻</div>
            <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>{t("developer_team")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface ContactViewProps {
  isDarkMode: boolean;
}

export function ContactView({ isDarkMode }: ContactViewProps) {
  const { t } = useTranslation();

  return (
    <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-green-500/30 border border-slate-700/50" : "bg-white/90 border border-green-200/50 shadow-green-200/30"}`}>
      <CardHeader className="text-center pb-4 sm:pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Mail className={`w-6 h-6 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
          <h2 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>{t("contact_title")}</h2>
        </div>
        <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>{t("contact_description")}</p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 text-center">
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <Button asChild className={`px-6 py-2 text-base font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${isDarkMode ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700" : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"}`}>
            <a href="https://forms.gle/FqDo7Xq31L3fbK5T8" target="_blank" rel="noopener noreferrer">
              <Mail className="w-5 h-5 mr-2" />
              {t("contact_form_button")}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

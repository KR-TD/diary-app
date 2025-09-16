'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { SquareAd } from "@/components/kakao-ads";
import { DiaryEntry } from '@/hooks/use-diary';

interface ListViewProps {
  isDarkMode: boolean;
  diaryEntries: DiaryEntry[];
  currentItems: DiaryEntry[];
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  handleViewDetails: (id: number) => void;
  handleShare: (id: number) => void;
  handleDelete: (id: number) => void;
  formatEntryDate: (dateString: string) => string;
  moodEnumToEmojiMap: { [key: string]: string };
}

export function ListView({ 
  isDarkMode, 
  diaryEntries, 
  currentItems, 
  currentPage, 
  totalPages, 
  setCurrentPage, 
  handleViewDetails, 
  handleShare, 
  handleDelete, 
  formatEntryDate, 
  moodEnumToEmojiMap 
}: ListViewProps) {
  const { t } = useTranslation();

  const paginationGroup = () => {
    const groupSize = 5;
    const groupStart = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
    const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

    const goFirst = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage !== 1) setCurrentPage(1) };
    const goPrev = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) };
    const goNext = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) };
    const goLast = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage !== totalPages && totalPages > 0) setCurrentPage(totalPages) };

    return (
      <>
        <PaginationItem><PaginationLink href="#" onClick={goFirst} aria-label={t('first_page')} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>&laquo;</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" onClick={goPrev} aria-label={t('prev_page')} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>&lsaquo;</PaginationLink></PaginationItem>
        {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map((page) => (
          <PaginationItem key={page}><PaginationLink href="#" isActive={page === currentPage} aria-label={`${t('page')} ${page}`} onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}>{page}</PaginationLink></PaginationItem>
        ))}
        <PaginationItem><PaginationLink href="#" onClick={goNext} aria-label={t('next_page')} className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}>&rsaquo;</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#" onClick={goLast} aria-label={t('last_page')} className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}>&raquo;</PaginationLink></PaginationItem>
      </>
    );
  };

  return (
    <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-800/80 shadow-purple-500/20" : "bg-white/80"}`}>
      <CardHeader className="text-center pb-4 sm:pb-6">
        <h2 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>📖 {t("my_diaries")}</h2>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{t("total_entries", { count: diaryEntries.length })}</p>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
        {diaryEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{t("no_entries_yet")}</p>
            <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{t("write_first_diary")}</p>
          </div>
        ) : (
          <>
            {currentItems.map((entry, index) => (
              <div key={entry.id}>
                <div className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${isDarkMode ? "border-purple-500/30 bg-slate-700/50 hover:bg-slate-700/70" : "border-purple-100 bg-white/50 hover:bg-white/70"}`} onClick={() => handleViewDetails(entry.id)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{entry.title}</h3>
                      <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>{formatEntryDate(entry.createDate)} {entry.mood && <span className="ml-2 text-base">{moodEnumToEmojiMap[entry.mood]}</span>}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleShare(entry.id); }}
                        variant="ghost"
                        size="sm"
                        className={`text-xs px-2 py-1 rounded ${isDarkMode ? "text-blue-400 hover:bg-blue-900/20" : "text-blue-600 hover:bg-blue-100"}`}
                        disabled={entry.shared}
                      >
                        {t("share_to_community")}
                      </Button>
                      <Button onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }} variant="ghost" size="sm" className={`text-xs px-2 py-1 rounded ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-100"}`}>
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                  <p className={`text-sm sm:text-base line-clamp-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{entry.content}</p>
                  <div className={`text-right text-xs sm:text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {entry.content.length}{t("characters")}
                  </div>
                  {entry.imageUrl && (<div className="mt-3"><img src={entry.imageUrl} alt="Diary" className="w-full h-auto max-h-32 object-cover rounded-lg border border-gray-300/50" /></div>)}
                </div>
                {(index + 1) % 5 === 0 && index < diaryEntries.length - 1 && (
                  <div className="my-4 sm:my-6 text-center">
                    <p className={`text-xs mb-2 opacity-60 ${isDarkMode ? "text-gray-400" : "text-rose-500"}`}>{t("recommendation")}</p>
                    <SquareAd />
                  </div>
                )}
              </div>
            ))}
            <Pagination className="mt-4">
              <PaginationContent>
                {paginationGroup()}
              </PaginationContent>
            </Pagination>
          </>
        )}
      </CardContent>
    </Card>
  );
}

"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { formatInTimeZone } from 'date-fns-tz';
import { ko, enUS, ja, zhCN, Locale } from 'date-fns/locale';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Moon, Star, Heart, Sun, List as ListIcon, Pencil, Award, Gem, Camera, Smartphone, Mail, Menu,
  Eye, MessageSquare, Share2, Bookmark, ChevronLeft, MoreVertical, Send, RefreshCw
} from "lucide-react"
import { TopBannerAd, BottomBannerAd } from "@/components/kakao-ads"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useDiary, DiaryEntry } from "@/hooks/use-diary";
import { UserMenu } from '@/components/user-menu'
import { LoginDialog } from '@/components/login-dialog'
import { SignupDialog } from '@/components/signup-dialog'
import { CustomAlertDialog } from "@/components/custom-alert-dialog";
import { MusicPlayer } from "@/components/music-player";
import { WriteView } from "@/components/write-view";
import { MobileMenuSheet } from "@/components/mobile-menu-sheet";
import { ListView } from "@/components/list-view";
import { CommunityView } from "@/components/community-view";
import { SupportView } from "@/components/support-view";
import { HallView } from "@/components/hall-view";
import { ContactView } from "@/components/contact-view";

export default function Component({ boardId }: { boardId?: string }) {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ isOpen: boolean; title: string; description: string; }>({ isOpen: false, title: "", description: "" });
  const [currentView, setCurrentView] = useState<"write" | "list" | "support" | "hall" | "contact" | "community">("write")

  const [showAppPromo, setShowAppPromo] = useState(true);
  useEffect(() => {
    if (window.isApp || localStorage.getItem('isApp') === 'true') {
      setShowAppPromo(false);
    }
  }, []);
  const dismissAppPromo = () => setShowAppPromo(false);

  const { t, i18n } = useTranslation();
  const { isLoggedIn, isLoading, user, logout } = useAuth();
  const {
    diaryEntries,
    selectedEntry,
    setSelectedEntry,
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchDiaries,
    handleDelete,
    handleShare,
    handleViewDetails,
  } = useDiary(setAlertInfo, t);

  useEffect(() => { setIsClient(true) }, [])

  useEffect(() => {
    if (boardId) {
      setCurrentView("community");
    }
  }, [boardId]);

  useEffect(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    if (savedMode !== null) setIsDarkMode(JSON.parse(savedMode));
  }, [])

  useEffect(() => { localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode)) }, [isDarkMode])

  useEffect(() => {
    const scriptId = "kakao-adfit-script";
    const loadAdfit = () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
    const timer = setTimeout(loadAdfit, 100);
    return () => { clearTimeout(timer) };
  }, [currentView, pathname]);

  const moodEnumToEmojiMap: { [key: string]: string } = {
    "JOY": "😊", "SAD": "😢", "ANGER": "😡", "TIRED": "😴",
    "LOVE": "🥰", "WORRY": "🤔", "ETC": "🫥",
  };

  const formatEntryDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const locales: { [key: string]: Locale } = { ko, en: enUS, ja, zh: zhCN };
    const currentLocale = locales[i18n.language] || ko;
    let formatString = 'yyyy년 M월 d일';
    if (i18n.language === 'en') formatString = 'MMM d, yyyy';
    else if (['ja', 'zh'].includes(i18n.language)) formatString = 'yyyy年M月d日';
    return formatInTimeZone(date, 'Asia/Seoul', formatString, { locale: currentLocale });
  };

  const renderContent = () => {
    switch (currentView) {
      case "write":
        return <WriteView isDarkMode={isDarkMode} setAlertInfo={setAlertInfo} fetchDiaries={fetchDiaries} setZoomedImage={setZoomedImage} />;
      case "list":
        return <ListView isDarkMode={isDarkMode} diaryEntries={diaryEntries} currentItems={currentItems} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} handleViewDetails={handleViewDetails} handleShare={handleShare} handleDelete={handleDelete} formatEntryDate={formatEntryDate} moodEnumToEmojiMap={moodEnumToEmojiMap} />;
      case "community":
        return <CommunityView isDarkMode={isDarkMode} setAlertInfo={setAlertInfo} initialPostId={boardId} />;
      case "support":
        return <SupportView isDarkMode={isDarkMode} />;
      case "hall":
        return <HallView isDarkMode={isDarkMode} setCurrentView={setCurrentView} />;
      case "contact":
        return <ContactView isDarkMode={isDarkMode} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`min-h-screen transition-all duration-500 p-2 sm:p-4 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black" : "bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100"}`}>
        <div className="fixed inset-0 overflow-hidden pointer-events-none">{/* Background decorations */}</div>

        <div className="max-w-4xl mx-auto relative z-10">
          <header className={`sticky top-0 z-20 w-full transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 border-b border-slate-700/50 shadow-lg shadow-slate-900/20 backdrop-blur-sm" : "bg-rose-100 border-b border-rose-200 shadow-lg shadow-rose-200/10"}`}>
            <div className="max-w-4xl mx-auto px-2 sm:px-4">
              <div className="flex items-center justify-end h-16 gap-4">
                <nav className="hidden md:flex items-center gap-2">
                  <Button onClick={() => setCurrentView(currentView === "write" ? "list" : "write")} variant={currentView === 'write' || currentView === 'list' ? 'secondary' : 'ghost'} className={`px-4 py-2 rounded-lg ${currentView === 'write' || currentView === 'list' ? (isDarkMode ? 'bg-purple-600/30 text-white' : 'bg-rose-200 text-gray-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-800')}`}>{currentView === "write" ? t("diary_list") : t("write_diary")}</Button>
                  <Button onClick={() => setCurrentView("community")} variant={currentView === 'community' ? 'secondary' : 'ghost'} className={`px-4 py-2 rounded-lg ${currentView === 'community' ? (isDarkMode ? 'bg-blue-600/30 text-white' : 'bg-blue-200 text-gray-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-800')}`}>{t("community")}</Button>
                  <Button onClick={() => setCurrentView("support")} variant={currentView === 'support' ? 'secondary' : 'ghost'} className={`px-4 py-2 rounded-lg ${currentView === 'support' ? (isDarkMode ? 'bg-pink-600/30 text-white' : 'bg-pink-200 text-gray-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-800')}`}>{t("support_developer")}</Button>
                  <Button onClick={() => setCurrentView("hall")} variant={currentView === 'hall' ? 'secondary' : 'ghost'} className={`px-4 py-2 rounded-lg ${currentView === 'hall' ? (isDarkMode ? 'bg-yellow-600/30 text-white' : 'bg-yellow-200 text-gray-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-800')}`}>{t("hall_of_fame")}</Button>
                  <Button onClick={() => setCurrentView("contact")} variant={currentView === 'contact' ? 'secondary' : 'ghost'} className={`px-4 py-2 rounded-lg ${currentView === 'contact' ? (isDarkMode ? 'bg-green-600/30 text-white' : 'bg-green-200 text-gray-800') : (isDarkMode ? 'text-gray-300' : 'text-gray-800')}`}>{t("contact_developer")}</Button>
                </nav>
                <div className="flex items-center gap-2">
                                    {isClient && (
                    <Select onValueChange={(value) => i18n.changeLanguage(value)} value={i18n.language}>
                      <SelectTrigger className={`w-auto transition-all duration-300 border-0 px-2 ${isDarkMode ? "bg-transparent hover:bg-slate-700 text-gray-300" : "bg-transparent hover:bg-gray-100 text-gray-800"}`}>
                        <SelectValue>
                          {i18n.language.toUpperCase()}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-rose-200 text-gray-900"}`}>
                        <SelectItem value="ko">한국어 (KO)</SelectItem>
                        <SelectItem value="en">English (EN)</SelectItem>
                        <SelectItem value="ja">日本語 (JA)</SelectItem>
                        <SelectItem value="zh">中文 (ZH)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Button onClick={() => setIsDarkMode(!isDarkMode)} variant="ghost" aria-label={t(isDarkMode ? "switch_to_light_mode" : "switch_to_dark_mode")} >{isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}</Button>
                  <div className="flex items-center">
                    {isLoading ? <div className="w-20 h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" /> : isLoggedIn && user ? <UserMenu isDarkMode={isDarkMode} t={t} onLogout={logout} userName={user.name} userEmail={user.email} avatarUrl={user.profileImageUrl} /> : <div className="flex items-center gap-2"><Button variant="ghost" onClick={() => setShowLoginDialog(true)}>{t("login")}</Button><Button variant="ghost" onClick={() => setShowSignupDialog(true)}>{t("signup")}</Button></div>}
                  </div>
                  {/* 모바일 메뉴 버튼 */}
                  <MobileMenuSheet
                    isSheetOpen={isSheetOpen}
                    setIsSheetOpen={setIsSheetOpen}
                    isDarkMode={isDarkMode}
                    setCurrentView={setCurrentView}
                    isLoggedIn={isLoggedIn}
                    isLoading={isLoading}
                    user={user}
                    logout={logout}
                    setShowLoginDialog={setShowLoginDialog}
                    setShowSignupDialog={setShowSignupDialog}
                    currentView={currentView}
                  />
                </div>
              </div>
            </div>
          </header>

          <div className="text-center my-4 sm:my-8">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${isDarkMode ? "bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent" : "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent"}`}>{t("app_title")}</h2>
            <p className={`text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>{t("app_description")}</p>
          </div>

          <MusicPlayer isDarkMode={isDarkMode} />

          <div className={`text-center mb-4 sm:mb-6 ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}><p className="text-xs mb-2 opacity-70">{t("ad")}</p><TopBannerAd /></div>

          {renderContent()}

          <div className={`text-center mt-8 mb-6 ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}><p className="text-xs mb-2 opacity-70">{t("also_good_to_see")}</p><BottomBannerAd /></div>

          <footer className={`text-center mt-8 py-8 border-t ${isDarkMode ? "border-slate-800 text-gray-500" : "border-rose-100 text-rose-500"}`}>{/* ... */}</footer>
        </div>

        {selectedEntry && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><Card className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto ${isDarkMode ? "bg-slate-800" : "bg-white"}`}><CardHeader className="relative p-4 sm:p-6"><Button onClick={() => setSelectedEntry(null)} variant="ghost" size="sm" className={`absolute top-2 right-2 ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}>✕</Button><div className="text-center mb-4"><h3 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{selectedEntry.title}</h3></div><div className="flex justify-end items-center mb-4"><p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{formatEntryDate(selectedEntry.createDate)} {selectedEntry.mood && <span className="ml-2 text-xl">{moodEnumToEmojiMap[selectedEntry.mood]}</span>}</p></div></CardHeader><CardContent>{selectedEntry.imageUrl && (<div className="mb-4 cursor-pointer" onClick={() => setZoomedImage(selectedEntry.imageUrl || null)}><img src={selectedEntry.imageUrl} alt="Diary" className="w-full h-auto max-h-96 object-contain rounded-xl border-2 border-dashed border-gray-400/50" /></div>)}<p className={`text-base leading-relaxed whitespace-pre-wrap ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{selectedEntry.content}</p><div className={`text-right text-xs sm:text-sm mt-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{selectedEntry.content.length}{t("characters")}</div></CardContent></Card></div>}
      </div>

      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} isDarkMode={isDarkMode} />
      <SignupDialog isOpen={showSignupDialog} onClose={() => setShowSignupDialog(false)} isDarkMode={isDarkMode} />
      <CustomAlertDialog isOpen={alertInfo.isOpen} onClose={() => setAlertInfo(prev => ({...prev, isOpen: false}))} title={alertInfo.title} description={alertInfo.description} isDarkMode={isDarkMode} />

      {showAppPromo && <div className={`fixed z-50 ${isMobile ? "left-3 right-3 bottom-3" : "right-6 bottom-6 w-[360px]"}`}>{/* ... App Promo Banner ... */}</div>}
      {zoomedImage && <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4" onClick={() => setZoomedImage(null)}>{/* ... Zoomed Image Modal ... */}</div>}
    </>
  );
}
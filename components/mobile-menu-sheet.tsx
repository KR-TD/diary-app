'use client'

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { UserResponse } from '@/contexts/auth-context'; // Using UserResponse from custom auth context

interface MobileMenuSheetProps {
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setCurrentView: (view: "write" | "list" | "support" | "hall" | "contact" | "community") => void;
  isLoggedIn: boolean;
  isLoading: boolean;
  user: UserResponse | null | undefined;
  logout: () => void;
  setShowLoginDialog: (show: boolean) => void;
  setShowSignupDialog: (show: boolean) => void;
  currentView: "write" | "list" | "support" | "hall" | "contact" | "community";
}

export function MobileMenuSheet({
  isSheetOpen,
  setIsSheetOpen,
  isDarkMode,
  setCurrentView,
  isLoggedIn,
  isLoading,
  user,
  logout,
  setShowLoginDialog,
  setShowSignupDialog,
  currentView,
}: MobileMenuSheetProps) {
  const { t } = useTranslation();

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className={isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"} aria-describedby={undefined}>
          <SheetHeader>
            <SheetTitle className={isDarkMode ? '' : 'text-gray-800'}>{t("menu")}</SheetTitle>
          </SheetHeader>
          
          {isLoggedIn && user && (
              <div className="px-4 py-2 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
                  <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl || '/placeholder-user.jpg'} alt={user.name || 'User'} />
                      <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs truncate text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
              </div>
          )}

          <div className="grid gap-4 py-4">
            <Button onClick={() => {setCurrentView(currentView === "write" ? "list" : "write"); closeSheet();}} variant="ghost" className={`justify-start ${isDarkMode ? '' : 'text-gray-800'}`}>{currentView === "write" ? t("diary_list") : t("write_diary")}</Button>
            <Button onClick={() => {setCurrentView("community"); closeSheet();}} variant="ghost" className={`justify-start ${isDarkMode ? '' : 'text-gray-800'}`}>{t("community")}</Button>
            <Button onClick={() => {setCurrentView("support"); closeSheet();}} variant="ghost" className={`justify-start ${isDarkMode ? '' : 'text-gray-800'}`}>{t("support_developer")}</Button>
            <Button onClick={() => {setCurrentView("hall"); closeSheet();}} variant="ghost" className={`justify-start ${isDarkMode ? '' : 'text-gray-800'}`}>{t("hall_of_fame")}</Button>
            <Button onClick={() => {setCurrentView("contact"); closeSheet();}} variant="ghost" className={`justify-start ${isDarkMode ? '' : 'text-gray-800'}`}>{t("contact_developer")}</Button>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

            {isLoading ? (
              <div className="w-full h-8 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : isLoggedIn ? (
              <Button onClick={() => {logout(); closeSheet();}} variant="ghost" className={`justify-start text-red-500 dark:text-red-400`}>{t("logout")}</Button>
            ) : (
              <>
                <Button onClick={() => {setShowLoginDialog(true); closeSheet();}} variant="ghost" className={`justify-start ${isDarkMode ? '' : 'text-gray-800'}`}>{t("login")}</Button>
                <Button onClick={() => {setShowSignupDialog(true); closeSheet();}} variant="ghost" className={`justify-start ${isDarkMode ? '' : 'text-gray-800'}`}>{t("signup")}</Button>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

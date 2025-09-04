"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon, LogIn, UserPlus, Sun, Moon } from "lucide-react";

interface UserMenuProps {
  isDarkMode: boolean;
  t: (key: string) => string;
  onLoginClick: () => void;
  onSignupClick: () => void;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onThemeToggle?: () => void;
}

export function UserMenu({
  isDarkMode,
  t,
  onLoginClick,
  onSignupClick,
  userName,
  userEmail,
  avatarUrl,
  onThemeToggle,
}: UserMenuProps) {
  const surface = isDarkMode ? "bg-slate-900" : "bg-white";
  const text = isDarkMode ? "text-slate-100" : "text-slate-800";
  const subtleText = isDarkMode ? "text-slate-400" : "text-slate-500";

  // 라이트 모드 테두리(아주 옅게)
  const border = isDarkMode ? "border-slate-800" : "border-gray-100";

  const ghostBtn = isDarkMode
    ? "text-slate-300 hover:bg-slate-800/60"
    : "text-rose-600 hover:bg-rose-100/50";

  // 항목 하이라이트/호버를 부드럽게 재정의
  const itemBase =
    "px-4 py-2.5 cursor-pointer data-[highlighted]:bg-gray-50 dark:data-[highlighted]:bg-slate-800/60";

  // 구분선: shadcn 기본값이 border가 아니라 배경 1px 라인 → bg-* 로 지정
  const separatorClass = isDarkMode ? "bg-slate-800/60 h-px" : "bg-gray-200 h-px";

  return (
    // 포커스 트랩이 거슬리면 modal={false}를 사용하세요.
    <DropdownMenu /* modal={false} */>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("user_menu")}
          className={`rounded-full ${ghostBtn} transition-colors`}
        >
          <Avatar className="h-9 w-9 ring-1 ring-black/5 dark:ring-white/10">
            <AvatarImage
              src={avatarUrl ?? "/user.png"}
              alt="User Avatar"
            />
            <AvatarFallback>
              <UserIcon className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        // ✅ onOpenAutoFocus 제거
        // 닫힐 때 트리거로 포커스가 돌아가는 것을 막고 싶다면 아래 사용
        onCloseAutoFocus={(e) => e.preventDefault()}
        align="end"
        className={`w-64 ${surface} ${text} border ${border} shadow-xl rounded-xl p-0`}
      >
        {(userName || userEmail) && (
          <>
            <div className="px-4 py-3 flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-1 ring-black/5 dark:ring-white/10">
                <AvatarImage
                  src={avatarUrl ?? "/user.png"}
                  alt="User Avatar"
                />
                <AvatarFallback>
                  <UserIcon className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                {userName && (
                  <p className="text-sm font-medium truncate">{userName}</p>
                )}
                {userEmail && (
                  <p className={`text-xs truncate ${subtleText}`}>{userEmail}</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator className={separatorClass} />
          </>
        )}

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onLoginClick} className={itemBase}>
            <LogIn className="w-4 h-4 mr-2 opacity-80" />
            {t("login")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSignupClick} className={itemBase}>
            <UserPlus className="w-4 h-4 mr-2 opacity-80" />
            {t("signup")}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className={separatorClass} />

        <DropdownMenuItem
          onClick={() => console.log("Google Login clicked")}
          className={itemBase}
        >
          <img src="/icons/google.png" alt="Google" className="w-5 h-5 mr-2" />
          {t("google_login")}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => console.log("Kakao Login clicked")}
          className={itemBase}
        >
          <img src="/icons/kakao.png" alt="Kakao" className="w-5 h-5 mr-2" />
          {t("kakao_login")}
        </DropdownMenuItem>

        <DropdownMenuSeparator className={separatorClass} />

        <DropdownMenuGroup>
          {onThemeToggle && (
            <DropdownMenuItem onClick={onThemeToggle} className={itemBase}>
              {isDarkMode ? (
                <Sun className="w-4 h-4 mr-2 opacity-80" />
              ) : (
                <Moon className="w-4 h-4 mr-2 opacity-80" />
              )}
              {isDarkMode ? t("switch_to_light") : t("switch_to_dark")}
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

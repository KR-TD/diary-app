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
import { User as UserIcon, LogOut, Settings, Sun, Moon } from "lucide-react";

interface UserMenuProps {
  isDarkMode: boolean;
  t: (key: string) => string;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onThemeToggle?: () => void;
}

export function UserMenu({
  isDarkMode,
  t,
  onLogout,
  userName = "곰겜", // Placeholder
  userEmail = "beargame@example.com", // Placeholder
  avatarUrl,
  onThemeToggle,
}: UserMenuProps) {
  const surface = isDarkMode ? "bg-slate-900" : "bg-white";
  const text = isDarkMode ? "text-slate-100" : "text-slate-800";
  const subtleText = isDarkMode ? "text-slate-400" : "text-slate-500";
  const border = isDarkMode ? "border-slate-800" : "border-gray-100";
  const itemBase =
    "px-4 py-2.5 cursor-pointer data-[highlighted]:bg-gray-50 dark:data-[highlighted]:bg-slate-800/60";
  const separatorClass = isDarkMode ? "bg-slate-800/60 h-px" : "bg-gray-200 h-px";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("user_menu")}
          className="rounded-full transition-colors"
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
        onCloseAutoFocus={(e) => e.preventDefault()}
        align="end"
        className={`w-64 ${surface} ${text} border ${border} shadow-xl rounded-xl p-0`}
      >
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
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className={`text-xs truncate ${subtleText}`}>{userEmail}</p>
          </div>
        </div>
        <DropdownMenuSeparator className={separatorClass} />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => {}} className={itemBase}>
            <UserIcon className="w-4 h-4 mr-2 opacity-80" />
            {t("profile")}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} className={itemBase}>
            <Settings className="w-4 h-4 mr-2 opacity-80" />
            {t("settings")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className={separatorClass} />
        <DropdownMenuItem onClick={onLogout} className={`${itemBase} text-red-500 dark:text-red-400 data-[highlighted]:text-red-500 dark:data-[highlighted]:text-red-400`}>
          <LogOut className="w-4 h-4 mr-2 opacity-80" />
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

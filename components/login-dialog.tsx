import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  isDarkMode: boolean
}

export function LoginDialog({
  isOpen,
  onClose,
  isDarkMode,
}: LoginDialogProps) {
  const { t } = useTranslation()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleSubmit = () => {
    console.log("Login attempt:", { email, password })
    // 실제 로그인 API 호출 위치
    onClose()
  }

  const surface = isDarkMode
    ? "bg-slate-900 text-gray-100 border border-slate-700"
    : "bg-white text-gray-900 border border-gray-200"

  const inputStyle = isDarkMode
    ? "bg-slate-800 text-gray-100 border-slate-600 focus:ring-2 focus:ring-blue-500"
    : "bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-400"

  const buttonStyle = isDarkMode
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[420px] rounded-2xl shadow-xl px-6 py-6 ${surface}`}
      >
        <DialogHeader className="text-center space-y-1">
          <DialogTitle className="text-2xl font-bold">
            {t("login")}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-70">
            {t("login_description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-5">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={("example@gmail.com")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={("password123!")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
            />
          </div>

          <Button
            type="submit"
            onClick={handleSubmit}
            className={`w-full h-11 rounded-lg font-semibold transition-colors ${buttonStyle}`}
          >
            {t("login")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

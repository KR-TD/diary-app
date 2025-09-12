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
import { useAuth } from "@/contexts/auth-context"

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
  const { login } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [apiError, setApiError] = React.useState<string | null>(null)

  const tx = React.useCallback(
    (key: string, defaultValue?: string) => {
      const v = t(key)
      return v === key ? defaultValue || key : v
    },
    [t]
  )

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setSubmitting(true)
    setApiError(null)

    try {
      const response = await fetch("https://code.haru2end.dedyn.io/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        login(data.atk, data.rtk)
        alert("로그인에 성공했습니다!")
        onClose()
      } else {
        const errorData = await response.json()
        setApiError(errorData.message || "이메일 또는 비밀번호를 확인해주세요.")
      }
    } catch (error) {
      setApiError("로그인 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.")
    } finally {
      setSubmitting(false)
    }
  }

  const surface = isDarkMode
    ? "bg-slate-900/80 text-gray-100 border border-slate-700 backdrop-blur-xl"
    : "bg-white/80 text-gray-900 border border-gray-200 backdrop-blur-xl"

  const inputStyle = isDarkMode
    ? "bg-slate-800 text-gray-100 border-slate-600 focus:ring-2 focus:ring-blue-500"
    : "bg-gray-50 text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-400"

  const buttonStyle = isDarkMode
    ? "bg-blue-600 hover:bg-blue-500 text-white"
    : "bg-blue-500 hover:bg-blue-600 text-white"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[420px] rounded-2xl shadow-xl p-0 overflow-hidden ${surface} z-[100]`}
      >
        <DialogHeader className="text-center space-y-1 px-6 pt-8 pb-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {tx("login", "로그인")}
          </DialogTitle>
          <DialogDescription className="text-sm opacity-70">
            {tx("login_description", "계정에 로그인하여 계속하세요.")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
          <div className="flex flex-col space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {tx("email", "이메일")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={tx("email_placeholder", "example@gmail.com")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {tx("password", "비밀번호")}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
              required
            />
          </div>

          {apiError && (
            <p className="text-sm text-center text-rose-500 pt-2">{apiError}</p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className={`w-full h-11 rounded-lg font-semibold transition-all ${buttonStyle}`}
          >
            {submitting ? tx("logging_in", "로그인 중...") : tx("login", "로그인")}
          </Button>
        </form>
        
        <div className="px-6 pb-6 space-y-4">
            {/* 구분선 */}
            <div className="relative text-center">
              <div className={`h-px ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`} />
              <span className={`px-3 text-xs absolute -translate-x-1/2 left-1/2 -top-2 ${isDarkMode ? "bg-slate-900/70 text-slate-300" : "bg-white/70 text-slate-500"}`}>
                {tx("or", "또는")}
              </span>
            </div>

            {/* 소셜 */}
            <div className="grid gap-2">
              <button
                type="button"
                className={`w-full h-11 rounded-xl border flex items-center justify-center gap-2 transition hover:shadow-sm ${isDarkMode ? "bg-white text-gray-900 border-white/60" : "bg-white text-gray-900 border-slate-300"}`}
                onClick={() => console.log("Google login")}
              >
                <span className="text-sm font-medium">{tx("continue_with_google", "Google로 계속하기")}</span>
              </button>
              <button
                type="button"
                className="w-full h-11 rounded-xl border border-[#E9D502] bg-[#FEE500] text-black flex items-center justify-center gap-2 hover:brightness-95 transition"
                onClick={() => console.log("Kakao login")}
              >
                <span className="text-sm font-medium">{tx("continue_with_kakao", "카카오로 계속하기")}</span>
              </button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
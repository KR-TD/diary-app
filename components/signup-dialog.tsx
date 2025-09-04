import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff, Moon, Sparkles, X } from "lucide-react"

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export function SignupDialog({ isOpen, onClose, isDarkMode }: SignupDialogProps) {
  const { t } = useTranslation();

  // 번역 키 누락 대응
  const tx = React.useCallback(
    (key: string, defaultValue: string) => {
      const v = t(key);
      return v === key ? defaultValue : v;
    },
    [t]
  );

  // 폼 상태
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");

  // 프로필 이미지
  const [profileFile, setProfileFile] = React.useState<File | null>(null);
  const [profilePreview, setProfilePreview] = React.useState<string | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  const [showPw, setShowPw] = React.useState(false);
  const [showPw2, setShowPw2] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // 유효성
  const emailValid = React.useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwValid = React.useMemo(() => {
    if (password.length < 8) return false;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
  }, [password]);
  const matchValid = confirmPassword.length > 0 && password === confirmPassword;
  const nicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 20;

  const formValid = emailValid && pwValid && matchValid && nicknameValid;

  // 프로필 이미지 핸들러
  const handlePickImage = () => imageInputRef.current?.click();
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfilePreview(String(reader.result));
    reader.readAsDataURL(file);
  };
  const clearImage = () => {
    setProfileFile(null);
    setProfilePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formValid || submitting) return;

    try {
      setSubmitting(true);
      // 실제 회원가입 API 호출 위치
      // 예: onSignup({ email, password, nickname, profileFile })
      console.log("Signup attempt:", { email, password, confirmPassword, nickname, hasProfile: !!profileFile });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  // 스타일 토큰
  const surfaceBase = isDarkMode
    ? "bg-slate-900/70 text-gray-100 border-white/10"
    : "bg-white/70 text-gray-800 border-slate-200/70";

  const gradient = isDarkMode
    ? "from-[#0b1020] via-[#101a3a] to-[#0b1020]"
    : "from-[#eef4ff] via-[#f6f9ff] to-[#eef4ff]";

  const inputStyle = isDarkMode
    ? "bg-slate-800/70 text-gray-100 border-slate-600 focus-visible:ring-emerald-400"
    : "bg-slate-50 text-gray-800 border-slate-200 focus-visible:ring-emerald-500";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={[
          "sm:max-w-[480px] p-0 overflow-hidden border backdrop-blur-xl",
          "shadow-2xl rounded-2xl",
          surfaceBase
        ].join(" ")}
      >
        {/* 헤더 */}
        <div className={`relative px-6 pt-6 pb-4 bg-gradient-to-b ${gradient}`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-30 blur-3xl bg-emerald-400/30" />
            <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-25 blur-3xl bg-indigo-400/30" />
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-300">
              <Moon className="w-5 h-5" />
              <Sparkles className="w-4 h-4" />
            </div>
            <DialogTitle className="text-xl font-semibold tracking-tight mt-1">
              {tx("signup", "회원가입")}
            </DialogTitle>
            <DialogDescription className={isDarkMode ? "text-slate-300" : "text-slate-600"}>
              {tx("signup_description", "새 계정을 생성하여 일기를 시작하세요.")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="relative z-10 px-6 pb-6 pt-4">
          <div className="grid gap-5">
            {/* 프로필 + 닉네임 */}
            <div className="grid grid-cols-4 items-start gap-3">
              <Label className="text-right mt-2">{tx("profile", "프로필")}</Label>
              <div className="col-span-3">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/20 shrink-0">
                    {profilePreview ? (
                      <img src={profilePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`} />
                    )}
                    {profilePreview && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-black/60 text-white"
                        aria-label={tx("remove_image", "이미지 삭제")}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={handlePickImage} className="h-9">
                        {tx("upload_profile", "프로필 이미지 업로드")}
                      </Button>
                      {profilePreview && (
                        <Button type="button" variant="outline" onClick={clearImage} className="h-9">
                          {tx("reset", "초기화")}
                        </Button>
                      )}
                    </div>
                    <p className={isDarkMode ? "text-xs text-slate-400" : "text-xs text-slate-500"}>
                      {tx("profile_help", "정사각형 이미지를 권장합니다. 최대 5MB.")}
                    </p>
                  </div>
                </div>

                {/* 닉네임 */}
                <div className="mt-4">
                  <Label htmlFor="nickname" className="sr-only">{tx("nickname", "닉네임")}</Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className={inputStyle}
                    placeholder={tx("nickname_placeholder", "표시할 닉네임을 입력하세요.")}
                    aria-invalid={nickname.length > 0 && !nicknameValid}
                  />
                  <p className={`mt-1 text-xs ${nickname.length > 0 && !nicknameValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`}>
                    {nickname.length === 0
                      ? tx("nickname_hint", "2~20자 사이로 입력하세요.")
                      : (!nicknameValid ? tx("nickname_invalid", "닉네임 길이를 확인해 주세요.") : " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* 이메일 */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="email" className="text-right">{tx("email", "이메일")}</Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className={inputStyle}
                  aria-invalid={email.length > 0 && !emailValid}
                  aria-describedby="email-help"
                />
                <p id="email-help" className={`mt-1 text-xs ${email.length > 0 && !emailValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {email.length === 0
                    ? tx("email_hint", "로그인에 사용할 이메일을 입력하세요.")
                    : (!emailValid ? tx("email_invalid", "올바른 이메일 형식이 아닙니다.") : " ")}
                </p>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="password" className="text-right">{tx("password", "비밀번호")}</Label>
              <div className="col-span-3 relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className={["pr-10", inputStyle].join(" ")}
                  aria-invalid={password.length > 0 && !pwValid}
                  aria-describedby="pw-help"
                />
                <button
                  type="button"
                  aria-label={showPw ? tx("hide_password", "비밀번호 숨기기") : tx("show_password", "비밀번호 보기")}
                  onClick={() => setShowPw(v => !v)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-200/70"
                    }`}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <p id="pw-help" className={`mt-1 text-xs ${password.length > 0 && !pwValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {password.length === 0
                    ? tx("password_hint", "8자 이상, 영문과 숫자를 포함해 주세요.")
                    : (!pwValid ? tx("password_invalid", "보안 기준을 충족하지 않습니다.") : " ")}
                </p>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="confirmPassword" className="text-right">{tx("confirm_password", "비밀번호 확인")}</Label>
              <div className="col-span-3 relative">
                <Input
                  id="confirmPassword"
                  type={showPw2 ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className={["pr-10", inputStyle].join(" ")}
                  aria-invalid={confirmPassword.length > 0 && !matchValid}
                  aria-describedby="cpw-help"
                />
                <button
                  type="button"
                  aria-label={showPw ? tx("hide_password", "비밀번호 숨기기") : tx("show_password", "비밀번호 보기")}
                  onClick={() => setShowPw(v => !v)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 -mt-1 p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-200/70"
                    }`}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <p id="cpw-help" className={`mt-1 text-xs ${confirmPassword.length > 0 && !matchValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {confirmPassword.length === 0
                    ? tx("confirm_password_hint", "위에 입력한 비밀번호를 한 번 더 입력하세요.")
                    : (!matchValid ? tx("confirm_password_not_match", "비밀번호가 일치하지 않습니다.") : " ")}
                </p>
              </div>
            </div>
          </div>

          {/* 액션 */}
          <div className="mt-5 space-y-3">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!formValid || submitting}
              className={[
                "w-full h-11 font-medium rounded-xl transition",
                "shadow-md hover:shadow-lg",
                isDarkMode
                  ? "bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700/40"
                  : "bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300/60"
              ].join(" ")}
            >
              {submitting ? tx("processing", "처리 중...") : tx("signup", "회원가입")}
            </Button>

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
                className={[
                  "w-full h-11 rounded-xl border flex items-center justify-center gap-2",
                  "transition hover:shadow-sm",
                  isDarkMode ? "bg-white text-gray-900 border-white/60" : "bg-white text-gray-900 border-slate-300"
                ].join(" ")}
                onClick={() => console.log("Google signup")}
              >
                <span className="text-sm font-medium">{tx("continue_with_google", "Google로 계속하기")}</span>
              </button>
              <button
                type="button"
                className="w-full h-11 rounded-xl border border-[#E9D502] bg-[#FEE500] text-black flex items-center justify-center gap-2 hover:brightness-95 transition"
                onClick={() => console.log("Kakao signup")}
              >
                <span className="text-sm font-medium">{tx("continue_with_kakao", "카카오로 계속하기")}</span>
              </button>
            </div>
          </div>

          {/* 접근성 상태 */}
          <div className="sr-only" aria-live="polite">
            {!emailValid && email.length > 0 ? "이메일 형식 오류" : ""}
            {!pwValid && password.length > 0 ? "비밀번호 보안 기준 미충족" : ""}
            {!matchValid && confirmPassword.length > 0 ? "비밀번호 불일치" : ""}
            {!nicknameValid && nickname.length > 0 ? "닉네임 길이 오류" : ""}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

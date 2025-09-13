"use client";

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

  const tx = React.useCallback(
    (key: string, defaultValue?: string) => {
      const v = t(key);
      return v === key ? defaultValue || key : v;
    },
    [t]
  );

  // Form states
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [nickname, setNickname] = React.useState("");
  const [apiError, setApiError] = React.useState<string | null>(null);

  // Email verification states
  const [isCodeSent, setIsCodeSent] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [userCode, setUserCode] = React.useState("");
  const [verificationError, setVerificationError] = React.useState<string | null>(null);

  // Profile image states
  const [profileFile, setProfileFile] = React.useState<File | null>(null);
  const [profilePreview, setProfilePreview] = React.useState<string | null>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);

  // UI states
  const [showPw, setShowPw] = React.useState(false);
  const [showPw2, setShowPw2] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Validation memos
  const emailValid = React.useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwValid = React.useMemo(() => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\W).{8,16}$/;
    return passwordRegex.test(password);
  }, [password]);
  const matchValid = confirmPassword.length > 0 && password === confirmPassword;
  const nicknameValid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  const formValid = emailValid && pwValid && matchValid && nicknameValid && isVerified;

  // Image handlers
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

  const API_BASE_URL = "https://code.haru2end.dedyn.io/api";

  const handleSendCode = async () => {
    if (!emailValid) return;
    setIsVerifying(true);
    setApiError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user/send/code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.status === 201) {
        setIsCodeSent(true);
      } else {
        const errorData = await response.json();
        setApiError(errorData.message || tx("send_code_failed", "인증코드 전송에 실패했습니다."));
      }
    } catch (error) {
      setApiError(tx("network_error", "네트워크 오류가 발생했습니다."));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyCode = async () => {
    setApiError(null);
    setVerificationError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/user/code/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: userCode }),
      });

      if (response.ok) {
        const isSuccess = await response.json();
        if (isSuccess) {
            setIsVerified(true);
        } else {
            // This case might not be reachable if backend sends 401 for failure
            setVerificationError(tx("verify_code_failed", "인증코드가 일치하지 않습니다."));
            setIsVerified(false);
        }
      } else {
        const errorData = await response.json();
        setVerificationError(errorData.message || tx("verify_code_failed", "인증코드가 일치하지 않습니다."));
        setIsVerified(false);
      }
    } catch (error) {
      setApiError(tx("verify_error", "인증 확인 중 오류가 발생했습니다."));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formValid || submitting) return;

    setSubmitting(true);
    setApiError(null);

    try {
      let imageUrl = null;
      // 1. Upload image if selected
      if (profileFile) {
        const formData = new FormData();
        formData.append("images", profileFile);

        const imageResponse = await fetch(`${API_BASE_URL}/image/sign/user`, {
          method: 'POST',
          body: formData,
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          imageUrl = imageData.url;
        } else {
          // Handle image upload failure
          const errorData = await imageResponse.json();
          setApiError(errorData.message || tx("image_upload_failed", "이미지 업로드에 실패했습니다."));
          setSubmitting(false);
          return;
        }
      }

      // 2. Submit signup form with image URL
      const signupRequest = {
        nickName: nickname,
        email: email,
        password: password,
        passwordValid: confirmPassword,
        imageUrl: imageUrl, 
      };

      const signupResponse = await fetch(`${API_BASE_URL}/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupRequest),
      });

      if (signupResponse.status === 201) {
        alert(tx("signup_success", "회원가입에 성공했습니다!"));
        onClose();
      } else {
        const errorData = await signupResponse.json();
        setApiError(errorData.message || tx("signup_failed", "회원가입에 실패했습니다."));
      }
    } catch (error) {
      setApiError(tx("network_error", "네트워크 오류가 발생했습니다."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    try {
      const nextUrl = window.location.origin + '/auth/callback';
      const response = await fetch(`https://code.haru2end.dedyn.io/api/user/${provider}?next=${encodeURIComponent(nextUrl)}`);
      if (response.ok) {
        const redirectUrl = await response.text();
        window.location.href = redirectUrl;
      } else {
        setApiError(`소셜 로그인에 실패했습니다. (${provider})`);
      }
    } catch (error) {
      setApiError("소셜 로그인 중 오류가 발생했습니다.");
    }
  }

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
      <DialogContent className={`sm:max-w-[480px] p-0 overflow-hidden border backdrop-blur-xl shadow-2xl rounded-2xl z-[100] ${surfaceBase}`}>
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

        <form onSubmit={handleSubmit} className="relative z-10 px-6 pb-6 pt-4">
          <div className="grid gap-5">
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
                      <button type="button" onClick={clearImage} className="absolute -top-2 -right-2 p-1 rounded-full bg-black/60 text-white" aria-label={tx("remove_image", "이미지 삭제")}>
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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
                    <p className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      {tx("profile_help", "정사각형 이미지를 권장합니다. 최대 5MB.")}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="nickname" className="sr-only">{tx("nickname", "닉네임")}</Label>
                  <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} className={inputStyle} placeholder={tx("nickname_placeholder", "표시할 닉네임을 입력하세요.")} aria-invalid={nickname.length > 0 && !nicknameValid} />
                  <p className={`mt-1 text-xs ${nickname.length > 0 && !nicknameValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                    {nickname.length === 0 ? tx("nickname_hint", "2~12자 사이로 입력하세요.") : (!nicknameValid ? tx("nickname_invalid", "닉네임 길이를 확인해 주세요.") : " ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-3">
              <Label htmlFor="email" className="text-right mt-2">{tx("email", "이메일")}</Label>
              <div className="col-span-3">
                <div className="flex gap-2">
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputStyle} aria-invalid={email.length > 0 && !emailValid} aria-describedby="email-help" disabled={isVerified} />
                  <Button type="button" variant="secondary" className="h-9 shrink-0" disabled={!emailValid || isCodeSent || isVerifying} onClick={handleSendCode}>
                    {isVerifying ? tx("sending_code", "전송 중...") : tx("send_code", "인증코드 전송")}
                  </Button>
                </div>
                <p id="email-help" className={`mt-1 text-xs ${email.length > 0 && !emailValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {isCodeSent ? (isVerified ? " " : tx("verification_code_sent_message", "인증코드가 전송되었습니다.")) : (email.length === 0 ? tx("email_hint", "로그인에 사용할 이메일을 입력하세요.") : (!emailValid ? tx("email_invalid", "올바른 이메일 형식이 아닙니다.") : " "))}
                </p>
                {isCodeSent && !isVerified && (
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input id="verificationCode" value={userCode} onChange={(e) => setUserCode(e.target.value)} className={inputStyle} placeholder={tx("verification_code_placeholder", "인증코드를 입력하세요.")} />
                      <Button type="button" variant="secondary" className="h-9 shrink-0" onClick={handleVerifyCode}>
                        {tx("verify", "인증하기")}
                      </Button>
                    </div>
                    {verificationError && <p className="mt-1 text-xs text-rose-500">{verificationError}</p>}
                  </div>
                )}
                {isVerified && (
                  <p className="mt-2 text-sm text-emerald-500">{tx("email_verified", "이메일이 성공적으로 인증되었습니다.")}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="password" className="text-right">{tx("password", "비밀번호")}</Label>
              <div className="col-span-3 relative">
                <Input id="password" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className={`pr-10 ${inputStyle}`} aria-invalid={password.length > 0 && !pwValid} aria-describedby="pw-help" />
                <button type="button" aria-label={showPw ? tx("hide_password", "비밀번호 숨기기") : tx("show_password", "비밀번호 보기")} onClick={() => setShowPw(v => !v)} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-200/70"}`}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <p id="pw-help" className={`mt-1 text-xs ${password.length > 0 && !pwValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {password.length === 0 ? tx("password_hint", "8~16자, 영문/특수문자를 포함해 주세요.") : (!pwValid ? tx("password_invalid", "보안 기준을 충족하지 않습니다.") : " ")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="confirmPassword" className="text-right">{tx("confirm_password", "비밀번호 확인")}</Label>
              <div className="col-span-3 relative">
                <Input id="confirmPassword" type={showPw2 ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" className={`pr-10 ${inputStyle}`} aria-invalid={confirmPassword.length > 0 && !matchValid} aria-describedby="cpw-help" />
                <button type="button" aria-label={showPw2 ? tx("hide_password", "비밀번호 숨기기") : tx("show_password", "비밀번호 보기")} onClick={() => setShowPw2(v => !v)} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md ${isDarkMode ? "hover:bg-slate-700/60" : "hover:bg-slate-200/70"}`}>
                  {showPw2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <p id="cpw-help" className={`mt-1 text-xs ${confirmPassword.length > 0 && !matchValid ? "text-rose-500" : isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                  {confirmPassword.length === 0 ? tx("confirm_password_hint", "위에 입력한 비밀번호를 한 번 더 입력하세요.") : (!matchValid ? tx("confirm_password_not_match", "비밀번호가 일치하지 않습니다.") : " ")}
                </p>
              </div>
            </div>
          </div>

          {apiError && (
            <p className="text-sm text-center text-rose-500 mt-4">
              {apiError}
            </p>
          )}

          <div className="mt-5 space-y-3">
            <Button type="submit" disabled={!formValid || submitting} className={`w-full h-11 font-medium rounded-xl transition shadow-md hover:shadow-lg ${isDarkMode ? "bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700/40" : "bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300/60"}`}>
              {submitting ? tx("processing", "처리 중...") : tx("signup", "회원가입")}
            </Button>

            {/* OR Separator */}
            <div className="relative text-center">
              <div className={`h-px ${isDarkMode ? "bg-white/10" : "bg-slate-200"}`} />
              <span className={`px-3 text-xs absolute -translate-x-1/2 left-1/2 -top-2 ${isDarkMode ? "bg-slate-900/70 text-slate-300" : "bg-white/70 text-slate-500"}`}>
                {tx("or", "또는")}
              </span>
            </div>

            {/* Social Logins */}
            <div className="grid gap-2">
              <button
                type="button"
                className={`w-full h-11 rounded-xl border flex items-center justify-center gap-2 transition hover:shadow-sm ${isDarkMode ? "bg-white text-gray-900 border-white/60" : "bg-white text-gray-900 border-slate-300"}`}
                onClick={() => handleSocialLogin('google')}
              >
                <img src="/icons/google.png" alt="Google" className="w-5 h-5" />
                <span className="text-sm font-medium">{tx("continue_with_google", "Google로 계속하기")}</span>
              </button>
              <button
                type="button"
                className="w-full h-11 rounded-xl border border-[#E9D502] bg-[#FEE500] text-black flex items-center justify-center gap-2 hover:brightness-95 transition"
                onClick={() => handleSocialLogin('kakao')}
              >
                <img src="/icons/kakao.png" alt="Kakao" className="w-5 h-5" />
                <span className="text-sm font-medium">{tx("continue_with_kakao", "카카오로 계속하기")}</span>
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

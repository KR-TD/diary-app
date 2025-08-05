"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Moon, Star, Heart, Save, Sun, Play, Pause, Volume2, Music, List, Pencil, Award, Gem } from "lucide-react"
import { TopBannerAd, BottomBannerAd, SquareAd } from "@/components/kakao-ads"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function Component() {
  const [diaryContent, setDiaryContent] = useState("")
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  
  const [isSaved, setIsSaved] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [audioError, setAudioError] = useState(false)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [audioSupported, setAudioSupported] = useState(true)

  const musicTracks = [
    {
      name: "빗소리와 함께",
      description: "자연의 소리와 멜로디",
      url: "/music/rain-sounds.mp3",
      icon: "🌧️",
    },
  ]

  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [currentView, setCurrentView] = useState<"write" | "list" | "support" | "hall">("write")
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)

  useEffect(() => {
    const scriptId = "kakao-adfit-script";

    const loadAdfit = () => {
      // Clean up previous ads and scripts
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      // Create and append the new script
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // Use a timeout to ensure all <ins> tags are rendered before the script runs
    const timer = setTimeout(loadAdfit, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [currentView, pathname]);

  interface DiaryEntry {
    id: string
    date: string
    content: string
    createdAt: Date
    mood?: string
  }

  // Centralized error handler
  const handleAudioError = (e: Event | string) => {
    console.error("Audio error:", e)
    setAudioError(true)
    setIsPlaying(false)
    setIsAudioLoading(false)
  }

  // Setup audio element on mount
  useEffect(() => {
    // Check for audio support
    const testAudio = new Audio()
    if (typeof testAudio.canPlayType !== "function" || !testAudio.canPlayType("audio/mpeg")) {
      setAudioSupported(false)
      return
    }

    // Create and configure the audio element
    const audio = new Audio()
    audio.loop = true
    audio.preload = "auto"
    audioRef.current = audio

    // Event listeners
    audio.addEventListener("error", handleAudioError)
    audio.addEventListener("play", () => setIsPlaying(true))
    audio.addEventListener("pause", () => setIsPlaying(false))
    audio.addEventListener("loadstart", () => setIsAudioLoading(true))
    audio.addEventListener("canplaythrough", () => setIsAudioLoading(false))
    audio.addEventListener("ended", () => setIsPlaying(false)) // For non-looping tracks in future

    // Cleanup on unmount
    return () => {
      audio.pause()
      audio.removeEventListener("error", handleAudioError)
      audio.removeEventListener("play", () => setIsPlaying(true))
      audio.removeEventListener("pause", () => setIsPlaying(false))
      audio.removeEventListener("loadstart", () => setIsAudioLoading(true))
      audio.removeEventListener("canplaythrough", () => setIsAudioLoading(false))
      audio.removeEventListener("ended", () => setIsPlaying(false))
      audioRef.current = null
    }
  }, [])

  // Update volume when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !audioSupported) return

    if (isPlaying) {
      audio.pause()
    } else {
      // If src is not set, it's the first play. Set it.
      if (!audio.src) {
        audio.src = musicTracks[currentTrack].url
        audio.load()
      }
      audio.play().catch(handleAudioError)
    }
  }

  const changeTrack = (trackIndex: number) => {
    if (!audioSupported || !audioRef.current) return

    // Update track index and reset error
    setCurrentTrack(trackIndex)
    setAudioError(false)

    // Change src, load, and play
    const audio = audioRef.current
    audio.src = musicTracks[trackIndex].url
    audio.load()
    audio.play().catch(handleAudioError)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
  }

  const handleSave = () => {
    if (diaryContent.trim()) {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: getCurrentDate(),
        content: diaryContent,
        createdAt: new Date(),
      }

      setDiaryEntries((prev) => [newEntry, ...prev])
      localStorage.setItem("diaryEntries", JSON.stringify([newEntry, ...diaryEntries]))
      setDiaryContent("")
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  

  const getCurrentDate = () => {
    const today = new Date()
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
    return today.toLocaleDateString("ko-KR", options)
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 p-2 sm:p-4 ${
        theme === 'dark'
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
          : "bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100"
      }`}
    >
      {/* 배경 장식 요소들 - 밤하늘 느낌 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 별똥별 애니메이션 */}
        <div className="absolute inset-0">
          <div className="shooting-star shooting-star-1"></div>
          <div className="shooting-star shooting-star-2"></div>
          <div className="shooting-star shooting-star-3"></div>
        </div>

        {/* 기존 별들 */}
        <Star
          className={`absolute top-20 left-10 w-4 h-4 animate-pulse ${
            theme === 'dark' ? "text-yellow-300" : "text-rose-300"
          }`}
        />
        <Star
          className={`absolute top-40 right-20 w-3 h-3 animate-pulse delay-1000 ${
            theme === 'dark' ? "text-blue-300" : "text-orange-300"
          }`}
        />
        <Moon
          className={`absolute top-32 right-10 w-6 h-6 opacity-70 ${theme === 'dark' ? "text-yellow-200" : "text-amber-300"}`}
        />
        <Heart
          className={`absolute bottom-40 left-16 w-5 h-5 animate-pulse delay-2000 ${
            theme === 'dark' ? "text-pink-300" : "text-rose-400"
          }`}
        />
        <Star
          className={`absolute bottom-60 right-32 w-4 h-4 animate-pulse delay-500 ${
            theme === 'dark' ? "text-purple-300" : "text-pink-300"
          }`}
        />

        {/* 추가 별들 - 밤하늘 효과 */}
        <Star className="absolute top-60 left-1/4 w-2 h-2 animate-pulse text-rose-200 opacity-70" />
        <Star className="absolute top-80 right-1/3 w-2 h-2 animate-pulse delay-700 text-orange-200 opacity-60" />
        <Star className="absolute bottom-80 left-1/3 w-3 h-3 animate-pulse delay-1500 text-amber-200 opacity-80" />
        <Star className="absolute top-1/4 left-1/2 w-1 h-1 animate-pulse delay-300 text-pink-200 opacity-50" />
        <Star className="absolute top-3/4 right-1/4 w-2 h-2 animate-pulse delay-1200 text-rose-300 opacity-60" />
        <Star className="absolute top-1/3 left-20 w-1 h-1 animate-pulse delay-800 text-orange-200 opacity-40" />
        <Star className="absolute bottom-1/4 right-1/3 w-2 h-2 animate-pulse delay-2000 text-amber-200 opacity-70" />
        <Star className="absolute top-2/3 left-3/4 w-1 h-1 animate-pulse delay-400 text-pink-200 opacity-30" />
        <Star className="absolute bottom-1/3 left-1/4 w-3 h-3 animate-pulse delay-1800 text-rose-200 opacity-50" />
        <Star className="absolute top-1/2 right-20 w-1 h-1 animate-pulse delay-600 text-orange-200 opacity-40" />

        {/* 구름 효과 */}
        <div className="absolute top-1/4 left-0 w-32 h-16 bg-rose-200/20 rounded-full blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-0 w-40 h-20 bg-orange-200/15 rounded-full blur-2xl opacity-25 animate-pulse delay-2000"></div>
        <div className="absolute top-2/3 left-1/4 w-24 h-12 bg-amber-200/25 rounded-full blur-lg opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* 헤더 */}
        <div className="text-center mb-4 sm:mb-8 relative">
          <div className="flex justify-between items-center mb-4 sm:mb-8">
            <div className="flex gap-1 sm:gap-2">
              <Button
                onClick={() => setCurrentView(currentView === "write" ? "list" : "write")}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                    : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-600"
                }`}
                variant="ghost"
                size={isMobile ? "icon" : "default"}
              >
                {currentView === "write" ? <List className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                {!isMobile && (currentView === "write" ? " 일기 목록" : " 일기 쓰기")}
              </Button>

              <Button
                onClick={() => setCurrentView("support")}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentView === "support"
                    ? theme === 'dark'
                      ? "bg-pink-600/30 text-pink-300"
                      : "bg-pink-500/30 text-pink-600"
                    : theme === 'dark'
                      ? "bg-pink-600/20 hover:bg-pink-600/30 text-pink-300"
                      : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-600"
                }`}
                variant="ghost"
                size={isMobile ? "icon" : "default"}
              >
                <Gem className="w-5 h-5" />
                {!isMobile && " 후원하기"}
              </Button>

              <Button
                onClick={() => setCurrentView("hall")}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentView === "hall"
                    ? theme === 'dark'
                      ? "bg-yellow-600/30 text-yellow-300"
                      : "bg-yellow-500/30 text-yellow-600"
                    : theme === 'dark'
                      ? "bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300"
                      : "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600"
                }`}
                variant="ghost"
                size={isMobile ? "icon" : "default"}
              >
                <Award className="w-5 h-5" />
                {!isMobile && " 명예의 전당"}
              </Button>
            </div>

            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-3 rounded-full transition-all duration-300 ${
                theme === 'dark'
                  ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300"
                  : "bg-orange-500/20 hover:bg-orange-500/30 text-orange-600"
              }`}
              variant="ghost"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${
              theme === 'dark'
                ? "bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent"
            }`}
          >
            하루의 끝
          </h1>
          <p className={`text-base sm:text-lg font-medium ${theme === 'dark' ? "text-gray-300" : "text-rose-700"}`}>
            {theme === 'dark'
              ? "고요한 밤, 하루를 돌아보며 마음을 정리해보세요"
              : "오늘 하루를 마무리하며, 소중한 순간들을 기록해보세요"}
          </p>
        </div>

        {/* 음악 플레이어 */}
        <Card
          className={`backdrop-blur-sm border-0 shadow-lg mb-4 sm:mb-6 transition-all duration-500 ${
            theme === 'dark'
              ? "bg-slate-900/70 shadow-purple-500/20 border border-slate-700/50"
              : "bg-white/80 border border-rose-200/50 shadow-rose-200/20"
          }`}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <Music className={`w-5 h-5 ${theme === 'dark' ? "text-purple-400" : "text-rose-500"}`} />
                {!isMobile && (
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? "text-gray-200" : "text-rose-800"}`}>배경음악</h3>
                    <p className={`text-sm ${theme === 'dark' ? "text-gray-400" : "text-rose-600"}`}>
                      {musicTracks[currentTrack].name} - {musicTracks[currentTrack].description}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {/* 트랙 선택 */}
                <div className="flex gap-1">
                  {musicTracks.map((track, index) => (
                    <Button
                      key={index}
                      onClick={() => changeTrack(index)}
                      disabled={!audioSupported}
                      className={`w-8 h-8 p-0 text-sm transition-all duration-200 ${
                        !audioSupported
                          ? "opacity-50 cursor-not-allowed"
                          : currentTrack === index
                            ? theme === 'dark'
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-purple-500 hover:bg-purple-600"
                            : theme === 'dark'
                              ? "bg-slate-700 hover:bg-slate-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-600"
                      }`}
                      title={track.name}
                    >
                      {track.icon}
                    </Button>
                  ))}
                </div>

                {/* 볼륨 조절 */}
                <div className="hidden sm:flex items-center gap-2">
                  <Volume2 className={`w-4 h-4 ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                    className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* 재생/일시정지 버튼 */}
                <Button
                  onClick={togglePlay}
                  disabled={audioError || isAudioLoading || !audioSupported}
                  className={`w-10 h-10 rounded-full transition-all duration-300 ${
                    audioError || !audioSupported
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : isPlaying
                        ? theme === 'dark'
                          ? "bg-purple-600 hover:bg-purple-700 animate-pulse"
                          : "bg-purple-500 hover:bg-purple-600 animate-pulse"
                        : theme === 'dark'
                          ? "bg-slate-700 hover:bg-slate-600"
                          : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {isAudioLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause
                      className={`w-4 h-4 ${isPlaying ? "text-white" : theme === 'dark' ? "text-gray-300" : "text-gray-600"}`}
                    />
                  ) : (
                    <Play
                      className={`w-4 h-4 ${isPlaying ? "text-white" : theme === 'dark' ? "text-gray-300" : "text-gray-600"}`}
                    />
                  )}
                </Button>
              </div>
            </div>

            {/* 오디오 상태 표시 */}
            {!audioSupported ? (
              <div className="mt-3 text-center">
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? "text-yellow-400" : "text-yellow-600"}`}>
                  🎵 이 브라우저에서는 음악 기능을 지원하지 않습니다
                </p>
              </div>
            ) : audioError ? (
              <div className="mt-3 text-center">
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? "text-red-400" : "text-red-500"}`}>
                  🎵 음악을 불러올 수 없습니다. 음악 없이도 일기 작성을 계속하세요
                </p>
              </div>
            ) : isAudioLoading ? (
              <div className="mt-3 text-center">
                <p className={`text-xs sm:text-sm ${theme === 'dark' ? "text-blue-400" : "text-blue-500"}`}>🎵 음악을 불러오는 중...</p>
              </div>
            ) : isPlaying ? (
              <div className="mt-3 flex justify-center">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 bg-gradient-to-t rounded-full animate-pulse ${
                        theme === 'dark' ? "from-purple-400 to-blue-400" : "from-purple-500 to-pink-500"
                      }`}
                      style={{
                        height: `${Math.random() * 15 + 8}px`,
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: "1s",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* 자연스러운 광고 배치 - 음악 플레이어 다음 */}
        <div className={`text-center mb-4 sm:mb-6 ${theme === 'dark' ? "text-gray-400" : "text-rose-600"}`}>
          <p className="text-xs mb-2 opacity-70">✨ 광고 ✨</p>
          <TopBannerAd />
        </div>

        {currentView === "write" ? (
          <Card
            className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
              theme === 'dark'
                ? "bg-slate-900/80 shadow-purple-500/30 border border-slate-700/50"
                : "bg-white/90 border border-rose-200/50 shadow-rose-200/30"
            }`}
          >
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Moon className={`w-5 h-5 ${theme === 'dark' ? "text-yellow-400" : "text-amber-500"}`} />
                <span className={`text-lg sm:text-xl font-semibold ${theme === 'dark' ? "text-gray-200" : "text-rose-800"}`}>
                  {getCurrentDate()}
                </span>
                <Star className={`w-5 h-5 ${theme === 'dark' ? "text-blue-400" : "text-rose-500"}`} />
              </div>
              <p className={`italic text-sm sm:text-base ${theme === 'dark' ? "text-gray-400" : "text-rose-600"}`}>
                {theme === 'dark'
                  ? "\"밤이 깊어갈수록, 우리의 생각은 더욱 깊어집니다\""
                  : "\"매일 밤, 우리는 하루를 돌아보며 성장합니다\""}
              </p>
            </CardHeader>

            <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
              {/* 일기 작성 영역 */}
              <div className="space-y-3">
                <label className={`text-base sm:text-lg font-medium flex items-center gap-2 ${theme === 'dark' ? "text-gray-200" : "text-rose-800"}`}>
                  <Heart className={`w-5 h-5 ${theme === 'dark' ? "text-pink-400" : "text-rose-500"}`} />
                  오늘의 이야기
                </label>
                <Textarea
                  placeholder={
                    theme === 'dark'
                      ? "고요한 밤, 오늘 하루는 어떠셨나요?\n달빛 아래에서 마음속 깊은 이야기를 들려주세요.\n작은 감정들도 소중한 기억이 됩니다..."
                      : "오늘 하루는 어떠셨나요? \n기쁜 일, 힘들었던 일, 감사한 일들을 자유롭게 적어보세요.\n작은 순간들도 소중한 기억이 됩니다..."
                  }
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  className={`min-h-[250px] sm:min-h-[300px] text-base leading-relaxed resize-none border-2 rounded-xl p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 ${
                    theme === 'dark'
                      ? "border-purple-500/30 focus:border-purple-400 bg-slate-700/50 text-gray-200 placeholder:text-gray-400"
                      : "border-rose-200 focus:border-rose-400 bg-white/70 text-rose-900 placeholder:text-rose-500"
                  }`}
                />
              </div>

              {/* 글자 수 표시 */}
              <div className={`text-right text-xs sm:text-sm ${theme === 'dark' ? "text-gray-400" : "text-rose-600"}`}>
                {diaryContent.length}자
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-center pt-2 sm:pt-4">
                <Button
                  onClick={handleSave}
                  className={`px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isSaved
                      ? "bg-green-500 hover:bg-green-600"
                      : theme === 'dark'
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600"
                  }`}
                >
                  <Save className="w-5 h-5 mr-2" />
                  {isSaved ? "저장되었습니다!" : "오늘의 일기 저장하기"}
                </Button>
              </div>

              {/* 하단 메시지 */}
              <div className={`text-center pt-4 sm:pt-6 border-t ${theme === 'dark' ? "border-purple-500/30" : "border-rose-200"}`}>
                <p className={`text-xs sm:text-sm italic ${theme === 'dark' ? "text-gray-400" : "text-rose-600"}`}>
                  {theme === 'dark'
                    ? "별빛 아래에서 당신의 하루가 아름다운 꿈으로 이어지기를 🌙✨"
                    : "따뜻한 햇살처럼 당신의 소중한 하루가 아름다운 추억으로 남기를 바랍니다 🌅✨"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : currentView === "list" ? (
          <Card
            className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
              theme === 'dark' ? "bg-slate-800/80 shadow-purple-500/20" : "bg-white/80"
            }`}
          >
            <CardHeader className="text-center pb-4 sm:pb-6">
              <h2 className={`text-xl sm:text-2xl font-semibold ${theme === 'dark' ? "text-gray-200" : "text-gray-700"}`}>
                📖 나의 일기장
              </h2>
              <p className={`text-sm ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`}>
                총 {diaryEntries.length}개의 소중한 기억들
              </p>
            </CardHeader>

            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
              {diaryEntries.length === 0 ? (
                <div className="text-center py-12">
                  <p className={`text-base sm:text-lg ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`}>
                    아직 작성된 일기가 없습니다
                  </p>
                  <p className={`text-sm mt-2 ${theme === 'dark' ? "text-gray-500" : "text-gray-400"}`}>
                    첫 번째 일기를 작성해보세요! ✨
                  </p>
                </div>
              ) : (
                diaryEntries.map((entry, index) => (
                  <div key={entry.id}>
                    <div
                      className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                        theme === 'dark'
                          ? "border-purple-500/30 bg-slate-700/50 hover:bg-slate-700/70"
                          : "border-purple-100 bg-white/50 hover:bg-white/70"
                      }`}
                      onClick={() => setSelectedEntry(entry)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? "text-purple-300" : "text-purple-600"}`}>
                          {entry.date}
                        </span>
                        <span className={`text-xs ${theme === 'dark' ? "text-gray-400" : "text-gray-500"}`}>
                          {entry.content.length}자
                        </span>
                      </div>
                      <p className={`text-sm sm:text-base line-clamp-3 ${theme === 'dark' ? "text-gray-300" : "text-gray-600"}`}>
                        {entry.content}
                      </p>
                    </div>
                    {/* 일기 목록 중간에 자연스러운 광고 삽입 (5개마다) */}
                    {(index + 1) % 5 === 0 && index < diaryEntries.length - 1 && (
                      <div className="my-4 sm:my-6 text-center">
                        <p className={`text-xs mb-2 opacity-60 ${theme === 'dark' ? "text-gray-400" : "text-rose-500"}`}>
                          ✨ 추천 ✨
                        </p>
                        <SquareAd />
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ) : currentView === "support" ? (
          // 후원 페이지
          <Card
            className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
              theme === 'dark'
                ? "bg-slate-900/80 shadow-pink-500/30 border border-slate-700/50"
                : "bg-white/90 border border-pink-200/50 shadow-pink-200/30"
            }`}
          >
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className={`w-6 h-6 ${theme === 'dark' ? "text-pink-400" : "text-pink-500"}`} />
                <span className={`text-xl sm:text-2xl font-semibold ${theme === 'dark' ? "text-gray-200" : "text-rose-800"}`}>
                  개발자 후원하기
                </span>
                <Heart className={`w-6 h-6 ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
              </div>
              <p className={`text-base sm:text-lg ${theme === 'dark' ? "text-gray-300" : "text-rose-700"}`}>
                "하루의 끝"을 사랑해주셔서 감사합니다
              </p>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-6">
              {/* 후원 메시지 */}
              <div className="text-center space-y-4">
                <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? "bg-slate-800/50" : "bg-rose-50/80"}`}>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-3 ${theme === 'dark' ? "text-pink-300" : "text-rose-700"}`}>
                    💝 후원을 해주시면 개발자에게 큰 힘이 됩니다
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed ${theme === 'dark' ? "text-gray-300" : "text-rose-600"}`}>
                    여러분의 소중한 일기를 더 안전하고 아름답게 보관할 수 있도록
                    <br />
                    지속적으로 개발하고 개선해나가겠습니다.
                  </p>
                </div>
              </div>

              {/* 토스뱅크 정보 */}
              <div className="text-center space-y-4">
                <div
                  className={`p-6 sm:p-8 rounded-xl border-2 border-dashed ${
                    isDarkMode ? "border-pink-400/50 bg-pink-900/20" : "border-pink-300/50 bg-pink-100/50"
                  }`}
                >
                  <div className="mb-4">
                    <img src="/placeholder.svg?height=60&width=60" alt="토스뱅크" className="mx-auto mb-3 rounded-lg" />
                    <h4 className={`text-base sm:text-lg font-semibold ${isDarkMode ? "text-pink-300" : "text-pink-700"}`}>
                      토스뱅크
                    </h4>
                  </div>

                  <div
                    className={`text-2xl sm:text-3xl font-bold mb-4 font-mono tracking-wider ${
                      isDarkMode ? "text-pink-200" : "text-pink-800"
                    }`}
                  >
                    1000-8490-8014
                  </div>

                  <Button
                    onClick={() => navigator.clipboard.writeText("1000-8490-8014")}
                    className={`px-5 sm:px-6 py-2 rounded-full transition-all duration-300 ${
                      isDarkMode
                        ? "bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30"
                        : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 border border-pink-300/50"
                    }`}
                    variant="outline"
                  >
                    📋 계좌번호 복사하기
                  </Button>
                </div>
              </div>

              {/* 감사 메시지 */}
              <div className="text-center space-y-4">
                <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? "bg-slate-800/30" : "bg-amber-50/50"}`}>
                  <p className={`text-xs sm:text-sm italic ${isDarkMode ? "text-gray-400" : "text-amber-700"}`}>
                    "작은 후원이라도 개발자에게는 큰 격려가 됩니다.
                    <br />
                    여러분의 마음이 더 나은 서비스를 만드는 원동력입니다."
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Heart className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse`} />
                    <Heart
                      className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse delay-100`}
                    />
                    <Heart
                      className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse delay-200`}
                    />
                  </div>
                </div>
              </div>

              {/* 개발자 정보 */}
              <div className="text-center">
                <div className={`inline-block p-4 rounded-full ${isDarkMode ? "bg-slate-800/50" : "bg-rose-100/50"}`}>
                  <div className={`text-3xl sm:text-4xl mb-2`}>👨‍💻</div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>
                    하루의 끝 개발팀
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : currentView === "hall" ? (
          // 명예의 전당 페이지
          <Card
            className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
              isDarkMode
                ? "bg-slate-900/80 shadow-yellow-500/30 border border-slate-700/50"
                : "bg-white/90 border border-yellow-200/50 shadow-yellow-200/30"
            }`}
          >
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="text-3xl sm:text-4xl animate-bounce">🏆</div>
                <span className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                  명예의 전당
                </span>
                <div className="text-3xl sm:text-4xl animate-bounce delay-100">🏆</div>
              </div>
              <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-yellow-700"}`}>
                "하루의 끝"을 후원해주신 소중한 분들
              </p>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-6">
              {/* 후원자 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
                  <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                    42
                  </div>
                  <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>총 후원자 수</div>
                </div>
                <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
                  <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                    ₩847,000
                  </div>
                  <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>총 후원 금액</div>
                </div>
                <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
                  <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                    156
                  </div>
                  <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>누적 일기 수</div>
                </div>
              </div>

              {/* VIP 후원자 (10만원 이상) */}
              <div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}
                >
                  💎 VIP 후원자 (10만원 이상)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { name: "김**님", amount: "150,000원", date: "2024.01.15", message: "좋은 서비스 감사합니다!" },
                    { name: "이**님", amount: "200,000원", date: "2024.01.20", message: "개발자님 화이팅!" },
                    { name: "박**님", amount: "100,000원", date: "2024.02.03", message: "매일 사용하고 있어요 ❤️" },
                  ].map((supporter, index) => (
                    <div
                      key={index}
                      className={`p-3 sm:p-4 rounded-xl border-2 ${
                        isDarkMode
                          ? "border-yellow-400/30 bg-gradient-to-r from-yellow-900/20 to-orange-900/20"
                          : "border-yellow-300/50 bg-gradient-to-r from-yellow-100/50 to-orange-100/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl">💎</div>
                        <div>
                          <div className={`font-semibold ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                            {supporter.name}
                          </div>
                          <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-600"}`}>
                            {supporter.amount} • {supporter.date}
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm italic ${isDarkMode ? "text-gray-300" : "text-yellow-600"}`}>
                        "{supporter.message}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 골드 후원자 (5만원 이상) */}
              <div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}
                >
                  🥇 골드 후원자 (5만원 이상)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                  {["최**님", "정**님", "강**님", "윤**님", "조**님", "장**님", "임**님", "한**님"].map(
                    (name, index) => (
                      <div
                        key={index}
                        className={`p-2 sm:p-3 rounded-lg text-center ${
                          isDarkMode
                            ? "bg-yellow-900/30 border border-yellow-600/30"
                            : "bg-yellow-100/70 border border-yellow-300/50"
                        }`}
                      >
                        <div className="text-xl mb-1">🥇</div>
                        <div className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                          {name}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* 실버 후원자 (1만원 이상) */}
              <div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}
                >
                  🥈 실버 후원자 (1만원 이상)
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    "김**님",
                    "이**님",
                    "박**님",
                    "최**님",
                    "정**님",
                    "강**님",
                    "윤**님",
                    "조**님",
                    "장**님",
                    "임**님",
                    "한**님",
                    "오**님",
                    "신**님",
                    "유**님",
                    "홍**님",
                    "송**님",
                    "안**님",
                    "황**님",
                  ].map((name, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded text-center ${isDarkMode ? "bg-gray-700/50" : "bg-gray-100/70"}`}
                    >
                      <div className="text-sm mb-1">🥈</div>
                      <div className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 브론즈 후원자 (1만원 미만) */}
              <div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}
                >
                  🥉 브론즈 후원자
                </h3>
                <div className={`p-3 sm:p-4 rounded-xl text-center ${isDarkMode ? "bg-slate-800/30" : "bg-orange-50/50"}`}>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "서**님",
                      "권**님",
                      "민**님",
                      "배**님",
                      "백**님",
                      "노**님",
                      "심**님",
                      "원**님",
                      "남**님",
                      "고**님",
                      "문**님",
                      "양**님",
                      "손**님",
                      "배**님",
                      "조**님",
                    ].map((name, index) => (
                      <span
                        key={index}
                        className={`inline-block px-2 py-1 rounded text-xs ${
                          isDarkMode ? "bg-orange-900/30 text-orange-300" : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        🥉 {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 감사 메시지 */}
              <div className="text-center space-y-4">
                <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
                  <h4 className={`text-base sm:text-lg font-semibold mb-3 ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>
                    💌 개발자의 감사 인사
                  </h4>
                  <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-yellow-600"}`}>
                    "하루의 끝"을 사랑해주시고 후원해주신 모든 분들께 진심으로 감사드립니다.
                    <br />
                    여러분의 소중한 마음 덕분에 더 나은 서비스를 만드는 원동력입니다.
                    <br />
                    앞으로도 여러분의 소중한 일상을 아름답게 기록할 수 있도록 최선을 다하겠습니다.
                  </p>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Heart
                        key={i}
                        className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse`}
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 후원하기 버튼 */}
              <div className="text-center">
                <Button
                  onClick={() => setCurrentView("support")}
                  className={`px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  }`}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  나도 후원하기
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // 후원 페이지
          <Card
            className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${
              isDarkMode
                ? "bg-slate-900/80 shadow-pink-500/30 border border-slate-700/50"
                : "bg-white/90 border border-pink-200/50 shadow-pink-200/30"
            }`}
          >
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Heart className={`w-6 h-6 ${theme === 'dark' ? "text-pink-400" : "text-pink-500"}`} />
                <span className={`text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>
                  개발자 후원하기
                </span>
                <Heart className={`w-6 h-6 ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
              </div>
              <p className={`text-lg ${theme === 'dark' ? "text-gray-300" : "text-rose-700"}`}>
                "하루의 끝"을 사랑해주셔서 감사합니다
              </p>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* 후원 메시지 */}
              <div className="text-center space-y-4">
                <div className={`p-6 rounded-xl ${theme === 'dark' ? "bg-slate-800/50" : "bg-rose-50/80"}`}>
                  <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? "text-pink-300" : "text-rose-700"}`}>
                    💝 후원을 해주시면 개발자에게 큰 힘이 됩니다
                  </h3>
                  <p className={`text-base leading-relaxed ${theme === 'dark' ? "text-gray-300" : "text-rose-600"}`}>
                    여러분의 소중한 일기를 더 안전하고 아름답게 보관할 수 있도록
                    <br />
                    지속적으로 개발하고 개선해나가겠습니다.
                  </p>
                </div>
              </div>

              {/* 토스뱅크 정보 */}
              <div className="text-center space-y-4">
                <div
                  className={`p-8 rounded-xl border-2 border-dashed ${
                    isDarkMode ? "border-pink-400/50 bg-pink-900/20" : "border-pink-300/50 bg-pink-100/50"
                  }`}
                >
                  <div className="mb-4">
                    <img src="/placeholder.svg?height=60&width=60" alt="토스뱅크" className="mx-auto mb-3 rounded-lg" />
                    <h4 className={`text-lg font-semibold ${isDarkMode ? "text-pink-300" : "text-pink-700"}`}>
                      토스뱅크
                    </h4>
                  </div>

                  <div
                    className={`text-3xl font-bold mb-4 font-mono tracking-wider ${
                      isDarkMode ? "text-pink-200" : "text-pink-800"
                    }`}
                  >
                    1000-8490-8014
                  </div>

                  <Button
                    onClick={() => navigator.clipboard.writeText("1000-8490-8014")}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      isDarkMode
                        ? "bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30"
                        : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 border border-pink-300/50"
                    }`}
                    variant="outline"
                  >
                    📋 계좌번호 복사하기
                  </Button>
                </div>
              </div>

              {/* 감사 메시지 */}
              <div className="text-center space-y-4">
                <div className={`p-6 rounded-xl ${isDarkMode ? "bg-slate-800/30" : "bg-amber-50/50"}`}>
                  <p className={`text-sm italic ${isDarkMode ? "text-gray-400" : "text-amber-700"}`}>
                    "작은 후원이라도 개발자에게는 큰 격려가 됩니다.
                    <br />
                    여러분의 마음이 더 나은 서비스를 만드는 원동력입니다."
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <Heart className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse`} />
                    <Heart
                      className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse delay-100`}
                    />
                    <Heart
                      className={`w-4 h-4 ${isDarkMode ? "text-pink-400" : "text-pink-500"} animate-pulse delay-200`}
                    />
                  </div>
                </div>
              </div>

              {/* 개발자 정보 */}
              <div className="text-center">
                <div className={`inline-block p-4 rounded-full ${isDarkMode ? "bg-slate-800/50" : "bg-rose-100/50"}`}>
                  <div className={`text-4xl mb-2`}>👨‍💻</div>
                  <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>
                    하루의 끝 개발팀
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 하단 자연스러운 광고 */}
        <div className={`text-center mt-8 mb-6 text-gray-400`}>
          <p className="text-xs mb-2 opacity-70">✨ 함께 보면 좋은 ✨</p>
          <BottomBannerAd />
        </div>

        {/* 푸터 */}
        <div className={`text-center mt-8 text-sm text-gray-500`}>
          <p>© 2024 하루의 끝. 모든 순간이 소중합니다.</p>
        </div>
      </div>
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
                    {selectedEntry.date}
                  </h3>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {selectedEntry.content.length}자
                  </p>
                </div>
                <Button
                  onClick={() => setSelectedEntry(null)}
                  variant="ghost"
                  size="sm"
                  className={isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p
                className={`text-base leading-relaxed whitespace-pre-wrap ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {selectedEntry.content}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
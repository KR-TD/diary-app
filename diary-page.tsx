"use client"

import React, { useState, useEffect, useRef, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { format, formatDistanceToNowStrict } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ko, enUS, ja, zhCN, Locale } from 'date-fns/locale';

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import {
  Moon, Star, Heart, Save, Sun, Play, Pause, Volume2, Music, List as ListIcon, Pencil, Award, Gem, Camera, Smartphone, Mail,
  // ▼ 커뮤니티 상세용 추가 아이콘
  Eye, MessageSquare, Share2, Bookmark, ChevronLeft, MoreVertical, Send
} from "lucide-react"
import { TopBannerAd, BottomBannerAd, SquareAd } from "@/components/kakao-ads"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from 'next/navigation'

export default function Component() {
  // ===== 기존 일기 상태 =====
  const [diaryTitle, setDiaryTitle] = useState("")
  const [diaryContent, setDiaryContent] = useState("")
  const [selectedMood, setSelectedMood] = useState<string | undefined>(undefined)
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const [isSaved, setIsSaved] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [zoomedImage, setZoomedImage] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  useEffect(() => { setIsClient(true) }, [])

  const [showAppPromo, setShowAppPromo] = useState(true);
  const dismissAppPromo = () => setShowAppPromo(false);
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { t, i18n, ready } = useTranslation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('isDarkMode');
      if (savedMode !== null) setIsDarkMode(JSON.parse(savedMode));
      const savedEntries = localStorage.getItem('diaryEntries');
      if (savedEntries) setDiaryEntries(JSON.parse(savedEntries));
    }
  }, [])
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  // ===== 음악 =====
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = diaryEntries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(diaryEntries.length / itemsPerPage);
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [audioSupported, setAudioSupported] = useState(true)
  const [audioError, setAudioError] = useState(false)

  const musicTracks = [
    { name: t("music_track_rain_name"), description: t("music_track_rain_description"), url: "/music/rain-sounds.mp3", icon: "🌧️" },
    { name: t("music_track_bird_name"), description: t("music_track_bird_description"), url: "/music/bird-sounds.mp3", icon: "🐦" },
    { name: t("music_track_fire_name"), description: t("music_track_fire_description"), url: "/music/fire-sounds.mp3", icon: "🔥" },
  ]

  // ======= 뷰 전환 (커뮤니티 추가) =======
  const [currentView, setCurrentView] = useState<"write" | "list" | "support" | "hall" | "contact" | "community">("write")

  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)

  const emotionMap: { [key: string]: string } = {
    "😊": t("emotion_joy"),
    "😢": t("emotion_sadness"),
    "😡": t("emotion_anger"),
    "😴": t("emotion_tiredness"),
    "🥰": t("emotion_love"),
    "🤔": t("emotion_worry"),
  }

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

  interface DiaryEntry {
    id: string
    date: string
    title: string
    content: string
    createdAt: Date
    mood?: string
    image?: string
  }

  const handleAudioError = (e: Event | string) => {
    console.error("Audio error:", e)
    setAudioError(true)
    setIsPlaying(false)
    setIsAudioLoading(false)
  }

  useEffect(() => {
    const testAudio = new Audio()
    if (typeof testAudio.canPlayType !== "function" || !testAudio.canPlayType("audio/mpeg")) {
      setAudioSupported(false)
      return
    }
    const audio = new Audio()
    audio.loop = true
    audio.preload = "auto"
    audioRef.current = audio
    audio.addEventListener("error", handleAudioError)
    audio.addEventListener("play", () => setIsPlaying(true))
    audio.addEventListener("pause", () => setIsPlaying(false))
    audio.addEventListener("loadstart", () => setIsAudioLoading(true))
    audio.addEventListener("canplaythrough", () => setIsAudioLoading(false))
    audio.addEventListener("ended", () => setIsPlaying(false))
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
  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume }, [volume])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio || !audioSupported) return
    if (isPlaying) audio.pause()
    else {
      if (!audio.src) {
        audio.src = musicTracks[currentTrack].url
        audio.load()
      }
      audio.play().catch(handleAudioError)
    }
  }
  const changeTrack = (trackIndex: number) => {
    if (!audioSupported || !audioRef.current) return
    setCurrentTrack(trackIndex)
    setAudioError(false)
    const audio = audioRef.current
    audio.src = musicTracks[trackIndex].url
    audio.load()
    audio.play().catch(handleAudioError)
  }
  const handleVolumeChange = (newVolume: number) => setVolume(newVolume)

  const handleSave = () => {
    if (diaryTitle.trim() && diaryContent.trim()) {
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: diaryTitle,
        content: diaryContent,
        createdAt: new Date(),
        mood: selectedMood,
        image: selectedImage,
      }
      setDiaryEntries((prev) => [newEntry, ...prev])
      localStorage.setItem("diaryEntries", JSON.stringify([newEntry, ...diaryEntries]))
      setDiaryTitle("")
      setDiaryContent("")
      setSelectedMood(undefined)
      setSelectedImage(undefined)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText("1000-8490-8014");
    setIsCopied(true); setTimeout(() => setIsCopied(false), 2000);
  };
  const handleDelete = (id: string) => {
    const updatedEntries = diaryEntries.filter(entry => entry.id !== id);
    setDiaryEntries(updatedEntries);
    localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries));
    if (selectedEntry && selectedEntry.id === id) setSelectedEntry(null);
  };

  const formatEntryDate = (dateString: string) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const locales: { [key: string]: Locale } = { ko, en: enUS, ja, zh: zhCN };
      const currentLocale = locales[i18n.language] || ko;
      let formatString = 'yyyy년 M월 d일';
      switch (i18n.language) {
        case 'en': formatString = 'MMM d, yyyy'; break;
        case 'ja':
        case 'zh': formatString = 'yyyy年M月d日'; break;
      }
      return format(date, formatString, { locale: currentLocale });
    }
    return dateString;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(undefined);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const locales: { [key: string]: Locale } = { ko, en: enUS, ja, zh: zhCN };
    const currentLocale = locales[i18n.language] || ko;
    let formatString = 'yyyy년 M월 d일 EEEE';
    let timeZone = 'Asia/Seoul';
    switch (i18n.language) {
      case 'en': formatString = 'EEEE, MMMM d, yyyy'; timeZone = 'America/New_York'; break;
      case 'ja': formatString = 'yyyy年M月d日 EEEE'; timeZone = 'Asia/Tokyo'; break;
      case 'zh': formatString = 'yyyy年M月d日 EEEE'; timeZone = 'Asia/Shanghai'; break;
      default: formatString = 'yyyy년 M월 d일 EEEE'; timeZone = 'Asia/Seoul';
    }
    return formatInTimeZone(today, timeZone, formatString, { locale: currentLocale });
  };

  // ======================= 커뮤니티 영역 추가 =======================
  type MoodKey = "joy" | "sad" | "anger" | "tired" | "love" | "worry"
  interface CommunityPost {
    id: string
    title: string
    content: string
    mood?: MoodKey
    thumb?: string
    avatar?: string
    author: string
    createdAt: string
    writeDate: string
    views: number
    likes: number
    commentsCount: number
  }
  interface ReplyItem { id: string; nick: string; text: string; liked: boolean; likeCount: number }
  interface CommentItem { id: string; nick: string; text: string; liked: boolean; likeCount: number; replies: ReplyItem[] }

  const MOOD_LABEL: Record<MoodKey, string> = {
    joy: "기쁨", sad: "슬픔", anger: "분노", tired: "피곤", love: "사랑", worry: "걱정",
  }

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: "p1", title: "커뮤니티 개발중에 있습니다!", content: "곧 일기를 공유할 수 있는 커뮤니티 출시 하겠습니다!", mood: "joy",
      thumb: "/test/logo.png", avatar: "/test/profile.png", author: "곰겜", createdAt: "2025-09-01T13:00:00", writeDate: "2025-09-01T13:00:00", views: 27, likes: 5, commentsCount: 2
    },
    {
      id: "p2", title: "개발 어려워용 엉엉", content: "커뮤니티 개발 너무 어려워요.. ㅠ,ㅠ", mood: "sad",
      avatar: "/test/profile.png", author: "곰겜", createdAt: "2025-09-01T11:30:00", writeDate: "2025-09-01T11:30:00", views: 9, likes: 1, commentsCount: 1
    },
    {
      id: "p3", title: "다들 잘자요", content: "8월 31일 일요일 저녁에 쓰며,,", mood: "love",
      thumb: "/test/v.JPG", avatar: "/test/profile.png", author: "곰겜", createdAt: "2025-08-31T23:50:00", writeDate: "2025-08-31T23:50:00", views: 18, likes: 3, commentsCount: 2
    },
    {
      id: "p4", title: "히히 개발 재밌당", content: "사실 즐겁지는 않은데 모르겠다ㅏㅏ.", mood: "joy",
      thumb: "/test/beer.JPG", avatar: "/test/profile.png", author: "곰겜", createdAt: "2025-09-01T09:05:00", writeDate: "2025-09-01T09:05:00", views: 11, likes: 2, commentsCount: 0
    },
    {
      id: "p5", title: "오류 해결하기 싫다", content: "아ㅏㅏ 오류좀 그만 나라.", mood: "anger",
      avatar: "/test/profile.png", author: "곰겜", createdAt: "2025-09-01T02:00:00", writeDate: "2025-09-01T02:00:00", views: 18, likes: 1, commentsCount: 3
    },
  ])
  const [openedPost, setOpenedPost] = useState<CommunityPost | null>(null)
  const [postLiked, setPostLiked] = useState<Record<string, boolean>>({})
  const [postBookmarked, setPostBookmarked] = useState<Record<string, boolean>>({})
  const [postComments, setPostComments] = useState<Record<string, CommentItem[]>>({
    p1: [
      { id: "c1", nick: "하루", text: "많이 기대 해주세요!", liked: false, likeCount: 2, replies: [{ id: "r1", nick: "bear_is_love", text: "저도요!", liked: false, likeCount: 1 }] },
      { id: "c2", nick: "노나", text: "빨리 만났으면 좋겠어요😆", liked: false, likeCount: 0, replies: [] },
    ],
    p2: [{ id: "c3", nick: "곰돌", text: "그래도 빨리 만들게요!", liked: false, likeCount: 1, replies: [] }],
    p3: [
      { id: "c4", nick: "하늘좋아", text: "저는 코딩 할게요..", liked: false, likeCount: 0, replies: [] },
      { id: "c5", nick: "봄봄", text: "아,, 졸리당", liked: false, likeCount: 0, replies: [{ id: "r2", nick: "곰캠", text: "고마워요 :)", liked: false, likeCount: 0 }] },
    ],
  })
  const [commentInput, setCommentInput] = useState("")
  const [replyInput, setReplyInput] = useState<Record<string, string>>({})
  const [commentTab, setCommentTab] = useState<"hot" | "new">("hot")
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({})
  type Cat = "latest" | "popular" | MoodKey
  const [cat, setCat] = useState<Cat>("latest")

  const filteredPosts = useMemo(() => {
    let arr = [...posts]
    if (cat === "popular") arr.sort((a, b) => b.views - a.views)
    else if (cat === "latest") arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    else arr = arr.filter(p => p.mood === cat)
    return arr
  }, [posts, cat])

  const togglePostLike = (postId: string) => {
    setPostLiked(prev => {
      const now = !prev[postId]
      setPosts(ps => ps.map(p => (p.id === postId ? { ...p, likes: p.likes + (now ? 1 : -1) } : p)))
      return { ...prev, [postId]: now }
    })
  }
  const togglePostBookmark = (postId: string) => setPostBookmarked(prev => ({ ...prev, [postId]: !prev[postId] }))
  const submitComment = (postId: string) => {
    if (!commentInput.trim()) return
    const c: CommentItem = { id: `c-${Date.now()}`, nick: "익명", text: commentInput.trim(), liked: false, likeCount: 0, replies: [] }
    setPostComments(prev => ({ ...prev, [postId]: [c, ...(prev[postId] || [])] }))
    setCommentInput("")
    setPosts(ps => ps.map(p => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)))
  }
  const toggleCommentLike = (postId: string, commentId: string) => {
    setPostComments(prev => {
      const next = (prev[postId] || []).map(c => c.id !== commentId ? c : { ...c, liked: !c.liked, likeCount: c.likeCount + (!c.liked ? 1 : -1) })
      return { ...prev, [postId]: next }
    })
  }
  const submitReply = (postId: string, commentId: string) => {
    const text = (replyInput[commentId] || "").trim()
    if (!text) return
    const r: ReplyItem = { id: `r-${Date.now()}`, nick: "익명", text, liked: false, likeCount: 0 }
    setPostComments(prev => {
      const next = (prev[postId] || []).map(c => c.id !== commentId ? c : { ...c, replies: [...c.replies, r] })
      return { ...prev, [postId]: next }
    })
    setReplyInput(prev => ({ ...prev, [commentId]: "" }))
  }
  const toggleReplyLike = (postId: string, commentId: string, replyId: string) => {
    setPostComments(prev => {
      const next = (prev[postId] || []).map(c => {
        if (c.id !== commentId) return c
        const replies = c.replies.map(r => r.id !== replyId ? r : { ...r, liked: !r.liked, likeCount: r.likeCount + (!r.liked ? 1 : -1) })
        return { ...c, replies }
      })
      return { ...prev, [postId]: next }
    })
  }

  // ======================= 렌더 =======================
  return (
    <>
      <div
        className={`min-h-screen transition-all duration-500 p-2 sm:p-4 ${isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-slate-900 to-black"
          : "bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100"
          }`}
      >
        {/* 배경 장식 */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0">
            <div className="shooting-star shooting-star-1"></div>
            <div className="shooting-star shooting-star-2"></div>
            <div className="shooting-star shooting-star-3"></div>
          </div>
          <Star className={`absolute top-20 left-10 w-4 h-4 animate-pulse ${isDarkMode ? "text-yellow-300" : "text-rose-300"}`} />
          <Star className={`absolute top-40 right-20 w-3 h-3 animate-pulse delay-1000 ${isDarkMode ? "text-blue-300" : "text-orange-300"}`} />
          <Moon className={`absolute top-32 right-10 w-6 h-6 opacity-70 ${isDarkMode ? "text-yellow-200" : "text-amber-300"}`} />
          <Heart className={`absolute bottom-40 left-16 w-5 h-5 animate-pulse delay-2000 ${isDarkMode ? "text-pink-300" : "text-rose-400"}`} />
          <Star className={`absolute bottom-60 right-32 w-4 h-4 animate-pulse delay-500 ${isDarkMode ? "text-purple-300" : "text-pink-300"}`} />
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
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${isDarkMode
                    ? "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300"
                    : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-600"
                    }`}
                  variant="ghost"
                  size={isMobile ? "icon" : "default"}
                >
                  {currentView === "write" ? <ListIcon className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
                  {!isMobile && (currentView === "write" ? t("diary_list") : t("write_diary"))}
                </Button>

                <Button
                  onClick={() => setCurrentView("community")}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${currentView === "community"
                    ? isDarkMode ? "bg-blue-600/30 text-blue-300" : "bg-blue-500/30 text-blue-600"
                    : isDarkMode ? "bg-blue-600/20 hover:bg-blue-600/30 text-blue-300" : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-600"
                    }`}
                  variant="ghost"
                  size={isMobile ? "icon" : "default"}
                >
                  <MessageSquare className="w-5 h-5" />
                  {!isMobile && t("community")}
                </Button>

                <Button
                  onClick={() => setCurrentView("support")}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${currentView === "support"
                    ? isDarkMode ? "bg-pink-600/30 text-pink-300" : "bg-pink-500/30 text-pink-600"
                    : isDarkMode ? "bg-pink-600/20 hover:bg-pink-600/30 text-pink-300" : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-600"
                    }`}
                  variant="ghost"
                  size={isMobile ? "icon" : "default"}
                >
                  <Gem className="w-5 h-5" />
                  {!isMobile && t("support_developer")}
                </Button>

                <Button
                  onClick={() => setCurrentView("hall")}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${currentView === "hall"
                    ? isDarkMode ? "bg-yellow-600/30 text-yellow-300" : "bg-yellow-500/30 text-yellow-600"
                    : isDarkMode ? "bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300" : "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600"
                    }`}
                  variant="ghost"
                  size={isMobile ? "icon" : "default"}
                >
                  <Award className="w-5 h-5" />
                  {!isMobile && t("hall_of_fame")}
                </Button>

                <Button
                  onClick={() => setCurrentView("contact")}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 ${currentView === "contact"
                    ? isDarkMode ? "bg-green-600/30 text-green-300" : "bg-green-500/30 text-green-600"
                    : isDarkMode ? "bg-green-600/20 hover:bg-green-600/30 text-green-300" : "bg-green-500/20 hover:bg-green-500/30 text-green-600"
                    }`}
                  variant="ghost"
                  size={isMobile ? "icon" : "default"}
                >
                  <Mail className="w-5 h-5" />
                  {!isMobile && t("contact_developer")}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {isClient && (
                  <Select onValueChange={(value) => i18n.changeLanguage(value)} value={i18n.language}>
                    <SelectTrigger className={`w-[120px] transition-all duration-300 ${isDarkMode ? "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30" : "bg-rose-500/20 hover:bg-rose-500/30 text-rose-600 border border-rose-300/50"}`}>
                      <SelectValue>
                        {i18n.language === 'ko' ? '한국어' : i18n.language === 'en' ? 'English' : i18n.language === 'ja' ? '日本語' : i18n.language === 'zh' ? '中文' : ''}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className={`${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-rose-200 text-gray-900"}`}>
                      <SelectItem value="ko">한국어</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                      <SelectItem value="zh">中文</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                <Button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-3 rounded-full transition-all duration-300 ${isDarkMode ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300" : "bg-orange-500/20 hover:bg-orange-500/30 text-orange-600"}`}
                  variant="ghost"
                  aria-label={isDarkMode ? t("switch_to_light_mode") : t("switch_to_dark_mode")}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-2 ${isDarkMode ? "bg-gradient-to-r from-yellow-300 via-blue-300 to-purple-300 bg-clip-text text-transparent" : "bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent"}`}>
              {t("app_title")}
            </h1>
            <p className={`text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>
              {t("app_description")}
            </p>

            <section className="sr-only">
              <h2>하루의 끝: 당신의 하루를 기록하는 감성 온라인 일기장</h2>
              <p>...</p>
            </section>
          </div>

          {/* 음악 플레이어 (그대로) */}
          <Card className={`backdrop-blur-sm border-0 shadow-lg mb-4 sm:mb-6 transition-all duration-500 ${isDarkMode ? "bg-slate-900/70 shadow-purple-500/20 border border-slate-700/50" : "bg-white/80 border border-rose-200/50 shadow-rose-200/20"}`}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Music className={`w-5 h-5 ${isDarkMode ? "text-purple-400" : "text-rose-500"}`} />
                  {!isMobile && (
                    <div>
                      <h2 className={`font-medium ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>{t("background_music")}</h2>
                      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>
                        {musicTracks[currentTrack].name} - {musicTracks[currentTrack].description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-1">
                    {musicTracks.map((track, index) => (
                      <Button key={index} onClick={() => changeTrack(index)} disabled={!audioSupported}
                        className={`w-8 h-8 p-0 text-sm transition-all duration-200 ${!audioSupported ? "opacity-50 cursor-not-allowed" :
                          currentTrack === index ? (isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600") :
                            (isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-600")}`}
                        title={track.name}>
                        {track.icon}
                      </Button>
                    ))}
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <Volume2 className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                    <input type="range" min="0" max="1" step="0.1" value={volume}
                      onChange={(e) => handleVolumeChange(Number.parseFloat(e.target.value))}
                      className="w-16 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <Button onClick={togglePlay} disabled={audioError || isAudioLoading || !audioSupported}
                    className={`w-10 h-10 rounded-full transition-all duration-300 ${audioError || !audioSupported ? "bg-gray-400 cursor-not-allowed opacity-50" :
                      isPlaying ? (isDarkMode ? "bg-purple-600 hover:bg-purple-700 animate-pulse" : "bg-purple-500 hover:bg-purple-600 animate-pulse") :
                        (isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-200 hover:bg-gray-300")}`}
                    aria-label={isPlaying ? t("pause_music") : t("play_music")}>
                    {isAudioLoading ? (<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />) :
                      isPlaying ? (<Pause className={`w-4 h-4 ${isPlaying ? "text-white" : isDarkMode ? "text-gray-300" : "text-gray-600"}`} />) :
                        (<Play className={`w-4 h-4 ${isPlaying ? "text-white" : isDarkMode ? "text-gray-300" : "text-gray-600"}`} />)}
                  </Button>
                </div>
              </div>
              {!audioSupported ? (<div className="mt-3 text-center"><p className={`text-xs sm:text-sm ${isDarkMode ? "text-yellow-400" : "text-yellow-600"}`}>{t("audio_not_supported")}</p></div>) :
                audioError ? (<div className="mt-3 text-center"><p className={`text-xs sm:text-sm ${isDarkMode ? "text-red-400" : "text-red-500"}`}>{t("audio_error")}</p></div>) :
                  isAudioLoading ? (<div className="mt-3 text-center"><p className={`text-xs sm:text-sm ${isDarkMode ? "text-blue-400" : "text-blue-500"}`}>{t("loading_audio")}</p></div>) :
                    isPlaying ? (<div className="mt-3 flex justify-center"><div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (<div key={i} className={`w-1 bg-gradient-to-t rounded-full animate-pulse ${isDarkMode ? "from-purple-400 to-blue-400" : "from-purple-500 to-pink-500"}`} style={{ height: `${Math.random() * 15 + 8}px`, animationDelay: `${i * 0.1}s`, animationDuration: "1s" }} />))}
                    </div></div>) : null}
            </CardContent>
          </Card>

          {/* 광고 */}
          <div className={`text-center mb-4 sm:mb-6 ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>
            <p className="text-xs mb-2 opacity-70">{t("ad")}</p>
            <TopBannerAd />
          </div>

          {/* ====== 뷰 스위치 ====== */}
          {currentView === "write" ? (
            /* --- 글쓰기 뷰 (원본 유지) --- */
            <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-purple-500/30 border border-slate-700/50" : "bg-white/90 border border-rose-200/50 shadow-rose-200/30"}`}>
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Moon className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-amber-500"}`} />
                  <span className={`text-lg sm:text-xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>{getCurrentDate()}</span>
                  <Star className={`w-5 h-5 ${isDarkMode ? "text-blue-400" : "text-rose-500"}`} />
                </div>
                <p className={`italic text-sm sm:text-base ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>
                  {isDarkMode ? t("footer_message_dark") : t("footer_message_light")}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                {/* 감정/사진 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className={`text-base sm:text-lg font-medium flex items-center gap-2 ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>
                      <Heart className={`w-5 h-5 ${isDarkMode ? "text-pink-400" : "text-rose-500"}`} />
                      {t("today_mood")}
                      {selectedMood && (<span className={`ml-2 text-sm font-normal ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>({emotionMap[selectedMood]})</span>)}
                    </label>
                    <div className="flex flex-col items-end">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={imageInputRef} />
                      <Button onClick={() => imageInputRef.current?.click()} variant="outline" size="sm"
                        className={`px-3 py-1 rounded-full text-xs ${selectedImage ?
                          (isDarkMode ? "border-green-500/30 text-green-300 hover:bg-green-900/20" : "border-green-200 bg-green-100 text-green-700 hover:bg-green-200") :
                          (isDarkMode ? "border-purple-500/30 text-purple-300 hover:bg-purple-900/20" : "border-rose-200 bg-rose-100 text-rose-700 hover:bg-rose-200")}`}>
                        <Camera className="w-3 h-3 mr-1" />
                        {selectedImage ? t("change_photo") : t("add_photo")}
                      </Button>
                      {selectedImage && (
                        <div className="relative mt-2">
                          <img src={selectedImage} alt="Selected" className="w-16 h-16 object-cover rounded-md border border-gray-400/50 cursor-pointer"
                            onClick={() => setZoomedImage(selectedImage)} />
                          <button onClick={() => setSelectedImage(undefined)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">✕</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["😊", "😢", "😡", "😴", "🥰", "🤔"].map((emoji) => (
                      <Button key={emoji} onClick={() => setSelectedMood(emoji)}
                        className={`text-2xl p-2 rounded-full transition-all duration-200 ${selectedMood === emoji ?
                          (isDarkMode ? "bg-purple-600/50 border border-purple-400" : "bg-rose-300/50 border border-rose-400") :
                          (isDarkMode ? "bg-slate-700/50 hover:bg-slate-600/50" : "bg-gray-100/50 hover:bg-gray-200/50")}`} variant="ghost">
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`text-base sm:text-lg font-medium flex items-center gap-2 ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>
                    <Heart className={`w-5 h-5 ${isDarkMode ? "text-pink-400" : "text-rose-500"}`} />
                    {t("today_story")}
                  </label>
                  <Input placeholder={t("diary_title_placeholder")} value={diaryTitle} onChange={(e) => setDiaryTitle(e.target.value)}
                    className={`mb-4 text-base leading-relaxed resize-none border-2 rounded-xl p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 ${isDarkMode ? "border-purple-500/30 focus:border-purple-400 bg-slate-700/50 text-gray-200 placeholder:text-gray-400" : "border-rose-200 focus:border-rose-400 bg-white/70 text-rose-900 placeholder:text-rose-500"}`} />
                  <Textarea placeholder={isDarkMode ? t("diary_content_placeholder_dark") : t("diary_content_placeholder_light")}
                    value={diaryContent} onChange={(e) => setDiaryContent(e.target.value)}
                    className={`min-h-[250px] sm:min-h-[300px] text-base leading-relaxed resize-none border-2 rounded-xl p-3 sm:p-4 backdrop-blur-sm transition-all duration-300 ${isDarkMode ? "border-purple-500/30 focus:border-purple-400 bg-slate-700/50 text-gray-200 placeholder:text-gray-400" : "border-rose-200 focus:border-rose-400 bg-white/70 text-rose-900 placeholder:text-rose-500"}`} />
                </div>

                <div className={`text-right text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>{diaryContent.length}{t("characters")}</div>
                <div className="flex justify-center pt-2 sm:pt-4">
                  <Button onClick={handleSave}
                    className={`px-6 sm:px-8 py-3 text-base sm:text-lg font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${isSaved ? "bg-green-500 hover:bg-green-600" : (isDarkMode ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600")}`}>
                    <Save className="w-5 h-5 mr-2" />
                    {isSaved ? t("saved") : t("save_diary")}
                  </Button>
                </div>
                <div className={`text-center pt-4 sm:pt-6 border-t ${isDarkMode ? "border-purple-500/30" : "border-rose-200"}`}>
                  <p className={`text-xs sm:text-sm italic ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>
                    {isDarkMode ? t("footer_message_dark") : t("footer_message_light")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : currentView === "list" ? (
            /* --- 내 일기 리스트 (원본 유지) --- */
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
                        <div className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${isDarkMode ? "border-purple-500/30 bg-slate-700/50 hover:bg-slate-700/70" : "border-purple-100 bg-white/50 hover:bg-white/70"}`} onClick={() => setSelectedEntry(entry)}>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className={`text-base sm:text-lg font-semibold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{entry.title}</h3>
                              <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>{formatEntryDate(entry.date)} {entry.mood && <span className="ml-2 text-base">{entry.mood} {emotionMap[entry.mood]}</span>}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{entry.content.length}{t("characters")}</span>
                              <Button onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }} variant="ghost" size="sm" className={`text-xs px-2 py-1 rounded ${isDarkMode ? "text-red-400 hover:bg-red-900/20" : "text-red-600 hover:bg-red-100"}`}>
                                {t("delete")}
                              </Button>
                            </div>
                          </div>
                          <p className={`text-sm sm:text-base line-clamp-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{entry.content}</p>
                          {entry.image && (<div className="mt-3"><img src={entry.image} alt="Diary" className="w-full h-auto max-h-32 object-cover rounded-lg border border-gray-300/50" /></div>)}
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
                        {(() => {
                          const groupSize = 5;
                          const groupStart = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
                          const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);
                          const goFirst = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage !== 1) setCurrentPage(1) };
                          const goPrev = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1) };
                          const goNext = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1) };
                          const goLast = (e: React.MouseEvent) => { e.preventDefault(); if (currentPage !== totalPages && totalPages > 0) setCurrentPage(totalPages) };
                          return (
                            <>
                              <PaginationItem><PaginationLink href="#" onClick={goFirst} aria-label="첫 페이지로" className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>&laquo;</PaginationLink></PaginationItem>
                              <PaginationItem><PaginationLink href="#" onClick={goPrev} aria-label="이전 페이지" className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>&lsaquo;</PaginationLink></PaginationItem>
                              {Array.from({ length: groupEnd - groupStart + 1 }, (_, i) => groupStart + i).map((page) => (
                                <PaginationItem key={page}><PaginationLink href="#" isActive={page === currentPage} aria-label={`페이지 ${page}`} onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}>{page}</PaginationLink></PaginationItem>
                              ))}
                              <PaginationItem><PaginationLink href="#" onClick={goNext} aria-label="다음 페이지" className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}>&rsaquo;</PaginationLink></PaginationItem>
                              <PaginationItem><PaginationLink href="#" onClick={goLast} aria-label="마지막 페이지로" className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : ""}>&raquo;</PaginationLink></PaginationItem>
                            </>
                          );
                        })()}
                      </PaginationContent>
                    </Pagination>
                  </>
                )}
              </CardContent>
            </Card>
          ) : currentView === "community" ? (
            /* --- 커뮤니티 뷰 (신규) --- */
            <Card className={`backdrop-blur-sm shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 border border-slate-700/50" : "bg-white/90 border border-rose-200/50"}`}>
              <CardHeader className="pb-2">
                {/* 상단 탭 */}
                <div className="flex items-center gap-4 overflow-x-auto no-scrollbar px-1">
                  {[
                    { key: "latest", label: t("community_latest") },
                    { key: "popular", label: t("community_popular") },
                    { key: "joy", label: t("emotion_joy") },
                    { key: "sad", label: t("emotion_sadness") },
                    { key: "anger", label: t("emotion_anger") },
                    { key: "tired", label: t("emotion_tiredness") },
                    { key: "love", label: t("emotion_love") },
                    { key: "worry", label: t("emotion_worry") },
                  ].map(it => (
                    <button key={it.key} onClick={() => setCat(it.key as any)}
                      className={`relative pb-2 text-sm whitespace-nowrap ${cat === it.key ? "text-blue-400" : "text-gray-400"}`}>
                      {it.label}
                      <span className={`absolute left-0 right-0 -bottom-[1px] h-[2px] rounded ${cat === it.key ? "bg-blue-400" : "bg-transparent"}`} />
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-white/5">
                  {filteredPosts.map((p) => (
                    <li key={p.id} className="px-3 sm:px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setOpenedPost(p)}>
                      <div className="flex items-start gap-3">
                        <img src={p.avatar || "/placeholder.svg?height=40&width=40"} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`text-sm sm:text-base font-semibold truncate ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{p.title}</h3>
                            {p.mood && (<span className="text-[11px] px-2 py-[2px] rounded-full bg-white/5 text-gray-300">{MOOD_LABEL[p.mood]}</span>)}
                          </div>
                          <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                            [{p.author}]{' '}
                            {formatDistanceToNowStrict(new Date(p.createdAt), {
                              addSuffix: true,
                              locale: { ko, en: enUS, ja, zh: zhCN }[i18n.language] || ko,
                            })}
                          </p>
                          <div className="mt-1 flex items-center gap-3 text-[12px]">
                            <span className="flex items-center gap-1 text-gray-400"><Eye className="w-4 h-4" /> {p.views}</span>
                            <span className="flex items-center gap-1 text-gray-400"><MessageSquare className="w-4 h-4" /> {p.commentsCount}</span>
                            <span className="flex items-center gap-1 text-gray-400"><Heart className="w-4 h-4" /> {p.likes}</span>
                          </div>
                        </div>
                        {p.thumb && (<img src={p.thumb} alt="" className="flex-none w-16 h-16 rounded-md object-cover border border-white/10" />)}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : currentView === "support" ? (
            /* --- 후원 뷰 (원본 유지) --- */
            <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-pink-500/30 border border-slate-700/50" : "bg-white/90 border border-pink-200/50 shadow-pink-200/30"}`}>
              {/* ... (중략: 기존 후원 내용 그대로, 위 코드에서 이미 존재) ... */}
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Heart className={`w-6 h-6 ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
                  <h2 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>{t("support_developer")}</h2>
                  <Heart className={`w-6 h-6 ${isDarkMode ? "text-pink-400" : "text-pink-500"}`} />
                </div>
                <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>{t("support_thanks")}</p>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-6">
                {/* (원본 후원 카드들 그대로) */}
                <div className="text-center space-y-4">
                  <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-rose-50/80"}`}>
                    <h3 className={`text-lg sm:text-xl font-semibold mb-3 ${isDarkMode ? "text-pink-300" : "text-rose-700"}`}>{t("support_message")}</h3>
                    <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-rose-600"}`}>{t("support_message_detail")}</p>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <div className={`p-6 sm:p-8 rounded-xl border-2 border-dashed ${isDarkMode ? "border-pink-400/50 bg-pink-900/20" : "border-pink-300/50 bg-pink-100/50"}`}>
                    <div className="mb-4">
                      <img src="/placeholder.svg?height=60&width=60" alt="토스뱅크" className="mx-auto mb-3 rounded-lg" loading="lazy" />
                      <h4 className={`text-base sm:text-lg font-semibold ${isDarkMode ? "text-pink-300" : "text-pink-700"}`}>{t("toss_bank")}</h4>
                    </div>
                    <div className={`text-2xl sm:text-3xl font-bold mb-2 font-mono tracking-wider ${isDarkMode ? "text-pink-200" : "text-pink-800"}`}>1000-8490-8014</div>
                    <div className="flex items-center justify-center gap-2">
                      <Button onClick={handleCopy} className={`px-5 sm:px-6 py-2 rounded-full transition-all duration-300 ${isDarkMode ? "bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30" : "bg-pink-500/20 hover:bg-pink-500/30 text-pink-600 border border-pink-300/50"}`} variant="outline">
                        {t("copy_account_number")}
                      </Button>
                      {isCopied && <span className="copy-success-animation">복사 완료!</span>}
                    </div>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <div className={`p-4 sm:p-6 rounded-xl ${isDarkMode ? "bg-slate-800/30" : "bg-amber-50/50"}`}>
                    <p className={`text-xs sm:text-sm italic ${isDarkMode ? "text-gray-400" : "text-amber-700"}`}>{t("small_support_message")}</p>
                    <div className="mt-4 flex justify-center gap-2"><Heart className={`${isDarkMode ? "text-pink-400" : "text-pink-500"} w-4 h-4 animate-pulse`} /><Heart className={`${isDarkMode ? "text-pink-400" : "text-pink-500"} w-4 h-4 animate-pulse delay-100`} /><Heart className={`${isDarkMode ? "text-pink-400" : "text-pink-500"} w-4 h-4 animate-pulse delay-200`} /></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`inline-block p-4 rounded-full ${isDarkMode ? "bg-slate-800/50" : "bg-rose-100/50"}`}>
                    <div className={`text-3xl mb-2`}>👨‍💻</div>
                    <p className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>{t("developer_team")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : currentView === "hall" ? (
            /* --- 명예의 전당 (원본 유지) --- */
            /* ... 원본 코드 동일 ... */
            <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-yellow-500/30 border border-slate-700/50" : "bg-white/90 border border-yellow-200/50 shadow-yellow-200/30"}`}>
              {/* (원본 내용 그대로) */}
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="text-3xl sm:text-4xl animate-bounce">🏆</div>
                  <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}>{t("hall_of_fame_title")}</h2>
                  <div className="text-3xl sm:text-4xl animate-bounce delay-100">🏆</div>
                </div>
                <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-yellow-700"}`}>{t("hall_of_fame_description")}</p>
              </CardHeader>
              {/* 하단부 생략 — 기존과 동일 */}
              <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-6">
                {/* 후원자 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
                    <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                      49
                    </div>
                    <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>{t("total_supporters")}</div>
                  </div>
                  <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
                    <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                      ₩862,200
                    </div>
                    <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>{t("total_donations")}</div>
                  </div>
                  <div className={`text-center p-3 sm:p-4 rounded-xl ${isDarkMode ? "bg-slate-800/50" : "bg-yellow-50/80"}`}>
                    <div className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-yellow-300" : "text-yellow-600"}`}>
                      235
                    </div>
                    <div className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-yellow-700"}`}>{t("total_diaries")}</div>
                  </div>
                </div>

                {/* VIP 후원자 (10만원 이상) */}
                <div>
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-4 text-center ${isDarkMode ? "text-yellow-300" : "text-yellow-700"}`}
                  >
                    {t("vip_supporters")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      { name: "김**님", amount: "150,000원", date: "2025.08.01", message: "좋은 서비스 감사합니다!" },
                      { name: "이**님", amount: "200,000원", date: "2025.07.20", message: "개발자님 화이팅!" },
                      { name: "박**님", amount: "100,000원", date: "2025.08.03", message: "매일 사용하고 있어요 ❤️" },
                    ].map((supporter, index) => (
                      <div
                        key={index}
                        className={`p-3 sm:p-4 rounded-xl border-2 ${isDarkMode
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
                    {t("gold_supporters")}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                    {["최**님", "정**님", "강**님", "윤**님", "조**님", "장**님", "임**님", "한**님"].map(
                      (name, index) => (
                        <div
                          key={index}
                          className={`p-2 sm:p-3 rounded-lg text-center ${isDarkMode
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
                    {t("silver_supporters")}
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {[
                      "쯔나미님",
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
                    {t("bronze_supporters")}
                  </h3>
                  <div className={`p-3 sm:p-4 rounded-xl text-center ${isDarkMode ? "bg-slate-800/30" : "bg-orange-50/50"}`}>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[
                        "강**님",
                        "김동하님",
                        "현**님",
                        "문**님",
                        "김태린님",
                        "배**님",
                        "김나윤님",
                        "정태영님",
                        "사내미아내님",
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
                          className={`inline-block px-2 py-1 rounded text-xs ${isDarkMode ? "bg-orange-900/30 text-orange-300" : "bg-orange-100 text-orange-700"
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
                      💌 {t("developer_thanks_message_title")}
                    </h4>
                    <p className={`text-sm sm:text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-yellow-600"}`}>
                      {t("developer_thanks_message")}
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
                    className={`px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${isDarkMode
                      ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      }`}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {t("donate_now")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : currentView === "contact" ? (
            // 문의 페이지
            <Card
              className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode
                ? "bg-slate-900/80 shadow-green-500/30 border border-slate-700/50"
                : "bg-white/90 border border-green-200/50 shadow-green-200/30"
                }`}
            >
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Mail className={`w-6 h-6 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
                  <h2 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>
                    {t("contact_title")}
                  </h2>
                </div>
                <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>
                  {t("contact_description")}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 text-center">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <Button asChild className={`px-6 py-2 text-base font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${isDarkMode
                    ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"}`}>
                    <a href="https://forms.gle/FqDo7Xq31L3fbK5T8" target="_blank" rel="noopener noreferrer">
                      <Mail className="w-5 h-5 mr-2" />
                      {t("contact_form_button")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : currentView === "contact" ? (
            /* --- 문의 (원본 유지) --- */
            <Card className={`backdrop-blur-sm border-0 shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 shadow-green-500/30 border border-slate-700/50" : "bg-white/90 border border-green-200/50 shadow-green-200/30"}`}>
              <CardHeader className="text-center pb-4 sm:pb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Mail className={`w-6 h-6 ${isDarkMode ? "text-green-400" : "text-green-500"}`} />
                  <h2 className={`text-xl sm:text-2xl font-semibold ${isDarkMode ? "text-gray-200" : "text-rose-800"}`}>{t("contact_title")}</h2>
                </div>
                <p className={`text-base sm:text-lg ${isDarkMode ? "text-gray-300" : "text-rose-700"}`}>{t("contact_description")}</p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6 text-center">
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <Button asChild className={`px-6 py-2 text-base font-medium rounded-full transition-all duration-300 text-white shadow-lg hover:shadow-xl transform hover:scale-105 ${isDarkMode ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700" : "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"}`}>
                    <a href="https://forms.gle/FqDo7Xq31L3fbK5T8" target="_blank" rel="noopener noreferrer">
                      <Mail className="w-5 h-5 mr-2" />
                      {t("contact_form_button")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className={`text-center mt-8 mb-6 ${isDarkMode ? "text-gray-400" : "text-rose-600"}`}>
            <p className="text-xs mb-2 opacity-70">{t("also_good_to_see")}</p>
            <BottomBannerAd />
          </div>

          {/* 푸터 */}
          <footer className={`text-center mt-8 py-8 border-t ${isDarkMode ? "border-slate-800 text-gray-500" : "border-rose-100 text-rose-500"}`}>
            <nav aria-label="Footer Navigation" className="mb-4">
              <ul className="flex flex-wrap justify-center gap-2 max-w-2xs mx-auto md:max-w-none">
                <li><Button variant="link" onClick={() => setCurrentView('write')} className={isDarkMode ? "text-gray-400" : "text-rose-600"}>{t("footer_write_diary")}</Button></li>
                <li><Button variant="link" onClick={() => setCurrentView('list')} className={isDarkMode ? "text-gray-400" : "text-rose-600"}>{t("footer_list_diaries")}</Button></li>
                <li className="basis-full h-0 md:hidden" />
                <li><Button variant="link" onClick={() => setCurrentView('community')} className={isDarkMode ? "text-gray-400" : "text-rose-600"}>{t("community")}</Button></li>
                <li><Button variant="link" onClick={() => setCurrentView('support')} className={isDarkMode ? "text-gray-400" : "text-rose-600"}>{t("footer_support")}</Button></li>
                <li><Button variant="link" onClick={() => setCurrentView('hall')} className={isDarkMode ? "text-gray-400" : "text-rose-600"}>{t("footer_hall_of_fame")}</Button></li>
              </ul>
            </nav>
            <nav aria-label="Social Media Links" className="mb-4 flex justify-center gap-4">
              <a href="https://x.com/haru2end" target="_blank" rel="noopener noreferrer" aria-label="하루의 끝 X(Twitter) 페이지" className="underline">X(Twitter)</a>
              <a href="https://www.instagram.com/haru2_end" target="_blank" rel="noopener noreferrer" aria-label="하루의 끝 Instagram 페이지" className="underline">Instagram</a>
              <a href="https://www.youtube.com/@haru2end" target="_blank" rel="noopener noreferrer" aria-label="하루의 끝 YouTube 채널" className="underline">YouTube</a>
            </nav>
            <p className="text-sm">© 2025 하루의 끝. {t("all_moments_precious")}.</p>
          </footer>
        </div>

        {/* 일기 상세 모달 (원본) */}
        {selectedEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
              <CardHeader className="relative p-4 sm:p-6">
                <Button onClick={() => setSelectedEntry(null)} variant="ghost" size="sm"
                  className={`absolute top-2 right-2 ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}>✕</Button>
                <div className="text-center mb-4">
                  <h3 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{selectedEntry.title}</h3>
                </div>
                <div className="flex justify-end items-center mb-4">
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {formatEntryDate(selectedEntry.date)} {selectedEntry.mood && <span className="ml-2 text-xl">{selectedEntry.mood}</span>} | {selectedEntry.content.length}자
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {selectedEntry.image && (<div className="mb-4 cursor-pointer" onClick={() => setZoomedImage(selectedEntry.image || null)}>
                  <img src={selectedEntry.image} alt="Diary" className="w-full h-auto max-h-96 object-contain rounded-xl border-2 border-dashed border-gray-400/50" />
                </div>)}
                <p className={`text-base leading-relaxed whitespace-pre-wrap ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{selectedEntry.content}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* 앱 프로모션 배너 */}
      {showAppPromo && (
        <div className={`fixed z-50 ${isMobile ? "left-3 right-3 bottom-3" : "right-6 bottom-6 w-[360px]"}`} aria-label={t("app_promo_aria_label")}>
          <div className={`relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl border ${isDarkMode ? "bg-slate-900/70 border-slate-700/60" : "bg-white/80 border-rose-200/70"}`}>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-yellow-500/10" />
            <button onClick={dismissAppPromo} aria-label={t("dismiss_app_promo_aria_label")} className={`absolute right-2 top-2 rounded-full px-2 py-1 text-xs ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-black/5"}`}>×</button>
            <div className="p-4 flex items-start gap-3">
              <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${isDarkMode ? "bg-purple-500/20" : "bg-rose-500/15"}`}>
                <Smartphone className={`${isDarkMode ? "text-purple-300" : "text-rose-600"} h-5 w-5`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`truncate text-base font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{t("app_promo_title")}</h3>
                <p className={`mt-1 text-sm ${isDarkMode ? "text-gray-300/80" : "text-gray-600"}`}>{t("app_promo_description")}</p>
                <div className="mt-3 flex items-center gap-2">
                  <a href="/download" target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium ${isDarkMode ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700" : "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600"}`}>
                    {t("download_app")}
                  </a>
                  <button onClick={dismissAppPromo} className={`inline-flex items-center justify-center rounded-full px-3 py-2 text-sm ${isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-black/5"}`}>{t("later")}</button>
                </div>
              </div>
            </div>
            {isMobile && (<div className={`h-[3px] w-full ${isDarkMode ? "bg-purple-400/40" : "bg-rose-400/40"}`} />)}
          </div>
        </div>
      )}

      {/* 이미지 줌 모달 */}
      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] p-4" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="Zoomed" className="max-w-full max-h-full object-contain object-fit: cover" onClick={(e) => e.stopPropagation()} />
          <Button onClick={() => setZoomedImage(null)} variant="ghost" size="sm" className="absolute top-4 right-4 text-white text-2xl">✕</Button>
        </div>
      )}

      {/* 커뮤니티 상세 모달 */}
      {currentView === "community" && openedPost && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 overscroll-contain">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpenedPost(null)} />

          <Card className={`relative max-w-md w-full h-[100dvh] sm:h-auto max-h-[100dvh] flex flex-col ${isDarkMode ? "bg-slate-900" : "bg-gray-50"} overflow-hidden`}>
            {/* 헤더: 상단 고정 + 세이프 에어리어 패딩 */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-4 py-3 pt-[max(12px,env(safe-area-inset-top))] border-b backdrop-blur ${isDarkMode ? "border-white/10 bg-slate-900/80" : "border-gray-200 bg-white/80"}`}>
              <button onClick={() => setOpenedPost(null)} className="flex items-center gap-1 text-sm">
                <ChevronLeft className={`w-5 h-5 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`} />
                <span className={isDarkMode ? "text-gray-300" : "text-gray-600"}>{t("community_post_list")}</span>
              </button>
              <MoreVertical className={isDarkMode ? "text-gray-400" : "text-gray-800"} />
            </div>

            {/* 스크롤 영역: 본문/이미지/댓글 목록 */}
            <div className="flex-1 overflow-y-auto">
              {/* 작성자/제목/날짜/감정 */}
              <div className="px-5 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={openedPost.avatar || "/placeholder.svg"}
                    className={`w-6 h-6 rounded-full border ${isDarkMode ? "border-white/10" : "border-gray-200"}`}
                    alt="avatar"
                  />
                  <span className={isDarkMode ? "text-gray-300 text-sm" : "text-gray-700 text-sm"}>{openedPost.author}</span>
                  <span className={`ml-auto text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {formatEntryDate(openedPost.writeDate)}
                  </span>
                  {openedPost.mood && (
                    <span className={`ml-2 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {MOOD_LABEL[openedPost.mood]}
                    </span>
                  )}
                </div>
                <h2 className={`text-xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-700"}`}>{openedPost.title}</h2>
              </div>

              {/* 이미지 */}
              {openedPost.thumb && (
                <div className="px-5 mt-3">
                  <img
                    src={openedPost.thumb}
                    alt="post"
                    className={`w-full rounded-lg border ${isDarkMode ? "border-white/10" : "border-gray-200"} object-cover max-h-56 cursor-pointer`}
                    onClick={() => setZoomedImage(openedPost.thumb || null)}
                  />
                </div>
              )}

              {/* 본문 */}
              <div className="px-5 mt-4">
                <div className={`space-y-3 text-[15px] leading-7 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  <p>{openedPost.content}</p>
                </div>
              </div>

              {/* 액션 */}
              <div className="px-5 mt-5">
                <div className={`grid grid-cols-3 text-center py-2 border-y ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                  <button onClick={() => togglePostLike(openedPost.id)} className="flex items-center justify-center gap-2 py-1">
                    <Heart className={`w-5 h-5 ${postLiked[openedPost.id] ? "fill-current text-pink-500" : (isDarkMode ? "" : "text-black")}`} />
                    <span className="text-sm">{openedPost.likes + (postLiked[openedPost.id] ? 1 : 0)} 좋아요</span>
                  </button>
                  <div className="flex items-center justify-center gap-2 py-1">
                    <Share2 className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-800"}`} />
                    <span className="text-sm">공유하기</span>
                  </div>
                  <button onClick={() => togglePostBookmark(openedPost.id)} className="flex items-center justify-center gap-2 py-1">
                    <Bookmark className={`w-5 h-5 ${postBookmarked[openedPost.id] ? "fill-current text-yellow-500" : (isDarkMode ? "" : "text-black")}`} />
                    <span className="text-sm">{postBookmarked[openedPost.id] ? "저장됨" : "담아두기"}</span>
                  </button>
                </div>
              </div>

              {/* 댓글 목록 */}
              <div className="px-5 pt-3 pb-4">
                <div className="flex items-center gap-4 text-sm">
                  <button
                    onClick={() => setCommentTab("hot")}
                    className={`${commentTab === "hot" ? (isDarkMode ? "text-white" : "text-gray-800") : (isDarkMode ? "text-gray-400" : "text-gray-500")}`}
                  >
                    인기글
                  </button>
                  <button
                    onClick={() => setCommentTab("new")}
                    className={`${commentTab === "new" ? (isDarkMode ? "text-white" : "text-gray-800") : (isDarkMode ? "text-gray-400" : "text-gray-500")}`}
                  >
                    최신순
                  </button>
                  <span className={`ml-auto text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    총 {(postComments[openedPost.id] || []).length}개
                  </span>
                </div>

                <div className="mt-3 space-y-5">
                  {(postComments[openedPost.id] || []).length === 0 ? (
                    <p className={`text-sm ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>{t("community_no_comments")}</p>
                  ) : (
                    (postComments[openedPost.id] || []).map((c) => (
                      <div key={c.id}>
                        <div className="flex items-start gap-3">
                          <img src="/test/user.png" className="w-7 h-7 rounded-full" alt="" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{c.nick}</span>
                            </div>
                            <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{c.text}</p>
                            <div className={`mt-2 flex items-center gap-4 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                              <button
                                onClick={() => toggleCommentLike(openedPost.id, c.id)}
                                className="inline-flex items-center gap-1 hover:text-current"
                              >
                                <Heart className={`w-4 h-4 ${c.liked ? "fill-current text-pink-500" : (isDarkMode ? "" : "text-black")}`} />
                                좋아요 {c.likeCount + (c.liked ? 1 : 0)}
                              </button>
                              <button
                                onClick={() => setExpandedReplies((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
                                className={`${isDarkMode ? "hover:text-current" : "hover:text-gray-800"}`}
                              >
                                답글 {c.replies.length}
                              </button>
                              <button className={`${isDarkMode ? "hover:text-current" : "hover:text-gray-800"}`}>더보기</button>
                            </div>

                            {expandedReplies[c.id] && (
                              <div className="mt-3 space-y-3">
                                {c.replies.length === 0 ? (
                                  <div className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>{t("community_no_replies")}</div>
                                ) : (
                                  c.replies.map((r) => (
                                    <div key={r.id} className="flex items-start gap-3">
                                      <img src="/images/sample/avatar-2.png" className="w-6 h-6 rounded-full" alt="" />
                                      <div className="flex-1">
                                        <div className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{r.nick}</div>
                                        <div className={`text-sm ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>{r.text}</div>
                                        <div className="mt-1">
                                          <button
                                            onClick={() => toggleReplyLike(openedPost.id, c.id, r.id)}
                                            className={`text-xs ${isDarkMode ? "text-gray-400 hover:text-current" : "text-gray-600 hover:text-gray-800"} inline-flex items-center gap-1`}
                                          >
                                            <Heart className={`w-3.5 h-3.5 ${r.liked ? "fill-current text-pink-500" : (isDarkMode ? "" : "text-black")}`} />
                                            좋아요 {r.likeCount + (r.liked ? 1 : 0)}
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}

                                <div className="flex items-center gap-2">
                                  <input
                                    value={replyInput[c.id] || ""}
                                    onChange={(e) => setReplyInput((prev) => ({ ...prev, [c.id]: e.target.value }))}
                                    placeholder={t("community_reply_placeholder")}
                                    className={`flex-1 rounded-full px-3 py-2 text-sm outline-none ${isDarkMode ? "bg-slate-800 text-gray-100 placeholder:text-gray-500" : "bg-gray-100 text-gray-800 placeholder:text-gray-400"
                                      }`}
                                  />
                                  <Button size="icon" className="rounded-full" onClick={() => submitReply(openedPost.id, c.id)}>
                                    <Send className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* 하단 입력바: 하단 고정 + 세이프 에어리어 반영 */}
            <div
              className={`sticky bottom-0 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] border-t backdrop-blur ${isDarkMode ? "border-white/10 bg-black/40" : "border-gray-200 bg-white/80"
                }`}
            >
              <div className="flex items-center gap-2">
                <input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={t("community_comment_placeholder")}
                  className={`flex-1 rounded-full px-4 py-3 text-base outline-none ${isDarkMode ? "bg-slate-800 text-gray-100 placeholder:text-gray-500" : "bg-gray-100 text-gray-800 placeholder:text-gray-400"
                    }`}
                />
                <Button size="icon" className="rounded-full h-10 w-10" onClick={() => submitComment(openedPost.id)}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
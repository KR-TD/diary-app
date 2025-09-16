'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye, MessageSquare, Share2, Bookmark, ChevronLeft, MoreVertical, Send, RefreshCw, Heart } from "lucide-react";
import { formatDistanceToNowStrict } from 'date-fns';
import { ko, enUS, ja, zhCN, Locale } from 'date-fns/locale';

// Types
interface BoardList {
  id: number; title: string; profile: string; thumbnail: string | null; writer: string; view: number;
  commentCount: number; loveCount: number; mood: string; boardCreateTime: string;
}
interface BoardDetailResponse extends BoardList {
  content: string; writeTime: string; liked: boolean; imageUrl: string | null;
}
interface BoardListResponse { totalPage: number; list: BoardList[]; }
interface CommentList {
  id: number; userId: number; comment: string; profile: string; writer: string; createDate: string;
  heart: number; liked: boolean; replyCommentCount: number; replies?: ReplyCommentList[];
}
interface CommentListResponse { list: CommentList[]; }
interface ReplyCommentList {
  id: number; userId: number; comment: string; profile: string; writer: string; createDate: string;
  heart: number; liked: boolean;
}
interface ReplyCommentListResponse { list: ReplyCommentList[]; }
type MoodKey = "JOY" | "SAD" | "ANGER" | "TIRED" | "LOVE" | "WORRY" | "ETC";
type Cat = "latest" | "popular" | MoodKey;

interface CommunityViewProps {
  isDarkMode: boolean;
  setAlertInfo: (info: { isOpen: boolean; title: string; description: string; }) => void;
  initialPostId?: string;
}

export function CommunityView({ isDarkMode, setAlertInfo, initialPostId }: CommunityViewProps) {
  const { t, i18n } = useTranslation();

  const [posts, setPosts] = useState<BoardList[]>([]);
  const [communityCurrentPage, setCommunityCurrentPage] = useState(0);
  const [communityTotalPages, setCommunityTotalPages] = useState(1);
  const [isCommunityLoading, setIsCommunityLoading] = useState(false);
  const [cat, setCat] = useState<Cat>("latest");
  const [openedPost, setOpenedPost] = useState<BoardDetailResponse | null>(null);
  const [postComments, setPostComments] = useState<Record<string, CommentList[]>>({});
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});
  const [commentTab, setCommentTab] = useState<"latest" | "popular">("latest");
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});

  const MOOD_LABEL: Record<MoodKey, string> = {
    JOY: t("emotion_joy"), SAD: t("emotion_sadness"), ANGER: t("emotion_anger"), TIRED: t("emotion_tiredness"),
    LOVE: t("emotion_love"), WORRY: t("emotion_worry"), ETC: t("emotion_etc"),
  };

  const formatTimeAgo = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const locales: { [key: string]: Locale } = { ko, en: enUS, ja, zh: zhCN };
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: locales[i18n.language] || ko });
  }, [i18n.language]);

  const fetchCommunityPosts = useCallback(async (category: Cat, page: number, limit: number) => {
    if (isCommunityLoading && page === 0) return;
    setIsCommunityLoading(true);
    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    let url = `https://code.haru2end.dedyn.io/api/board`;
    if (category === "latest") url += `/list?page=${page}&limit=${limit}`;
    else if (category === "popular") url += `/popular/list?page=${page}&limit=${limit}`;
    else url += `/mood/list?page=${page}&limit=${limit}&mood=${category}`;

    try {
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data: BoardListResponse = await response.json();
        setPosts(prev => page === 0 ? data.list : [...prev, ...data.list.filter(p => !prev.find(pp => pp.id === p.id))]);
        setCommunityTotalPages(data.totalPage);
      } else {
        if (page === 0) setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsCommunityLoading(false);
    }
  }, []);

  const fetchCommentsForPost = useCallback(async (boardId: number, type: 'latest' | 'popular') => {
    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    const url = `https://code.haru2end.dedyn.io/api/comment/${token ? '' : 'guest/'}list/${type}/${boardId}`;
    try {
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data: CommentListResponse = await response.json();
        setPostComments(prev => ({ ...prev, [boardId.toString()]: data.list || [] }));
      } else {
        setPostComments(prev => ({ ...prev, [boardId.toString()]: [] }));
      }
    } catch (error) {
      console.error(`Error fetching comments for board ${boardId}:`, error);
    }
  }, []);

  const handleViewCommunityPostDetails = useCallback(async (id: number) => {
    const token = localStorage.getItem('accessToken');
    const headers: HeadersInit = token ? { 'Authorization': `Bearer ${token}` } : {};
    const url = `https://code.haru2end.dedyn.io/api/board/${token ? id : `guest/${id}`}`;
    try {
      const response = await fetch(url, { headers });
      if (response.ok) {
        const data: BoardDetailResponse = await response.json();
        setOpenedPost(data);
        fetchCommentsForPost(id, commentTab);
      } else {
        setAlertInfo({ isOpen: true, title: t("fetch_failed"), description: t("community_post_detail_error") });
      }
    } catch (error) {
      setAlertInfo({ isOpen: true, title: t("network_error"), description: t("fetch_network_error") });
    }
  }, [commentTab, fetchCommentsForPost, setAlertInfo, t]);

  const createComment = useCallback(async (boardId: number, commentText: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return setAlertInfo({ isOpen: true, title: t("auth_error"), description: t("login_required") });
    try {
      const response = await fetch(`https://code.haru2end.dedyn.io/api/comment/create/${boardId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ comment: commentText }),
      });
      if (response.status === 201) {
        setCommentInput("");
        fetchCommentsForPost(boardId, commentTab);
        setPosts(ps => ps.map(p => (p.id === boardId ? { ...p, commentCount: p.commentCount + 1 } : p)));
      } else {
        const errorData = await response.json();
        setAlertInfo({ isOpen: true, title: t("comment_create_failed"), description: errorData.message || t("comment_create_error") });
      }
    } catch (error) {
      setAlertInfo({ isOpen: true, title: t("network_error"), description: t("comment_network_error") });
    }
  }, [commentTab, fetchCommentsForPost, setAlertInfo, t]);

  useEffect(() => {
    if (initialPostId) {
      const postId = parseInt(initialPostId, 10);
      if (!isNaN(postId)) handleViewCommunityPostDetails(postId);
    }
  }, [initialPostId, handleViewCommunityPostDetails]);

  useEffect(() => {
    fetchCommunityPosts(cat, communityCurrentPage, 10);
  }, [cat, communityCurrentPage, fetchCommunityPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && !isCommunityLoading && communityCurrentPage < communityTotalPages - 1) {
        setCommunityCurrentPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCommunityLoading, communityCurrentPage, communityTotalPages]);

  const handleCategoryChange = (newCategory: Cat) => {
    if (newCategory === cat) return;
    setCat(newCategory);
    setCommunityCurrentPage(0);
    setPosts([]);
  };

  const handleRefresh = () => {
    if (isCommunityLoading) return;
    setCommunityCurrentPage(0);
    setPosts([]);
  };

  const submitComment = () => {
    if (!commentInput.trim() || !openedPost) return;
    createComment(openedPost.id, commentInput.trim());
  };

  return (
    <>
      <Card className={`backdrop-blur-sm shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900/80 border border-slate-700/50" : "bg-white/90 border border-rose-200/50"}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4 px-1">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
              {[
                { key: "latest", label: t("community_latest") }, { key: "popular", label: t("community_popular") },
                { key: "JOY", label: t("emotion_joy") }, { key: "SAD", label: t("emotion_sadness") },
                { key: "ANGER", label: t("emotion_anger") }, { key: "TIRED", label: t("emotion_tiredness") },
                { key: "LOVE", label: t("emotion_love") }, { key: "WORRY", label: t("emotion_worry") },
                { key: "ETC", label: t("emotion_etc") },
              ].map(it => (
                <button key={it.key} onClick={() => handleCategoryChange(it.key as Cat)} className={`relative pb-2 text-sm whitespace-nowrap ${cat === it.key ? "text-blue-400" : "text-gray-400"}`}>
                  {it.label}
                  <span className={`absolute left-0 right-0 -bottom-[1px] h-[2px] rounded ${cat === it.key ? "bg-blue-400" : "bg-transparent"}`} />
                </button>
              ))}
            </div>
            <Button onClick={handleRefresh} variant="ghost" size="icon" className="flex-shrink-0">
              <RefreshCw className={`w-4 h-4 ${isCommunityLoading && communityCurrentPage === 0 ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y divide-slate-800">
            {posts.map((p) => (
              <li key={p.id} className="px-3 sm:px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => handleViewCommunityPostDetails(p.id)}>
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 border border-slate-700"><AvatarImage src={p.profile || undefined} alt="avatar" /><AvatarFallback>{p.writer.charAt(0)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm sm:text-base font-semibold truncate ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{p.title}</h3>
                      {p.mood && (<span className="text-[11px] px-2 py-[2px] rounded-full bg-white/5 text-gray-300">{MOOD_LABEL[p.mood as MoodKey]}</span>)}
                    </div>
                    <div className={`mt-1 flex items-center gap-2 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      <span>{p.writer}</span>
                      <span className={`${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>·</span>
                      <span>{formatTimeAgo(p.boardCreateTime)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-[12px]">
                      <span className="flex items-center gap-1 text-gray-400"><Eye className="w-4 h-4" /> {p.view}</span>
                      <span className="flex items-center gap-1 text-gray-400"><MessageSquare className="w-4 h-4" /> {p.commentCount}</span>
                      <span className="flex items-center gap-1 text-gray-400"><Heart className="w-4 h-4" /> {p.loveCount}</span>
                    </div>
                  </div>
                  {p.thumbnail && (<img src={p.thumbnail} alt="" className="flex-none w-16 h-16 rounded-md object-cover border border-white/10" />)}
                </div>
              </li>
            ))}
          </ul>
          {isCommunityLoading && <div className="text-center p-4"><p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Loading...</p></div>}
        </CardContent>
      </Card>

      {openedPost && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center p-0 sm:p-4 overscroll-contain" onClick={() => setOpenedPost(null)}>
          <Card onClick={(e) => e.stopPropagation()} className={`w-full h-full sm:max-w-2xl sm:h-auto sm:max-h-[90vh] flex flex-col rounded-none sm:rounded-2xl ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white"}`}>
            <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-3 border-b shrink-0">
               <Button variant="ghost" size="icon" onClick={() => setOpenedPost(null)}><ChevronLeft className="w-6 h-6" /></Button>
               <div className="flex items-center gap-2">
                 <Avatar className="w-8 h-8"><AvatarImage src={openedPost.profile} alt={openedPost.writer} /><AvatarFallback>{openedPost.writer.charAt(0)}</AvatarFallback></Avatar>
                 <span className="font-semibold text-sm sm:text-base">{openedPost.writer}</span>
               </div>
               <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5" /></Button>
             </CardHeader>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">{openedPost.title}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{formatTimeAgo(openedPost.writeTime)}</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {openedPost.view}</span>
              </div>
              {openedPost.imageUrl && <div className="my-4"><img src={openedPost.imageUrl} alt={openedPost.title} className="w-full h-auto rounded-lg border" /></div>}
              <div className={`prose prose-sm dark:prose-invert max-w-none leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{openedPost.content}</div>
              <div className="p-2 border-y flex items-center justify-around">
                <Button variant="ghost" onClick={() => {}} className={`flex items-center gap-1.5 text-sm ${openedPost.liked ? 'text-pink-500 font-semibold' : ''}`}><Heart className="w-5 h-5" /> {openedPost.loveCount}</Button>
                <Button variant="ghost" className="flex items-center gap-1.5 text-sm"><Bookmark className="w-5 h-5" /> {t('bookmark')}</Button>
                <Button variant="ghost" onClick={() => {}} className="flex items-center gap-1.5 text-sm"><Share2 className="w-5 h-5" /> {t('share')}</Button>
              </div>
              <div>
                <div className="flex items-center gap-4 border-b mb-4">
                  <button onClick={() => setCommentTab('latest')} className={`pb-2 text-sm ${commentTab === 'latest' ? 'font-semibold border-b-2 border-current' : 'text-gray-500'}`}>{t('comments_latest')}</button>
                  <button onClick={() => setCommentTab('popular')} className={`pb-2 text-sm ${commentTab === 'popular' ? 'font-semibold border-b-2 border-current' : 'text-gray-500'}`}>{t('comments_popular')}</button>
                </div>
                <div className="space-y-4">
                  {(postComments[openedPost.id.toString()] || []).map(comment => (
                    <div key={comment.id}>
                      <div className="flex items-start gap-2">
                        <Avatar className="w-8 h-8"><AvatarImage src={comment.profile} alt={comment.writer} /><AvatarFallback>{comment.writer.charAt(0)}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <div className="text-sm"><span className="font-semibold">{comment.writer}</span><span className="text-gray-500 ml-2 text-xs">{formatTimeAgo(comment.createDate)}</span></div>
                          <p className="text-sm mt-1">{comment.comment}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button variant="ghost" size="sm" onClick={() => {}} className={`text-xs h-auto px-2 py-1 ${comment.liked ? 'text-pink-500' : 'text-gray-500'}`}><Heart className="w-3 h-3 mr-1" /> {comment.heart}</Button>
                            <Button variant="ghost" size="sm" onClick={() => setExpandedReplies(prev => ({...prev, [comment.id]: !prev[comment.id]}))} className="text-xs h-auto px-2 py-1 text-gray-500">{t('reply')} {comment.replyCommentCount > 0 && comment.replyCommentCount}</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-2 sm:p-3 border-t shrink-0">
              <div className="flex items-center gap-2">
                <Input value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder={t('add_comment_placeholder')} className="h-10" />
                <Button onClick={submitComment} disabled={!commentInput.trim()} className="h-10"><Send className="w-4 h-4" /></Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
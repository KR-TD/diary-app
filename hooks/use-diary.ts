'use client'

import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { TFunction } from 'i18next';

// Type definitions
export interface DiaryEntry {
  id: number; title: string; content: string; imageUrl: string | null;
  mood: string; createDate: string; shared: boolean;
}
interface DiaryDetailResponse {
  id: number; title: string; content: string; imageUrl: string | null;
  mood: string; createDate: string;
}

export function useDiary(
  setAlertInfo: (info: { isOpen: boolean; title: string; description: string; }) => void,
  t: TFunction
) {
  const { isLoggedIn } = useAuth();
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const fetchDiaries = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const response = await fetch('https://code.haru2end.dedyn.io/api/diary/list', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setDiaryEntries(response.ok ? (await response.json()).list || [] : []);
    } catch (error) {
      console.error("Error fetching diaries:", error);
      setDiaryEntries([]);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDiaries();
    }
  }, [isLoggedIn]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return setAlertInfo({ isOpen: true, title: t("auth_error"), description: t("login_required") });
    
    try {
      const response = await fetch(`https://code.haru2end.dedyn.io/api/diary/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 204) {
        fetchDiaries();
        if (selectedEntry?.id === id) setSelectedEntry(null);
        setAlertInfo({ isOpen: true, title: t("delete_success"), description: t("diary_deleted_successfully") });
      } else {
        const errorData = await response.json();
        setAlertInfo({ isOpen: true, title: t("delete_failed"), description: errorData.message || t("diary_delete_error") });
      }
    } catch (error) {
      setAlertInfo({ isOpen: true, title: t("network_error"), description: t("delete_network_error") });
    }
  };

  const handleShare = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return setAlertInfo({ isOpen: true, title: t("auth_error"), description: t("login_required") });

    try {
      const response = await fetch(`https://code.haru2end.dedyn.io/api/board/create/${id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 201) {
        fetchDiaries();
        setAlertInfo({ isOpen: true, title: t("share_success"), description: t("diary_shared_successfully") });
      } else {
        const errorData = await response.json();
        setAlertInfo({ isOpen: true, title: t("share_failed"), description: errorData.message || t("diary_share_error") });
      }
    } catch (error) {
      setAlertInfo({ isOpen: true, title: t("network_error"), description: t("share_network_error") });
    }
  };

  const handleViewDetails = async (id: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return setAlertInfo({ isOpen: true, title: t("auth_error"), description: t("login_required") });

    try {
      const response = await fetch(`https://code.haru2end.dedyn.io/api/diary/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data: DiaryDetailResponse = await response.json();
        setSelectedEntry({ ...data, shared: diaryEntries.find(e => e.id === id)?.shared || false });
      } else {
        const errorData = await response.json();
        setAlertInfo({ isOpen: true, title: t("fetch_failed"), description: errorData.message || t("diary_detail_error") });
      }
    } catch (error) {
      setAlertInfo({ isOpen: true, title: t("network_error"), description: t("fetch_network_error") });
    }
  };

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return diaryEntries.slice(indexOfFirstItem, indexOfLastItem);
  }, [diaryEntries, currentPage]);

  const totalPages = useMemo(() => Math.ceil(diaryEntries.length / itemsPerPage), [diaryEntries]);

  return {
    diaryEntries,
    selectedEntry,
    setSelectedEntry,
    currentItems,
    currentPage,
    setCurrentPage,
    totalPages,
    fetchDiaries,
    handleDelete,
    handleShare,
    handleViewDetails,
  };
}

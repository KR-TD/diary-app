"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, Volume2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MusicPlayerProps {
  isDarkMode: boolean;
}

export function MusicPlayer({ isDarkMode }: MusicPlayerProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioSupported, setAudioSupported] = useState(true);
  const [audioError, setAudioError] = useState(false);

  const musicTracks = [
    { name: t("music_track_rain_name"), description: t("music_track_rain_description"), url: "/music/rain-sounds.mp3", icon: "🌧️" },
    { name: t("music_track_bird_name"), description: t("music_track_bird_description"), url: "/music/bird-sounds.mp3", icon: "🐦" },
    { name: t("music_track_fire_name"), description: t("music_track_fire_description"), url: "/music/fire-sounds.mp3", icon: "🔥" },
  ];

  const handleAudioError = (e: Event | string) => {
    console.error("Audio error:", e);
    setAudioError(true);
    setIsPlaying(false);
    setIsAudioLoading(false);
  };

  useEffect(() => {
    const testAudio = new Audio();
    if (typeof testAudio.canPlayType !== "function" || !testAudio.canPlayType("audio/mpeg")) {
      setAudioSupported(false);
      return;
    }
    const audio = new Audio();
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;
    audio.addEventListener("error", handleAudioError);
    audio.addEventListener("play", () => setIsPlaying(true));
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("loadstart", () => setIsAudioLoading(true));
    audio.addEventListener("canplaythrough", () => setIsAudioLoading(false));
    audio.addEventListener("ended", () => setIsPlaying(false));
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener("error", handleAudioError);
        audio.removeEventListener("play", () => setIsPlaying(true));
        audio.removeEventListener("pause", () => setIsPlaying(false));
        audio.removeEventListener("loadstart", () => setIsAudioLoading(true));
        audio.removeEventListener("canplaythrough", () => setIsAudioLoading(false));
        audio.removeEventListener("ended", () => setIsPlaying(false));
      }
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audioSupported) return;
    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src) {
        audio.src = musicTracks[currentTrack].url;
        audio.load();
      }
      audio.play().catch(handleAudioError);
    }
  };

  const changeTrack = (trackIndex: number) => {
    if (!audioSupported || !audioRef.current) return;
    setCurrentTrack(trackIndex);
    setAudioError(false);
    const audio = audioRef.current;
    audio.src = musicTracks[trackIndex].url;
    audio.load();
    audio.play().catch(handleAudioError);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  return (
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
  );
}

import type { Metadata } from "next";
import DiaryPage from "../diary-page";

export const metadata: Metadata = {
  title: "하루의 끝 - 감성 온라인 일기장 | 매일의 생각과 감정 기록",
  description:
    "하루의 끝에서 당신의 하루를 특별하게 마무리하세요. 감성적인 온라인 일기장에 오늘의 순간, 감정, 생각을 기록하며 나만의 다이어리를 만들고 꾸밀 수 있습니다.",
};

export default function Page() {
  return (
    <div>
      <DiaryPage />
    </div>
  );
}
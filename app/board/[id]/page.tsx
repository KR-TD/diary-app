import type { Metadata } from "next";
import DiaryPage from "../../../diary-page";

type Props = {
  params: { id: string };
};

// 게시물 데이터를 가져오는 함수 (실제 API에 맞게 수정 필요)
async function getDiaryPost(id: string) {
  try {
    const res = await fetch(`https://code.haru2end.dedyn.io/api/board/${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch diary post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const post = await getDiaryPost(id);

  if (!post) {
    return {
      title: "일기를 찾을 수 없습니다 | 하루의 끝",
      description: "요청하신 일기를 찾을 수 없거나 삭제되었습니다.",
    };
  }

  const siteUrl = "https://www.haru2end.com";
  const ogImageUrl = post.imageUrl || `${siteUrl}/og-image.png`;
  const description = post.content.substring(0, 150);

  return {
    title: `${post.title} | 하루의 끝`,
    description: description,
    alternates: {
      canonical: `${siteUrl}/board/${id}`,
    },
    openGraph: {
      title: post.title,
      description: description,
      url: `${siteUrl}/board/${id}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
      publishedTime: post.createDate, // API에 게시일 정보가 있다면 활용
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [ogImageUrl],
    },
  };
}

export default function BoardPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <div>
      <DiaryPage boardId={id} />
    </div>
  );
}
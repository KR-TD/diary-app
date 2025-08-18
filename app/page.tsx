import DiaryPage from "../diary-page"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaMobileAlt } from "react-icons/fa";

export default function Page() {
  return (
    <div>
      <DiaryPage />

      {/* New Mobile App CTA Card */}
      <div className="flex justify-center p-4 mt-8"> {/* Added margin-top for spacing */}
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center justify-center gap-2">
              <FaMobileAlt className="w-6 h-6 text-blue-500" />
              하루의 끝 모바일 앱
            </CardTitle>
            <CardDescription>
              언제 어디서든 편리하게 일기를 작성하고 관리하세요!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/download" passHref>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                앱 다운로드 페이지로 이동
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

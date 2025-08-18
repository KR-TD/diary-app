
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FaApple, FaAndroid } from "react-icons/fa";

export default function DownloadPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">하루의 끝 앱 설치</CardTitle>
            <CardDescription>모바일 앱으로 하루의 끝을 경험해보세요.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <FaAndroid className="w-12 h-12 text-green-500" />
                <h3 className="text-xl font-semibold">Android</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  아래 버튼을 눌러 APK 파일을 다운로드하세요.
                </p>
                <a href="/app-release.apk" download>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Android 앱 다운로드
                  </Button>
                </a>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <FaApple className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                <h3 className="text-xl font-semibold">iOS</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  iOS 버전은 현재 준비 중입니다.
                </p>
                <Button disabled className="w-full">
                  출시 예정
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

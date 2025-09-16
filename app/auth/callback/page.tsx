"use client";

import React, { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

function CallbackComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const handleLogin = async () => {
      const atk = searchParams.get('atk');
      const rtk = searchParams.get('rtk');

      if (atk && rtk) {
        await login(atk, rtk);
        // Redirect to home page after successful login
        router.push('/');
      } else {
        // Handle cases where tokens are not provided
        console.error('Social login failed: Tokens not found in URL');
        alert('소셜 로그인에 실패했습니다.');
        router.push('/');
      }
    };

    handleLogin();
  }, [searchParams, login, router]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-200">로그인 중입니다...</p>
    </div>
  );
}

export default function SocialCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackComponent />
        </Suspense>
    )
}

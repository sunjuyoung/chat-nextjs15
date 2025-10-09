"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import AccountSignoutComponent from "./accountSignoutComponent";
import { usePathname } from "next/navigation";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname(); // 현재 경로 가져오기

  if (status === "loading") {
    return (
      <div className="px-4 py-2 bg-gray-300 text-white rounded-md animate-pulse">
        로딩 중...
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          안녕하세요, {session.user?.name || session.user?.email}님
        </span>
        <AccountSignoutComponent />
      </div>
    );
  }

  return (
    <Link
      href={`/account/signin?from=${encodeURIComponent(pathname)}`}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 font-medium"
    >
      로그인
    </Link>
  );
}

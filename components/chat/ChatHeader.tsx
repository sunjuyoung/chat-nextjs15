"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical, User } from "lucide-react";

interface ChatHeaderProps {
  roomId: string;
  userName?: string;
  userStatus?: "online" | "offline";
}

export default function ChatHeader({
  roomId,
  userName = "채팅방",
  userStatus = "online",
}: ChatHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        {/* 왼쪽: 뒤로가기 버튼 */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="뒤로가기"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* 사용자 정보 */}
          <div className="flex items-center space-x-3">
            {/* 아바타 */}
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              {/* 온라인 상태 표시 */}
              {userStatus === "online" && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* 이름 및 상태 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {userName}
              </h2>
              <p className="text-xs text-gray-500">
                {userStatus === "online" ? (
                  <span className="text-green-600 font-medium">● 온라인</span>
                ) : (
                  <span className="text-gray-400">오프라인</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 오른쪽: 더보기 메뉴 */}
        <button
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          aria-label="메뉴"
        >
          <MoreVertical className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
}

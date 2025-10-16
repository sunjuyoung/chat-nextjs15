"use client";

import { X, Users, MessageCircle, Circle } from "lucide-react";
import { ChatUser } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface MemberListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
}

// 더미 데이터
const dummyMembers: ChatUser[] = [
  {
    id: "user1@example.com",
    email: "user1@example.com",
    name: "홍길동",
    avatar: "",
    isOnline: true,
  },
  {
    id: "user2@example.com",
    email: "user2@example.com",
    name: "김철수",
    avatar: "",
    isOnline: true,
    lastSeen: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: "user3@example.com",
    email: "user3@example.com",
    name: "최민지",
    avatar: "",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "user4@example.com",
    email: "user4@example.com",
    name: "박영희",
    avatar: "",
    isOnline: true,
  },
  {
    id: "user5@example.com",
    email: "user5@example.com",
    name: "이지훈",
    avatar: "",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "user6@example.com",
    email: "user6@example.com",
    name: "이지은",
    avatar: "",
    isOnline: true,
  },
  {
    id: "user7@example.com",
    email: "user7@example.com",
    name: "정대호",
    avatar: "",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "user8@example.com",
    email: "user8@example.com",
    name: "강서현",
    avatar: "",
    isOnline: true,
  },
];

export default function MemberListPanel({
  isOpen,
  onClose,
  onStartChat,
}: MemberListPanelProps) {
  if (!isOpen) return null;

  const onlineMembers = dummyMembers.filter((member) => member.isOnline);
  const offlineMembers = dummyMembers.filter((member) => !member.isOnline);

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return "";
    try {
      return formatDistanceToNow(new Date(lastSeen), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return "";
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-yellow-500 to-yellow-600",
      "from-red-500 to-red-600",
      "from-teal-500 to-teal-600",
    ];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderMember = (member: ChatUser) => (
    <div
      key={member.id}
      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        {/* 아바타 */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarColor(
              member.id
            )} flex items-center justify-center text-white font-semibold text-lg shadow-md`}
          >
            {getInitials(member.name)}
          </div>
          {/* 온라인 상태 표시 */}
          <div className="absolute bottom-0 right-0">
            <Circle
              className={`w-4 h-4 ${
                member.isOnline
                  ? "fill-green-500 text-green-500"
                  : "fill-gray-400 text-gray-400"
              } border-2 border-white rounded-full`}
            />
          </div>
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {member.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{member.email}</p>
          {!member.isOnline && member.lastSeen && (
            <p className="text-xs text-gray-400 mt-0.5">
              {formatLastSeen(member.lastSeen)}
            </p>
          )}
        </div>
      </div>

      {/* 채팅 버튼 */}
      <button
        onClick={() => {
          onStartChat(member.id);
          onClose();
        }}
        className="flex-shrink-0 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
        aria-label={`${member.name}와 채팅하기`}
      >
        <MessageCircle className="w-5 h-5" />
      </button>
    </div>
  );

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* 사이드 패널 */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">회원 목록</h2>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
              {dummyMembers.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors duration-200"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 회원 목록 */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {dummyMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Users className="w-16 h-16 mb-4" />
              <p className="text-lg">회원이 없습니다</p>
            </div>
          ) : (
            <>
              {/* 온라인 회원 */}
              {onlineMembers.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-white px-6 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                      <Circle className="w-3 h-3 fill-green-500 text-green-500 mr-2" />
                      온라인 - {onlineMembers.length}명
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {onlineMembers.map(renderMember)}
                  </div>
                </div>
              )}

              {/* 오프라인 회원 */}
              {offlineMembers.length > 0 && (
                <div>
                  <div className="sticky top-0 bg-white px-6 py-3 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-600 flex items-center">
                      <Circle className="w-3 h-3 fill-gray-400 text-gray-400 mr-2" />
                      오프라인 - {offlineMembers.length}명
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {offlineMembers.map(renderMember)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

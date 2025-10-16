"use client";

import { X, MessageSquare, Users, Hash } from "lucide-react";
import { ChatRoom } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface RoomListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom: (roomId: number) => void;
  currentRoomId?: number;
  rooms?: ChatRoom[];
}

export default function RoomListPanel({
  isOpen,
  onClose,
  onSelectRoom,
  currentRoomId,
  rooms = [],
}: RoomListPanelProps) {
  if (!isOpen) return null;

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), {
        addSuffix: true,
        locale: ko,
      });
    } catch {
      return "";
    }
  };

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
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">채팅방 목록</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-full transition-colors duration-200"
            aria-label="닫기"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 채팅방 목록 */}
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          {!rooms || rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p className="text-lg">아직 참여한 채팅방이 없습니다</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {rooms.map((room) => (
                <button
                  key={room.roomId}
                  onClick={() => {
                    onSelectRoom(room.roomId);
                    onClose();
                  }}
                  className={`w-full px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                    currentRoomId === room.roomId ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* 아이콘 */}
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        currentRoomId === room.roomId
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                      }`}
                    >
                      <Hash className="w-6 h-6 text-white" />
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {room.roomName}
                        </h3>
                        {room.lastMessageCreatedAt && (
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTime(room.lastMessageCreatedAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {room.lastMessageContent ? (
                          <p className="text-sm text-gray-600 truncate">
                            {room.lastMessageContent}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            메시지가 없습니다
                          </p>
                        )}

                        {room.unreadCount > 0 && (
                          <span className="ml-2 flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center">
                            {room.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* 참여자 수 */}
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Users className="w-3 h-3 mr-1" />
                        <span>{room.memberCount}명</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

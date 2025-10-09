"use client";

import { useEffect, useRef } from "react";
import ChatMessageBubble from "@/components/chat/ChatMessageBubble";
import { ChatMessage } from "@/types/chat";

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

export default function ChatMessageList({
  messages,
  currentUserId,
}: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가되면 자동으로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-24 h-24 mb-6 text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          아직 메시지가 없습니다
        </h3>
        <p className="text-gray-500">첫 메시지를 보내서 대화를 시작해보세요!</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#CBD5E1 transparent",
      }}
    >
      {messages.map((message, index) => {
        // 날짜 구분선 표시 (선택사항)
        const showDateDivider =
          index === 0 ||
          new Date(messages[index - 1].timestamp).toDateString() !==
            new Date(message.timestamp).toDateString();

        return (
          <div key={message.id}>
            {showDateDivider && (
              <div className="flex items-center justify-center my-6">
                <div className="px-4 py-1.5 bg-gray-200/70 backdrop-blur-sm rounded-full text-xs font-medium text-gray-600 shadow-sm">
                  {formatDate(message.timestamp)}
                </div>
              </div>
            )}
            <ChatMessageBubble
              message={message}
              isMine={message.senderId === currentUserId}
            />
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}

// 날짜 포맷 헬퍼 함수
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "오늘";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "어제";
  } else {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

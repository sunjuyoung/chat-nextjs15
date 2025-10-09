"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
}

export default function ChatInputForm({
  onSendMessage,
  onTyping,
  disabled = false,
}: ChatInputFormProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");

      // 타이핑 상태 해제
      if (onTyping) {
        onTyping(false);
      }

      // 텍스트 영역 높이 초기화
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // 타이핑 상태 전송
    if (onTyping) {
      onTyping(true);

      // 타이핑 타이머 초기화 및 재설정
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }

    // 자동 높이 조절
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 키로 전송 (Shift+Enter는 줄바꿈)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-lg">
      <form onSubmit={handleSubmit} className="px-4 py-4">
        <div className="flex items-end gap-3">
          {/* 파일 첨부 버튼 */}
          <button
            type="button"
            className="flex-shrink-0 p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
            aria-label="파일 첨부"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* 입력 영역 */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요..."
              disabled={disabled}
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: "48px",
                maxHeight: "150px",
              }}
            />

            {/* 이모지 버튼 (입력 필드 내부 오른쪽) */}
            <button
              type="button"
              className="absolute right-3 bottom-3 p-1.5 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-all duration-200"
              aria-label="이모지"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {/* 전송 버튼 */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`flex-shrink-0 p-3 rounded-full shadow-lg transition-all duration-200 ${
              message.trim() && !disabled
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            aria-label="전송"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* 힌트 텍스트 */}
        <p className="text-xs text-gray-400 mt-2 ml-1">
          Enter를 눌러 전송, Shift+Enter로 줄바꿈
        </p>
      </form>
    </div>
  );
}

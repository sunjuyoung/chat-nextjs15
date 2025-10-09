"use client";

interface ChatTypingIndicatorProps {
  userNames: string[];
}

export default function ChatTypingIndicator({
  userNames,
}: ChatTypingIndicatorProps) {
  const displayText =
    userNames.length === 1
      ? `${userNames[0]}님이 입력 중`
      : userNames.length === 2
      ? `${userNames[0]}님, ${userNames[1]}님이 입력 중`
      : `${userNames[0]}님 외 ${userNames.length - 1}명이 입력 중`;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 animate-fadeIn">
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full">
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </div>
        <span className="ml-2 text-xs font-medium">{displayText}</span>
      </div>
    </div>
  );
}

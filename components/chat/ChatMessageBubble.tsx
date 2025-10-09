import { ChatMessage } from "@/types/chat";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export default function ChatMessageBubble({
  message,
  isMine,
}: ChatMessageBubbleProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  console.log("bubbleMesage", message);

  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      } mb-4 animate-fadeIn`}
    >
      <div
        className={`flex ${
          isMine ? "flex-row-reverse" : "flex-row"
        } items-end gap-2 max-w-[75%]`}
      >
        {/* 아바타 (상대방 메시지에만 표시) */}
        {!isMine && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
            {message.senderName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* 발신자 이름 (상대방 메시지에만 표시) */}
          {!isMine && (
            <span className="text-xs font-medium text-gray-600 px-2">
              {message.senderName}
            </span>
          )}

          {/* 메시지 버블 */}
          <div className="flex items-end gap-2">
            {/* 읽음 표시 및 시간 (내 메시지일 때 왼쪽에) */}
            {isMine && (
              <div className="flex flex-col items-end gap-0.5 mb-1">
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
                <div className="text-blue-500">
                  {message.isRead ? (
                    <CheckCheck className="w-4 h-4" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </div>
              </div>
            )}

            {/* 메시지 내용 */}
            <div
              className={`px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                isMine
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-sm"
                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {/* 시간 (상대방 메시지일 때 오른쪽에) */}
            {!isMine && (
              <span className="text-xs text-gray-500 mb-1">
                {formatTime(message.timestamp)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

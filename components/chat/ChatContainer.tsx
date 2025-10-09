"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInputForm from "@/components/chat/ChatInputForm";
import ChatTypingIndicator from "@/components/chat/ChatTypingIndicator";
import { ChatMessage, ChatUser } from "@/types/chat";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

interface ChatContainerProps {
  roomId: string;
  initialMessages?: ChatMessage[];
}

export default function ChatContainer({
  roomId,
  initialMessages = [],
}: ChatContainerProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const API_SERVER_HOST =
    process.env.API_SERVER_HOST || "http://localhost:8080";

  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return;

    // STOMP 클라이언트 생성
    const socket = new SockJS("http://localhost:8080/connect"); // Spring Boot 서버 주소
    const stompClient = new Client({
      webSocketFactory: () => socket as any,
      debug: (str) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });
    // 연결 성공 시
    stompClient.onConnect = (frame) => {
      console.log("Connected: " + frame);
      setIsConnected(true);

      // 메시지 구독
      stompClient.subscribe("/topic/1", (message: IMessage) => {
        const receivedMessage: ChatMessage = JSON.parse(message.body);
        setMessages((prev) => [...prev, receivedMessage]);
      });

      // 사용자별 개인 메시지 구독 (선택사항)
      // stompClient.subscribe(`/user/queue/private`, (message: IMessage) => {
      //   const receivedMessage: ChatMessage = JSON.parse(message.body);
      //   setMessages((prev) => [...prev, receivedMessage]);
      // });
    };

    // 연결 에러 시
    stompClient.onStompError = (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
      setIsConnected(false);
    };

    // 연결 활성화
    stompClient.activate();
    stompClientRef.current = stompClient;

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [roomId]);

  // 메시지 전송 mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      console.log(content);
      const response = await fetch(`/api/chat/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          senderId: session?.user?.email,
          senderName: session?.user?.name || session?.user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response.json();
    },
    onSuccess: () => {
      // 메시지 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["chatMessages", roomId] });
    },
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !session?.user?.email) return;

    // id: string;
    // roomId: string;
    // senderId: string;
    // senderName: string;
    // senderAvatar?: string;
    // content: string;
    // timestamp: string;
    // isRead: boolean;
    // type: "text" | "image" | "file";
    try {
      console.log(content);

      const chatMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        senderId: session?.user?.email || "",
        senderName: session?.user?.name || session?.user?.email || "",
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "text",
      };

      // 메시지 발행
      stompClientRef.current?.publish({
        destination: "/publish/1", // Spring Controller의 @MessageMapping 경로
        body: JSON.stringify(chatMessage),
      });

      //await sendMessageMutation.mutateAsync(content);
    } catch (error) {
      console.error("Failed to send message:", error);
      // 에러 처리 (토스트 메시지 등)
    }
  };

  const handleTyping = (isTyping: boolean) => {
    setIsTyping(isTyping);
    // 실제로는 WebSocket으로 다른 사용자에게 타이핑 상태 전송
  };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
  //         <p className="mt-4 text-gray-600 font-medium">
  //           채팅을 불러오는 중...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-pink-100">
  //       <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
  //         <div className="text-red-500 text-5xl mb-4">⚠️</div>
  //         <p className="text-red-600 font-semibold text-lg">
  //           채팅을 불러오는데 실패했습니다
  //         </p>
  //         <p className="text-gray-500 mt-2">잠시 후 다시 시도해주세요</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* 헤더 */}
      <ChatHeader roomId={roomId} />

      {/* 메시지 리스트 영역 */}
      <div className="flex-1 overflow-hidden">
        <ChatMessageList
          messages={messages}
          currentUserId={session?.user?.email || ""}
        />
      </div>

      {/* 타이핑 인디케이터 */}
      {typingUsers.length > 0 && (
        <div className="px-6 py-2">
          <ChatTypingIndicator userNames={typingUsers} />
        </div>
      )}

      {/* 입력 폼 */}
      <ChatInputForm
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={sendMessageMutation.isPending}
      />
    </div>
  );
}

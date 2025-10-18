"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ChatHeader from "./ChatHeader";
import ChatMessageList from "@/components/chat/ChatMessageList";
import ChatInputForm from "@/components/chat/ChatInputForm";
import ChatTypingIndicator from "@/components/chat/ChatTypingIndicator";
import RoomListPanel from "@/components/chat/RoomListPanel";
import MemberListPanel from "@/components/chat/MemberListPanel";
import { ChatMessage, ChatUser } from "@/types/chat";
import { IMessage } from "@stomp/stompjs";
import { fetchChatMessages, markAsReadOnEnter } from "@/actions/chatActions";
import { useStompStore } from "@/stores/stompStore";

interface ChatContainerProps {
  roomId: number;
  initialMessages?: ChatMessage[];
}

export default function ChatContainer({
  roomId,
  initialMessages = [],
}: ChatContainerProps) {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showRoomList, setShowRoomList] = useState(false);
  const [showMemberList, setShowMemberList] = useState(false);
  const API_SERVER_HOST =
    process.env.API_SERVER_HOST || "http://localhost:8080";

  const { isConnected, subscribe, unsubscribe, publish } = useStompStore();
  const token = session?.user?.accessToken;
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const subscriptionIdRef = useRef<string>("");

  // 1. 기존 메시지 불러오기
  const {
    data: serverMessages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: () => fetchChatMessages(roomId, token),
    enabled: !!token && !!roomId, // 토큰과 roomId가 있을 때만 실행
    staleTime: 0, // 1분간 fresh 상태 유지
  });

  // 서버 메시지가 로드되면 상태 초기화
  useEffect(() => {
    if (serverMessages.length > 0) {
      setRealtimeMessages([]);
    }
  }, [serverMessages]);

  // 최종 메시지 리스트 = 서버 메시지 + 실시간 메시지
  const messages = [...serverMessages, ...realtimeMessages];

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return;

    // 세션이 로딩 중이거나 인증되지 않았으면 대기
    if (sessionStatus === "loading") {
      console.log("Session is loading...");
      return;
    }

    // 토큰이 없으면 구독하지 않음
    if (!token) {
      console.log("No access token available");
      return;
    }

    // STOMP가 연결되었을 때만 구독
    if (isConnected) {
      console.log("Subscribing to room:", roomId);

      // 메시지 구독
      const subscriptionId = subscribe(
        `/topic/${roomId}`,
        (message: IMessage) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          setRealtimeMessages((prev) => [...prev, receivedMessage]);
          markAsRead(roomId, receivedMessage.id); // 메시지 받으면 자동으로 읽음 처리 API 호출
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      subscriptionIdRef.current = subscriptionId;
      markAsReadOnEnterHandler(roomId, token);
    }

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (subscriptionIdRef.current) {
        console.log("Unsubscribing from room:", roomId);
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = "";
      }
    };
  }, [roomId, token, sessionStatus, isConnected, subscribe, unsubscribe]);

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
  });

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !session?.user?.email) return;

    try {
      const chatMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        senderId: session?.user?.email || "",
        senderName: session?.user?.name || "",
        content,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "text",
      };

      // 메시지 발행
      publish(
        `/publish/${roomId}`, // Spring Controller의 @MessageMapping 경로
        JSON.stringify(chatMessage)
      );

      //메시지 발행이 끝나면 해당 채팅방 메시지 목록과 채팅방 목록 캐시를 무효화
      queryClient.invalidateQueries({ queryKey: ["chatMessages", roomId] });

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

  const handleSelectRoom = (selectedRoomId: number) => {
    router.push(`/chat/room/${selectedRoomId}`);
  };

  // 읽음 처리 함수 (REST API 호출)
  const markAsRead = async (roomId: number, messageId: string) => {
    try {
      //  await axios.post(`/api/chatrooms/${roomId}/read`, { messageId });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // 채팅방 입장 시 읽음 처리
  const markAsReadOnEnterHandler = async (roomId: number, token: string) => {
    try {
      // 마지막 메시지까지 읽음 처리
      console.log("Mark as read on enter:", roomId, token);
      await markAsReadOnEnter(roomId, token);
    } catch (error) {
      console.error("Failed to mark as read on enter:", error);
    }
  };

  const handleStartChat = (userId: string) => {
    console.log("Start chat with:", userId);
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            채팅을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

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
      <ChatHeader
        roomId={roomId}
        onOpenRoomList={() => setShowRoomList(true)}
        onOpenMemberList={() => setShowMemberList(true)}
      />

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

      {/* 방 목록 사이드 패널 */}
      <RoomListPanel
        isOpen={showRoomList}
        onClose={() => setShowRoomList(false)}
        onSelectRoom={handleSelectRoom}
        currentRoomId={roomId}
      />

      {/* 회원 목록 사이드 패널 */}
      <MemberListPanel
        isOpen={showMemberList}
        onClose={() => setShowMemberList(false)}
        onStartChat={handleStartChat}
      />
    </div>
  );
}

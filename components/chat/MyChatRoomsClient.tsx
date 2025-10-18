"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Users, Hash, Plus } from "lucide-react";
import { ChatMessage, ChatRoom } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import CreateRoomModal from "@/components/chat/CreateRoomModal";
import ChatRoomListHeader from "@/components/chat/ChatRoomListHeader";
import { createChatRoom, fetchUserChatRooms } from "@/actions/chatActions";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStompStore } from "@/stores/stompStore";
import { IMessage } from "@stomp/stompjs";

interface MyChatRoomsClientProps {
  initialRooms?: ChatRoom[];
}

export default function MyChatRoomsClient({
  initialRooms = [],
}: MyChatRoomsClientProps) {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const token = session?.user?.accessToken;
  const userId = session?.user?.id;

  // STOMP 연결 상태 확인
  const { isConnected, subscribe, unsubscribe } = useStompStore();
  const subscriptionIdRef = useRef<string>("");

  // 사용자의 채팅방 목록 조회
  const {
    data: rooms = initialRooms,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["userChatRooms", session?.user?.id],
    queryFn: () =>
      fetchUserChatRooms(
        session?.user?.id || "",
        session?.user?.accessToken || ""
      ),
    enabled: !!session?.user?.id, // 세션이 있을 때만 실행
    staleTime: 0, // 1분간 fresh 상태 유지
  });

  const createRoomMutation = useMutation({
    mutationFn: (roomName: string) =>
      createChatRoom(roomName, session?.user?.accessToken || ""),
    onSuccess: (data: { roomId: number }) => {
      router.push(`/chat/room/${data.roomId}`);
      queryClient.invalidateQueries({
        queryKey: ["userChatRooms", session?.user?.id],
      });
    },
    onError: (error: Error) => {
      console.error("Failed to create room:", error);
    },
  });

  // STOMP 연결 상태에 따른 구독 관리
  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window === "undefined") return;

    // 세션이 로딩 중이거나 인증되지 않았으면 대기
    if (sessionStatus === "loading") {
      console.log("Session is loading...");
      return;
    }

    // STOMP가 연결되었을 때만 구독
    if (isConnected) {
      console.log("Subscribing to room:");

      // 메시지 구독
      const subscriptionId = subscribe(
        `/user/2/notifications`,
        (message: IMessage) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          console.log("Received notification:", receivedMessage);

          //query setQueryData
          //receivedMessage.roomId를 찾아서 unreadCount를 1 증가
          //lastMessageContent : receivedMessage.content
          //receivedMessage.roomId number로 변환
          queryClient.setQueryData(
            ["userChatRooms", session?.user?.id],
            (old: ChatRoom[]) => {
              return old.map((room) => {
                if (room.roomId === Number(receivedMessage.roomId)) {
                  return {
                    ...room,
                    unreadCount: room.unreadCount + 1,
                    lastMessageContent: receivedMessage.content,
                  };
                }
                return room;
              });
            }
          );
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      subscriptionIdRef.current = subscriptionId;
    }

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (subscriptionIdRef.current) {
        console.log("Unsubscribing from room:");
        unsubscribe(subscriptionIdRef.current);
        subscriptionIdRef.current = "";
      }
    };
  }, [token, sessionStatus, isConnected, subscribe, unsubscribe]);

  // 세션이 로딩 중이거나 인증되지 않았으면 대기
  if (sessionStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (isPending && initialRooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">채팅방 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <MessageSquare className="w-16 h-16 mx-auto mb-2" />
          </div>
          <p className="text-red-600 font-medium">
            채팅방 목록을 불러오는데 실패했습니다
          </p>
          <p className="text-gray-500 text-sm mt-2">{error?.message}</p>
        </div>
      </div>
    );
  }

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

  const handleRoomClick = (roomId: number) => {
    router.push(`/chat/room/${roomId}`);
  };

  const handleCreateRoom = async (roomName: string) => {
    createRoomMutation.mutate(roomName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* 헤더 */}
      <ChatRoomListHeader
        roomCount={rooms?.length || 0}
        onCreateRoom={() => setIsCreateModalOpen(true)}
        title="내 채팅방"
      />

      {/* 채팅방 목록 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {!rooms || rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageSquare className="w-20 h-20 mb-6 text-gray-300" />
            <p className="text-xl font-medium text-gray-500 mb-2">
              참여한 채팅방이 없습니다
            </p>
            <p className="text-sm text-gray-400 mb-6">
              새 채팅방을 만들어 대화를 시작해보세요
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">새 채팅방 만들기</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {rooms.map((room: ChatRoom) => (
              <button
                key={room.roomId}
                onClick={() => handleRoomClick(room.roomId)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 text-left border border-gray-100 hover:border-blue-200 group"
              >
                <div className="flex items-start space-x-4">
                  {/* 아이콘 */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                    <Hash className="w-7 h-7 text-white" />
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {room.roomName}
                      </h3>
                      {room.lastMessageCreatedAt && (
                        <span className="text-xs text-gray-500 ml-3 flex-shrink-0">
                          {formatTime(room.lastMessageCreatedAt)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between mb-3">
                      {room.lastMessageContent ? (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 mb-1">
                            <span className="font-medium text-gray-700">
                              {room.lastMessageSenderName}
                            </span>
                            :{" "}
                            <span className="text-gray-600">
                              {room.lastMessageContent}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          메시지가 없습니다
                        </p>
                      )}

                      {room.unreadCount > 0 && (
                        <span className="ml-3 flex-shrink-0 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full min-w-[24px] text-center shadow-sm">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* 하단 정보 */}
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      <span>{room.memberCount}명 참여중</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 채팅방 생성 모달 */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}

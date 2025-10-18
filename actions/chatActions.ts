const API_SERVER_HOST =
  process.env.NEXT_PUBLIC_API_SERVER_HOST || "http://localhost:8080";

/**
 * 메시지 읽음 처리
 * @param roomId 채팅방 ID
 * @param messageId 메시지 ID
 * @param accessToken 액세스 토큰
 */
export const markAsRead = async (
  roomId: number,
  messageId: string,
  accessToken: string
) => {
  try {
    const response = await fetch(
      `${API_SERVER_HOST}/api/chat-rooms/${roomId}/read`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ messageId }),
      }
    );
  } catch (error) {
    console.error("Error marking as read:", error);
    throw error;
  }
};

/**
 * 채팅방 입장 시 이전 메세지 모두 읽음 처리
 * @param roomId 채팅방 ID
 * @param accessToken 액세스 토큰
 */
export const markAsReadOnEnter = async (
  roomId: number,
  accessToken: string
) => {
  try {
    const response = await fetch(
      `${API_SERVER_HOST}/chat/room/${roomId}/read-all`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (error) {
    console.error("Error marking as read on enter:", error);
    throw error;
  }
};

/**
 * 채팅방 메시지 조회
 * @param roomId 채팅방 ID
 * @param accessToken 액세스 토큰
 */
export const fetchChatMessages = async (
  roomId: number,
  accessToken?: string
) => {
  try {
    const response = await fetch(
      `${API_SERVER_HOST}/api/chat-rooms/history/${roomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chat messages");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

/**
 * 전체 채팅방 목록조회
 * 커서기반 두번째 페이지붜 lastChatRoomId 전달 된다 , 첫번째는 null
 */
export const fetchAllChatRooms = async (
  lastChatRoomId: number | null,
  accessToken?: string
) => {
  try {
    //lastChatRoomId 가 null일 경우 lastChatRoomId 보내지 않는다.
    const url = lastChatRoomId
      ? `${API_SERVER_HOST}/api/chat-rooms/all?lastChatRoomId=${lastChatRoomId}`
      : `${API_SERVER_HOST}/api/chat-rooms/all`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch all chat rooms");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching all chat rooms:", error);
    throw error;
  }
};

/**
 * 사용자 채팅방 목록 조회
 * @param userId 사용자 ID
 * @param accessToken 액세스 토큰
 */
export const fetchUserChatRooms = async (
  userId: string,
  accessToken?: string
) => {
  try {
    const response = await fetch(
      `${API_SERVER_HOST}/api/chat-rooms?memberId=${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chat rooms");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};

/**
 * 채팅방 생성
 * @param roomName 채팅방 이름
 * @param accessToken 액세스 토큰
 */
export const createChatRoom = async (roomName: string, accessToken: string) => {
  try {
    const response = await fetch(`${API_SERVER_HOST}/chat/room/group/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: roomName }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat room");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

export const fetchChatRoomById = async (
  roomId: number,
  accessToken: string
) => {
  try {
    const response = await fetch(
      `${API_SERVER_HOST}/api/chat-rooms/${roomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch chat room");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching chat room:", error);
    throw error;
  }
};

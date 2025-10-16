const API_SERVER_HOST =
  process.env.NEXT_PUBLIC_API_SERVER_HOST || "http://localhost:8080";

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

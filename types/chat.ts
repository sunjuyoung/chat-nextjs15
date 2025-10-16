// 채팅 메시지 인터페이스
export interface ChatMessage {
  id: string;
  roomId: number;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: "text" | "image" | "file";
}

// 채팅방 인터페이스
export interface ChatRoom {
  roomId: number;
  roomName: string;
  memberCount: number;
  lastMessageId: number;
  lastMessageSenderName: string;
  lastMessageContent: string;
  lastMessageCreatedAt: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// 채팅 사용자 인터페이스
export interface ChatUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

// 타이핑 상태 인터페이스
export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ChatMessage } from "@/types/chat";

// 메모리 내 메시지 저장소 (실제로는 데이터베이스 사용)
const messageStore: { [roomId: string]: ChatMessage[] } = {
  "demo-room-1": [
    {
      id: "1",
      roomId: "demo-room-1",
      senderId: "demo@example.com",
      senderName: "데모 사용자",
      content: "안녕하세요! 채팅 시스템에 오신 것을 환영합니다 👋",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "2",
      roomId: "demo-room-1",
      senderId: "demo@example.com",
      senderName: "데모 사용자",
      content: "이것은 모던한 채팅 UI의 데모입니다.",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      isRead: true,
      type: "text",
    },
    {
      id: "3",
      roomId: "demo-room-1",
      senderId: "system",
      senderName: "시스템",
      content: "실시간 메시지 전송을 테스트해보세요!",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      isRead: false,
      type: "text",
    },
  ],
};

// GET: 메시지 목록 가져오기
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;

    // 해당 방의 메시지 가져오기
    const messages = messageStore[roomId] || [];

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST: 새 메시지 전송
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = await params;
    const body = await request.json();
    const { content, senderId, senderName } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    // 새 메시지 생성
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      roomId,
      senderId: senderId || session.user?.email || "anonymous",
      senderName: senderName || session.user?.name || "익명",
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
      type: "text",
    };

    // 메시지 저장
    if (!messageStore[roomId]) {
      messageStore[roomId] = [];
    }
    messageStore[roomId].push(newMessage);

    // 자동 응답 시뮬레이션 (데모용)
    setTimeout(() => {
      const autoReply: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomId,
        senderId: "bot",
        senderName: "챗봇",
        content: `"${content.substring(0, 30)}${
          content.length > 30 ? "..." : ""
        }" 메시지를 잘 받았습니다! 👍`,
        timestamp: new Date().toISOString(),
        isRead: false,
        type: "text",
      };
      messageStore[roomId].push(autoReply);
    }, 2000);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

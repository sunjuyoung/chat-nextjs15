import ChatContainer from "@/components/chat/ChatContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ChatMessage } from "@/types/chat";

interface ChatRoomPageProps {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  // 인증 확인
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/signin");
  }

  const { roomId } = await params;

  let initialMessages: ChatMessage[] = [];

  return (
    <div className="h-screen">
      <ChatContainer
        roomId={parseInt(roomId)}
        initialMessages={initialMessages}
      />
    </div>
  );
}

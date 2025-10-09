import ChatContainer from "@/components/chat/ChatContainer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ChatMessage } from "@/types/chat";

export default async function ChatPage() {
  // 인증 확인
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/signin");
  }

  // 실제로는 URL에서 roomId를 가져오거나 목록에서 선택
  const roomId = "1";

  // 초기 메시지 로드 (선택사항 - 빠른 초기 렌더링을 위해)
  let initialMessages: ChatMessage[] = [];
  // try {
  //   const res = await fetch(`http://localhost:3000/api/chat/${roomId}`, {
  //     cache: "no-store",
  //   });
  //   if (res.ok) {
  //     initialMessages = await res.json();
  //   }
  // } catch (error) {
  //   console.error("Failed to fetch initial messages:", error);
  //   // 에러가 발생해도 계속 진행 (클라이언트에서 다시 시도)
  // }

  return (
    <div className="h-screen">
      <ChatContainer roomId={roomId} initialMessages={initialMessages} />
    </div>
  );
}

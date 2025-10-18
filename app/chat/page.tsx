import ChatRoomList from "@/components/chat/ChatRoomList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { fetchUserChatRooms } from "@/actions/chatActions";
import { useStompNotifications } from "@/hook/useStompNotifications";

export default async function ChatPage() {
  // 인증 확인
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/account/signin");
  }

  return <ChatRoomList />;
}

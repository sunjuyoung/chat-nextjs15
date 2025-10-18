import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchUserChatRooms } from "@/actions/chatActions";
import MyChatRoomsClient from "@/components/chat/MyChatRoomsClient";
import { redirect } from "next/navigation";

export default async function MyChatRoomsPage() {
  // 서버에서 세션 확인
  const session = await getServerSession(authOptions);

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!session?.user?.id) {
    redirect("/account/signin");
  }

  return <MyChatRoomsClient />;
}

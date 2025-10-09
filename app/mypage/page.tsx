import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import MypageCartListComponent from "@/components/mypage/mypageCartListComponent";

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div>My Page </div>

      {!session && <div>로그인 필요</div>}

      {session && (
        <div>
          <div>이미 로그인 된 사용자</div>
          <MypageCartListComponent />
        </div>
      )}
    </div>
  );
}

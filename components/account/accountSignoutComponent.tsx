"use client";

import { signOut, useSession } from "next-auth/react";

export default function AccountSignoutComponent() {
  //localhost:8080/api/members/logout post 요청
  const { data: session } = useSession();

  const handleSignOut = async () => {
    console.log("가즈야!!!!!!!!");
    try {
      await fetch("http://localhost:8080/api/members/logout", {
        method: "POST",
        body: JSON.stringify({
          accessToken: session?.user?.accessToken || "",
          refreshToken: session?.user?.refreshToken || "",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await signOut({
        callbackUrl: "/",
        redirect: false,
      });
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 font-medium"
    >
      로그아웃
    </button>
  );
}

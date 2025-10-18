"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useStompStore } from "@/stores/stompStore";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const { connect, disconnect, isConnected } = useStompStore();

  useEffect(() => {
    // 세션이 로딩 중이거나 인증되지 않았으면 대기
    if (sessionStatus === "loading") {
      return;
    }

    // 토큰이 있으면 STOMP 연결
    if (session?.user?.accessToken) {
      console.log("Connecting to STOMP...");
      connect(session.user.accessToken);
    } else {
      // 토큰이 없으면 연결 해제
      if (isConnected) {
        console.log("Disconnecting from STOMP...");
        disconnect();
      }
    }

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      if (isConnected) {
        console.log("Chat layout unmounting, disconnecting STOMP...");
        disconnect();
      }
    };
  }, [
    session?.user?.accessToken,
    sessionStatus,
    connect,
    disconnect,
    isConnected,
  ]);

  return <div className="min-h-screen">{children}</div>;
}

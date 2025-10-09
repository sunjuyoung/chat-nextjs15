"use client";

import { putAccount } from "@/actions/accountActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function AccountModifyComponent() {
  const { data: session, status: sessionStatus, update } = useSession();
  const { email, name } = session?.user || {};
  const router = useRouter();

  const [state, action, isPending] = useActionState(putAccount, {
    message: "",
    result: "",
    nickname: "",
  });

  useEffect(() => {
    if (state.result === "success") {
      update({
        ...session,
        user: {
          ...session?.user,
          name: state.nickname,
        },
      });
    }
  }, [state.result, state.nickname, session, update]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      alert("로그인이 필요합니다.");
      router.push("/account/signin");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          계정 정보 수정
        </h1>

        {/* 메시지 표시 */}
        {state.message && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {state.message}
          </div>
        )}

        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={email || ""}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              defaultValue={name || ""}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="닉네임을 입력하세요"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              새 비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>

          <div className="pt-2">
            {isPending ? (
              <div className="w-full py-2 text-center text-white bg-blue-400 rounded-md transition-colors duration-200">
                저장 중...
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                계정 정보 저장하기
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

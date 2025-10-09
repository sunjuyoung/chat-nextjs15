"use client";

import { postProduct } from "@/actions/productActions";
import { useAuthCheck } from "@/hook/useAuthCheck";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function ProductAddComponent() {
  const [state, action, isPending] = useActionState(postProduct, {
    message: "",
    result: "",
  });

  const { session, sessionStatus } = useAuthCheck();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          새 상품 등록하기
        </h1>

        {/* 메시지 표시 */}
        {state.result === "success" && (
          <div
            onClick={() => router.push("/product/catalog/1")}
            className="p-3 text-sm text-blue-700 bg-red-100 rounded-lg"
          >
            새로운 상품이 등록되었습니다.
          </div>
        )}

        <form action={action} className="space-y-4">
          <div>
            <label
              htmlFor="pname"
              className="block text-sm font-medium text-gray-700"
            >
              상품 이름
            </label>
            <input
              type="text"
              id="pname"
              name="pname"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="상품 이름을 입력하세요"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              상품 가격
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="숫자만 입력하세요"
            />
          </div>
          <div>
            <label
              htmlFor="files"
              className="block text-sm font-medium text-gray-700"
            >
              상품 이미지
            </label>
            <input
              type="file"
              id="files"
              name="files"
              multiple
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label
              htmlFor="writer"
              className="block text-sm font-medium text-gray-700"
            >
              작성자{" "}
            </label>
            <input
              type="text"
              id="writer"
              name="writer"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              defaultValue={session?.user?.email || ""}
            />
          </div>

          <input type="hidden" name="sale" value="true" />
          <div className="pt-2">
            {isPending ? (
              <div className="w-full py-2 text-center text-white bg-blue-400 rounded-md transition-colors duration-200">
                처리 중...
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                상품 등록하기
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

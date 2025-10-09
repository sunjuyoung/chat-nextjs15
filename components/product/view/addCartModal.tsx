"use client";

export default function AddCartModal({
  closeModal,
}: {
  closeModal: (cmd: string) => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800/75 z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <p className="text-lg font-semibold text-gray-800 mb-4">
          상품을 장바구니에 추가합니다.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={() => closeModal("c")}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          >
            쇼핑 계속
          </button>
          <button
            onClick={() => closeModal("m")}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            장바구니 이동
          </button>
        </div>
      </div>
    </div>
  );
}

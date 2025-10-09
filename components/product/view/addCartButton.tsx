"use client";

import { useAuthCheck } from "@/hook/useAuthCheck";
import { useState } from "react";
import AddCartModal from "./addCartModal";
//import { mutate } from "swr";
import { useRouter } from "next/navigation";

export default function AddCartButton({ pno }: { pno: number }) {
  const { session, sessionStatus } = useAuthCheck();
  const router = useRouter();

  const handleClickAdd = async (e: React.MouseEvent) => {
    const param = {
      account: session?.user?.email,
      pno: pno,
      quantity: 1,
    };

    const res = await fetch("/api/cart/change", {
      method: "POST",
      body: JSON.stringify(param),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    console.log(result);

    setShow(() => true);

    // mutate("/api/cart/list");
  };

  const [show, setShow] = useState(false);

  const closeModal = (value: string) => {
    setShow(() => false);
    if (value === "c") {
      setShow(() => false);
    } else if (value === "m") {
      router.push(`/mypage`);
    }
    setShow(() => false);
  };

  return (
    <div className="pt-4">
      {show && <AddCartModal closeModal={closeModal}></AddCartModal>}

      {session?.user && (
        <button
          onClick={handleClickAdd}
          className="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
        >
          구매하기
        </button>
      )}
    </div>
  );
}

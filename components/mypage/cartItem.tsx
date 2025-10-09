"use client";

import { useAuthCheck } from "@/hook/useAuthCheck";
import { CartItemDTO } from "@/types/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

export default function CartItem({ cartItem }: { cartItem: CartItemDTO }) {
  const { session } = useAuthCheck();

  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: async (param: {
      account: string | null | undefined;
      pno: number;
      quantity: number;
    }) => {
      const res = await fetch("/api/cart/change", {
        method: "POST",
        body: JSON.stringify(param),
        headers: { "Content-Type": "application/json" },
      });
      return res.json();
    },
    onSuccess: () => {
      // 장바구니 목록 캐시를 무효화 → 자동 refetch
      queryClient.invalidateQueries({ queryKey: ["cartList"] });

      // 장바구니 개수도 같이 업데이트
      // queryClient.invalidateQueries({ queryKey: ['cartCount'] });
    },

    onError: (error) => {
      console.error("Error changing cart quantity:", error);
    },
  });

  const handleClickQty = async (amount: number) => {
    const param = {
      account: session?.user?.email,
      pno: cartItem.pno,
      quantity: amount,
    };

    addMutation.mutate(param);
  };

  return (
    <li key={cartItem.cno} className="border-2 p-1 m-1">
      <div>CNO: {cartItem.cno}</div>
      <div>PNO: {cartItem.pno}</div>
      <div>PNAME: {cartItem.pname}</div>
      <div>PRICE: {cartItem.price}</div>
      <div>QTY: {cartItem.quantity}</div>
      <div>
        <Image
          src={`http://localhost:8080/s_${cartItem.fileName}`}
          alt={cartItem.pname}
          width={100} // Add the width here
          height={100} // Add the height here
          priority
        />
      </div>
      <div className="text-3xl ">
        <button
          onClick={() => handleClickQty(1)}
          className="m-2 p-2 bg-blue-500"
        >
          +
        </button>
        <button
          onClick={() => handleClickQty(-1)}
          className="m-2 p-2 bg-red-500"
        >
          -
        </button>
      </div>
    </li>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import CartItem from "./cartItem";
import { CartItemDTO } from "@/types/cart";

export default function MypageCartListComponent() {
  const {
    data: cartItems,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cartList"],
    queryFn: () => fetch("/api/cart/list").then((res) => res.json()),
    staleTime: 0,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div>
        <div>Cart Items {cartItems.length}</div>
        <ul>
          {cartItems?.map((cartItem: CartItemDTO, index: number) => (
            <CartItem cartItem={cartItem} key={index}></CartItem>
          ))}
        </ul>
      </div>
    </div>
  );
}

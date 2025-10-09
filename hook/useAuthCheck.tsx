import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthCheck = () => {
  const { data: session, status: sessionStatus } = useSession();

  return { session, sessionStatus };
};

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    console.log(token);
    console.log(path);
    console.log("---------------------middleware---------------");

    // 토큰 재발급 실패 시 signout 페이지로 리다이렉트
    if (token?.error === "RefreshAccessTokenError") {
      console.log("Token refresh error detected, redirecting to signout");
      return NextResponse.redirect(new URL("/account/signout", req.url));
    }

    // // 역할 기반 접근 제어
    // if (path.startsWith("/admin") && token?.role !== "ADMIN") {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // 토큰이 없거나 에러가 있으면 인증 실패로 처리
        return !!token && token.error !== "RefreshAccessTokenError";
      },
    },
    pages: {
      signIn: "/account/signin",
      signOut: "/account/signout",
    },
  }
);

export const config = {
  matcher: ["/mypage/:path*"],
};

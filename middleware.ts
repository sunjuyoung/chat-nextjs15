import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    console.log(token);
    console.log(path);
    console.log("---------------------middleware---------------");

    // // 역할 기반 접근 제어
    // if (path.startsWith("/admin") && token?.role !== "ADMIN") {
    //   return NextResponse.redirect(new URL("/", req.url));
    // }

    // return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/account/signin",
    },
  }
);

export const config = {
  matcher: ["/mypage/:path*"],
};

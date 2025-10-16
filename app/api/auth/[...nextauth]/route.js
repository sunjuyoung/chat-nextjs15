import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetch("http://localhost:8080/api/members/signin", {
          method: "POST",
          body: JSON.stringify({
            email: credentials.username,
            password: credentials.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        //console.log(result);

        if (res.ok && result) {
          return result.data;
        }

        return null;
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      console.log("jwt callback");
      //kakao
      if (account?.provider === "kakao" && profile) {
        console.log("jwt callback kakao");
        const res = await fetch("http://localhost:8080/api/accounts/social", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-store",
          },
          body: new URLSearchParams({ email: profile.kakao_account.email }),
        });

        const result = await res.json();

        token.id = result.email;
        token.role = result.role;
        token.email = result.email;
        token.name = result.nickname;

        token.accessToken = result.accessToken;
        token.refreshToken = result.refreshToken;
        token.accessTokenExpires = Date.now() + 1000 * 60 * 10; //10m

        return token;
      }

      //자체 로그인
      if (account?.provider === "credentials") {
        if (user) {
          console.log("jwt callback credentials");
          // 자체 로그인 사용자만 user 객체를 전달받습니다.
          token.id = user.id;
          token.role = user.role; // 예를 들어, 사용자의 역할(Role)을 JWT에 포함
          token.email = user.email;
          token.name = user.name;

          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.accessTokenExpires = Date.now() + 1000 * 60 * 10; //10m
        }
      }

      // ⭐ 새로 추가: update() 호출 시 처리
      if (trigger === "update" && session) {
        // 클라이언트에서 전달한 새 정보로 토큰 갱신
        if (session.user.name) {
          token.name = session.user.name;
        }
        // 필요하면 다른 필드도 갱신

        return token;
      }

      //토큰 만료전
      if (token.accessTokenExpires > Date.now()) {
        return token;
      }

      //토큰 만료 후
      return refreshAccessToken(token);
    },

    async session({ session, user, token }) {
      console.log("session callback");

      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;

      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;
      return session;
    },
  },
  pages: {
    signIn: "/account/signin",
    signOut: "/account/signout",
    // error:"/account/error",
    // verifyRequest:"/account/verify-request",
    // newUser:"/account/new-user",
  },
};

async function refreshAccessToken(token) {
  console.log("refreshAccessToken");
  try {
    const res = await fetch("http://localhost:8080/api/members/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken: token.refreshToken }),
      headers: { "Content-Type": "application/json" },
    });

    const refreshedUser = await res.json();
    if (!res.ok) {
      throw new Error("Failed to refresh token");
    }

    token.accessToken = refreshedUser.data.accessToken;
    token.refreshToken = refreshedUser.data.refreshToken;

    token.accessTokenExpires = Date.now() + 60 * 10 * 1000; //10m
    return token;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

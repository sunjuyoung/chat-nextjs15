export interface AccountDTO {
  email: string;
  password?: string;
  nickname: string;
  role: string;
  accessToken?: string; // 토큰은 로그인 후에만 존재하므로 선택적 속성으로 설정
  refreshToken?: string;
  joinDate: string; // @JsonFormat에 맞게 string으로 변환
  modifiedDate: string; // @JsonFormat에 맞게 string으로 변환
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
}

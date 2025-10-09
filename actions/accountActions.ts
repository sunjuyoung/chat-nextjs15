const API_SERVER_HOST = process.env.API_SERVER_HOST || "http://localhost:8080";

export const signupAccount = async (prevState: any, formData: FormData) => {
  try {
    const res = await fetch(`${API_SERVER_HOST}/api/members/signup`, {
      method: "POST",
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
        //    name: formData.get("nickname"),
        email: formData.get("email"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        message: errorData.message || "회원가입에 실패했습니다.",
        result: "error",
      };
    }

    const result = await res.json();

    return {
      message: "회원가입이 완료되었습니다.",
      result: "success",
      data: result,
    };
  } catch (error) {
    return {
      message: "서버 연결에 실패했습니다.",
      result: "error",
    };
  }
};

export const putAccount = async (prevState: any, formData: FormData) => {
  const res = await fetch(`${API_SERVER_HOST}/api/accounts/modify`, {
    method: "PUT",
    body: formData,
  });

  const result = await res.json();

  return {
    message: "Account modified successfully",
    result: "success",
    nickname: result.nickname,
  };
};

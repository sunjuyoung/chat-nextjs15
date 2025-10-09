"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signupAccount } from "@/actions/accountActions";

export default function AccountSignupComponent() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // 이메일 검증
    if (!formData.email) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 사용자명 검증
    if (!formData.username) {
      errors.username = "사용자명을 입력해주세요.";
    } else if (formData.username.length < 4) {
      errors.username = "사용자명은 최소 4자 이상이어야 합니다.";
    }

    // 닉네임 검증
    if (!formData.nickname) {
      errors.nickname = "닉네임을 입력해주세요.";
    } else if (formData.nickname.length < 2) {
      errors.nickname = "닉네임은 최소 2자 이상이어야 합니다.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      errors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 4) {
      errors.password = "비밀번호는 최소 4자 이상이어야 합니다.";
      // } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      //   errors.password = "비밀번호는 영문과 숫자를 포함해야 합니다.";
    }

    // 비밀번호 확인 검증
    if (!formData.passwordConfirm) {
      errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 제거
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("nickname", formData.nickname);
      formDataToSend.append("email", formData.email);

      const result = await signupAccount(null, formDataToSend);

      if (result.result === "success") {
        // 회원가입 성공 시 로그인 페이지로 리다이렉트
        alert("회원가입이 완료되었습니다. 로그인해주세요.");
        router.push("/account/signin");
      } else {
        setError(result.message || "회원가입 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">회원가입</h1>
          <p className="text-sm text-gray-600">
            새로운 계정을 만들어 서비스를 이용해보세요
          </p>
        </div>

        {/* 전체 에러 메시지 표시 */}
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이메일 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="example@email.com"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          {/* 사용자명 */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              사용자명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.username ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="사용자명 (최소 4자)"
              disabled={isLoading}
            />
            {fieldErrors.username && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.nickname ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="닉네임 (최소 2자)"
              disabled={isLoading}
            />
            {fieldErrors.nickname && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.nickname}
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="비밀번호 (최소 8자, 영문+숫자)"
              disabled={isLoading}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                fieldErrors.passwordConfirm
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={isLoading}
            />
            {fieldErrors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.passwordConfirm}
              </p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="pt-2">
            {isLoading ? (
              <div className="w-full py-2 text-center text-white bg-blue-400 rounded-md transition-colors duration-200">
                가입 중...
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                회원가입
              </button>
            )}
          </div>
        </form>

        {/* 로그인 링크 */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{" "}
            <a
              href="/account/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              로그인
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

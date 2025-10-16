"use client";

import { useState, FormEvent } from "react";
import { X, Hash, Loader2 } from "lucide-react";

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (roomName: string) => void | Promise<void>;
}

export default function CreateRoomModal({
  isOpen,
  onClose,
  onCreateRoom,
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!roomName.trim()) {
      setError("채팅방 이름을 입력해주세요");
      return;
    }

    if (roomName.trim().length < 2) {
      setError("채팅방 이름은 최소 2글자 이상이어야 합니다");
      return;
    }

    if (roomName.trim().length > 50) {
      setError("채팅방 이름은 50글자를 초과할 수 없습니다");
      return;
    }

    try {
      setIsLoading(true);
      await onCreateRoom(roomName.trim());

      // 성공 시 초기화 및 닫기
      setRoomName("");
      onClose();
    } catch (err) {
      setError("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
      console.error("Failed to create room:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRoomName("");
      setError("");
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {/* 오버레이 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn"
        onClick={handleOverlayClick}
      >
        {/* 모달 */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-slideUp">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Hash className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                새 채팅방 만들기
              </h2>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
              aria-label="닫기"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* 본문 */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              <div className="mb-2">
                <label
                  htmlFor="roomName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  채팅방 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="roomName"
                  value={roomName}
                  onChange={(e) => {
                    setRoomName(e.target.value);
                    setError("");
                  }}
                  placeholder="예: 프로젝트 팀 회의"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  autoFocus
                  maxLength={50}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    채팅방 이름은 나중에 변경할 수 있습니다
                  </p>
                  <span className="text-xs text-gray-400">
                    {roomName.length}/50
                  </span>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 bg-gray-50 rounded-b-2xl">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isLoading || !roomName.trim()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>생성 중...</span>
                  </>
                ) : (
                  <span>채팅방 만들기</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

# 채팅 컴포넌트 가이드

## 📁 컴포넌트 구조

```
components/chat/
├── ChatContainer.tsx          # 메인 컨테이너 (상태 관리)
├── ChatHeader.tsx             # 헤더 (사용자 정보, 뒤로가기)
├── ChatMessageList.tsx        # 메시지 목록 (자동 스크롤)
├── ChatMessageBubble.tsx      # 개별 메시지 버블
├── ChatInputForm.tsx          # 입력 폼 (전송 버튼)
└── ChatTypingIndicator.tsx    # 타이핑 인디케이터

app/chat/
└── page.tsx                   # 채팅 페이지

app/api/chat/
└── [roomId]/
    └── route.ts              # 채팅 API (GET/POST)

types/
└── chat.ts                   # 타입 정의
```

## 🎨 주요 기능

### 1. **ChatContainer** (Client Component)

- 전체 채팅 상태 관리
- React Query를 사용한 메시지 폴링 (3초마다)
- 메시지 전송 mutation
- 타이핑 상태 관리

### 2. **ChatHeader** (Client Component)

- 채팅방 정보 표시
- 사용자 온라인 상태 표시
- 뒤로가기 버튼

### 3. **ChatMessageList** (Client Component)

- 메시지 목록 렌더링
- 자동 스크롤 (새 메시지 도착 시)
- 날짜 구분선 표시
- 빈 상태 UI

### 4. **ChatMessageBubble** (Server Component)

- 본인/상대방 메시지 구분
- 읽음 표시 (체크마크)
- 타임스탬프 표시
- 발신자 아바타

### 5. **ChatInputForm** (Client Component)

- 텍스트 입력 및 전송
- Enter 키 전송 (Shift+Enter 줄바꿈)
- 자동 높이 조절
- 타이핑 상태 전송
- 파일 첨부 버튼 (준비됨)
- 이모지 버튼 (준비됨)

### 6. **ChatTypingIndicator** (Client Component)

- 타이핑 중인 사용자 표시
- 애니메이션 효과

## 🚀 사용 방법

### 기본 사용

```tsx
// app/chat/page.tsx
import ChatContainer from "@/components/chat/ChatContainer";

export default function ChatPage() {
  const roomId = "demo-room-1";

  return (
    <div className="h-screen">
      <ChatContainer roomId={roomId} />
    </div>
  );
}
```

### Props

```typescript
interface ChatContainerProps {
  roomId: string; // 채팅방 ID
  initialMessages?: ChatMessage[]; // 초기 메시지 (SSR용)
}
```

## 🎯 API 엔드포인트

### GET `/api/chat/[roomId]`

메시지 목록 가져오기

**Response:**

```json
[
  {
    "id": "msg-123",
    "roomId": "demo-room-1",
    "senderId": "user@example.com",
    "senderName": "사용자",
    "content": "안녕하세요",
    "timestamp": "2025-10-09T10:00:00Z",
    "isRead": true,
    "type": "text"
  }
]
```

### POST `/api/chat/[roomId]`

새 메시지 전송

**Request:**

```json
{
  "content": "메시지 내용",
  "senderId": "user@example.com",
  "senderName": "사용자"
}
```

**Response:**

```json
{
  "id": "msg-124",
  "roomId": "demo-room-1",
  "senderId": "user@example.com",
  "senderName": "사용자",
  "content": "메시지 내용",
  "timestamp": "2025-10-09T10:01:00Z",
  "isRead": false,
  "type": "text"
}
```

## 🎨 디자인 특징

### 색상 팔레트

- **본인 메시지**: 파란색 그라데이션 (`from-blue-500 to-blue-600`)
- **상대방 메시지**: 흰색 배경 + 회색 테두리
- **배경**: 부드러운 그라데이션 (`from-gray-50 via-blue-50 to-indigo-50`)

### 애니메이션

- 메시지 등장: `fadeIn` (300ms ease-out)
- 타이핑 인디케이터: `bounce` 애니메이션
- 버튼 호버: `scale-105`, `shadow-xl`

### 반응형 디자인

- 모바일 우선 설계
- 메시지 버블: 최대 75% 너비
- 입력창: 자동 높이 조절 (최대 150px)

## 🔧 커스터마이징

### 메시지 폴링 간격 변경

```tsx
// components/chat/ChatContainer.tsx
const { data: messages } = useQuery({
  queryKey: ["chatMessages", roomId],
  queryFn: () => fetch(`/api/chat/${roomId}`).then((res) => res.json()),
  refetchInterval: 5000, // 5초로 변경
});
```

### WebSocket으로 전환

현재는 폴링 방식이지만, WebSocket으로 전환하려면:

1. STOMP 클라이언트 설정
2. `refetchInterval` 제거
3. WebSocket 메시지 리스너 추가

```tsx
useEffect(() => {
  const stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws",
    onConnect: () => {
      stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
        // 메시지 수신 처리
        queryClient.invalidateQueries(["chatMessages", roomId]);
      });
    },
  });

  stompClient.activate();
  return () => stompClient.deactivate();
}, [roomId]);
```

## 📱 테스트 방법

1. 개발 서버 실행:

```bash
npm run dev
```

2. 채팅 페이지 접속:

```
http://localhost:3000/chat
```

3. 메시지 전송 테스트
   - 텍스트 입력 후 Enter 또는 전송 버튼 클릭
   - 2초 후 자동 응답 수신

## 🔐 인증

- NextAuth를 사용한 세션 기반 인증
- 로그인하지 않은 경우 `/account/signin`으로 리다이렉트
- 세션에서 사용자 정보 자동 추출

## 🚧 향후 개선사항

- [ ] WebSocket 실시간 통신
- [ ] 파일 업로드 기능
- [ ] 이미지 프리뷰
- [ ] 이모지 선택기
- [ ] 메시지 검색
- [ ] 메시지 삭제/수정
- [ ] 읽음 상태 동기화
- [ ] 무한 스크롤 (페이지네이션)
- [ ] 알림 기능
- [ ] 다크 모드

## 📦 의존성

```json
{
  "next": "15.5.4",
  "react": "19.1.0",
  "next-auth": "^4.24.11",
  "@tanstack/react-query": "^5.90.2",
  "lucide-react": "latest"
}
```

## 💡 팁

1. **성능 최적화**: 메시지가 많아지면 가상 스크롤 라이브러리 고려
2. **오프라인 지원**: Service Worker와 IndexedDB 활용
3. **보안**: XSS 방지를 위해 메시지 내용 sanitize
4. **접근성**: ARIA 레이블과 키보드 네비게이션 개선

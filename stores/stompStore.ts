import { create } from "zustand";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface StompState {
  stompClient: Client | null;
  isConnected: boolean;
  subscriptions: Map<string, any>;
  connect: (token: string) => void;
  disconnect: () => void;
  subscribe: (
    destination: string,
    callback: (message: IMessage) => void,
    headers?: any
  ) => string;
  unsubscribe: (subscriptionId: string) => void;
  publish: (destination: string, body: string, headers?: any) => void;
}

export const useStompStore = create<StompState>((set, get) => ({
  stompClient: null,
  isConnected: false,
  subscriptions: new Map(),

  connect: (token: string) => {
    const { stompClient, isConnected } = get();

    // 이미 연결되어 있으면 중복 연결 방지
    if (isConnected && stompClient) {
      console.log("STOMP already connected");
      return;
    }

    // 기존 연결이 있으면 정리
    if (stompClient) {
      stompClient.deactivate();
    }

    // STOMP 클라이언트 생성
    const socket = new SockJS("http://localhost:8080/connect");
    const client = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 연결 성공 시
    client.onConnect = (frame) => {
      console.log("STOMP Connected:", frame);
      set({ isConnected: true });
    };

    // 연결 에러 시
    client.onStompError = (frame) => {
      console.error("STOMP Error:", frame);
      set({ isConnected: false });
    };

    // 연결 끊김 시
    client.onDisconnect = () => {
      console.log("STOMP Disconnected");
      set({ isConnected: false, subscriptions: new Map() });
    };

    // 연결 활성화
    client.activate();
    set({ stompClient: client });
  },

  disconnect: () => {
    const { stompClient, subscriptions } = get();

    if (stompClient) {
      // 모든 구독 해제
      subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });

      // 클라이언트 비활성화
      stompClient.deactivate();
    }

    set({
      stompClient: null,
      isConnected: false,
      subscriptions: new Map(),
    });
  },

  subscribe: (
    destination: string,
    callback: (message: IMessage) => void,
    headers?: any
  ) => {
    const { stompClient, subscriptions } = get();

    if (!stompClient || !get().isConnected) {
      console.warn("STOMP client not connected");
      return "";
    }

    const subscription = stompClient.subscribe(destination, callback, headers);
    const subscriptionId = `${destination}-${Date.now()}`;

    subscriptions.set(subscriptionId, subscription);
    set({ subscriptions: new Map(subscriptions) });

    return subscriptionId;
  },

  unsubscribe: (subscriptionId: string) => {
    const { subscriptions } = get();
    const subscription = subscriptions.get(subscriptionId);

    if (subscription) {
      subscription.unsubscribe();
      subscriptions.delete(subscriptionId);
      set({ subscriptions: new Map(subscriptions) });
    }
  },

  publish: (destination: string, body: string, headers?: any) => {
    const { stompClient } = get();

    if (!stompClient || !get().isConnected) {
      console.warn("STOMP client not connected");
      return;
    }

    stompClient.publish({
      destination,
      body,
      headers,
    });
  },
}));

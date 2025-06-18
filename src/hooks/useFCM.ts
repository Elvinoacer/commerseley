// src/hooks/useFCM.ts
import { getFCMToken } from "@/lib/firebase-client";
import { useEffect } from "react";
import { useSubscriptionStore } from "@/store/useSubscription";

export const useFCM = () => {
  const { subscribe } = useSubscriptionStore();

  useEffect(() => {
    const initialize = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          // Request notification permission first
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            // Get initial token
            const token = await getFCMToken();
            await storeToken(token);

            // If token refresh logic is needed, implement it here when available
          } else {
            console.warn("Notification permission not granted");
          }
        } catch (error) {
          console.error("Error initializing FCM:", error);
        }
      } else {
        console.warn("Push notifications not supported");
      }
    };

    const storeToken = async (token: string | null) => {
      if (token) {
        try {
          const result = await subscribe(undefined, token);
          if (!result.success) {
            console.error("Failed to store FCM token:", result.error);
            // You could add retry logic here
          }
        } catch (error) {
          console.error("Error storing FCM token:", error);
        }
      }
    };

    initialize();
  }, [subscribe]);
};

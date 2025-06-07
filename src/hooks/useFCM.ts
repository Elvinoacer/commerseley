// src/hooks/useFCM.ts
import { getFCMToken } from "@/lib/firebase-client";
import { useEffect } from "react";

export const useFCM = () => {
  useEffect(() => {
    const initialize = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          // Request notification permission first
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            await getFCMToken();
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

    initialize();
  }, []);
};

// src/hooks/useFCM.ts
// import { useState } from "react";
// import { getFCMToken } from "@/lib/firebase-client";

// export const useFCM = () => {
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   const initialize = async () => {
//     if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
//       setError(new Error("Push notifications not supported"));
//       return false;
//     }

//     try {
//       const permission = await Notification.requestPermission();
//       if (permission === "granted") {
//         await getFCMToken();
//         setIsInitialized(true);
//         return true;
//       }
//       setError(new Error("Notification permission not granted"));
//       return false;
//     } catch (err) {
//       setError(err instanceof Error ? err : new Error(String(err)));
//       return false;
//     }
//   };

//   return { initialize, isInitialized, error };
// };

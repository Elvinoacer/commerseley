// src/lib/firebase-client.ts
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  Messaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let messaging: Messaging;

// Initialize Firebase only once and only on client side
if (typeof window !== "undefined" && getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}

export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Check if Firebase Messaging is supported
    const isMessagingSupported = await isSupported();
    if (!isMessagingSupported) {
      console.warn("Firebase Messaging not supported in this browser");
      return null;
    }

    if (!messaging) {
      console.warn("Messaging not initialized");
      return null;
    }

    // Register service worker first
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      {
        scope: "/",
        // scope: "/firebase-cloud-messaging-push-scope",
      }
    );
    console.log("Service Worker registered:", registration);

    const status = await Notification.requestPermission();
    if (status !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration, // Pass the registration explicitly
    });

    // const response = await fetch(`/api/logtoken/${currentToken}`);
    // const data = await response.json();
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      return currentToken;
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
};

export const onForegroundMessage = (): Promise<unknown> => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.warn("Messaging not initialized");
      return resolve(null);
    }

    onMessage(messaging, (payload) => {
      console.log("Foreground message received:", payload);

      // Display notification in foreground
      if (payload.notification) {
        const { title, body } = payload.notification;
        if (Notification.permission === "granted") {
          new Notification(title || "New Message", {
            body: body,
            icon: "/icons/icon-192x192.png",
          });
        }
      }

      resolve(payload);
    });
  });
};

export { messaging };

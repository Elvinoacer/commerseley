// // public/firebase-messaging-sw.js
// importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js");

// const firebaseConfig = {
//   apiKey: "AIzaSyA3p8FunVaYm3zWRdGpRujbSq7La_rcy-I",
//   authDomain: "push-notifications-7a046.firebaseapp.com",
//   projectId: "push-notifications-7a046",
//   storageBucket: "push-notifications-7a046.firebasestorage.app",
//   messagingSenderId: "385413079509",
//   appId: "1:385413079509:web:638a2fa6cc5d1a15911d5c",
//   measurementId: "G-7S5W0SVRWN",
// };

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// // Customize background notification handler
// messaging.onBackgroundMessage((payload) => {
//   //   console.log("[firebase-messaging-sw.js] Received background message ", payload);

//   // Customize notification here
//   const notificationTitle = payload.notification?.title || "New Message";
//   const notificationOptions = {
//     body: payload.notification?.body || "You have a new message",
//     icon: payload.notification?.icon || "https://i.pinimg.com/736x/5b/33/86/5b33869356e0d1fcf63c2ac7e7e8b358.jpg",
//     data: payload.data || {}, // Pass any data for click handling
//   };

//   return self.registration.showNotification(notificationTitle, notificationOptions);
// });

// // Add click event listener for notifications
// self.addEventListener("notificationclick", (event) => {
//   console.log("Notification click received.", event.notification);
//   event.notification.close();

//   // Handle notification click
//   const urlToOpen = new URL(event.notification.data?.link || "/", self.location.origin).href;

//   event.waitUntil(
//     clients.matchAll({ type: "window" }).then((windowClients) => {
//       // Check if there's already a window/tab open with the target URL
//       for (const client of windowClients) {
//         if (client.url === urlToOpen && "focus" in client) {
//           return client.focus();
//         }
//       }

//       // If no matching window/tab found, open a new one
//       if (clients.openWindow) {
//         return clients.openWindow(urlToOpen);
//       }
//     })
//   );
// });

// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyA3p8FunVaYm3zWRdGpRujbSq7La_rcy-I",
  authDomain: "push-notifications-7a046.firebaseapp.com",
  projectId: "push-notifications-7a046",
  storageBucket: "push-notifications-7a046.firebasestorage.app",
  messagingSenderId: "385413079509",
  appId: "1:385413079509:web:638a2fa6cc5d1a15911d5c",
  measurementId: "G-7S5W0SVRWN",
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

// Customize background notification handler
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  // Customize notification here
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: payload.notification?.icon || "/icons/icon-192x192.png",
    data: payload.data || {}, // Pass any data for click handling
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Add click event listener for notifications
self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received.", event.notification);
  event.notification.close();

  // Handle notification click
  const urlToOpen = new URL(event.notification.data?.link || "/", self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }

      // If no matching window/tab found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

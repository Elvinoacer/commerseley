// // src/lib/firebase-admin.ts
// import admin, { ServiceAccount } from "firebase-admin";

// if (!admin.apps.length) {
//   const serviceAccount: ServiceAccount = {
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//   };

//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export default admin;

import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

// Parse the service account JSON from the environment variable
const serviceAccount: ServiceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON as string);

// Initialize the Admin SDK only if it hasn't been already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const messaging = admin.messaging();

export { admin, messaging };

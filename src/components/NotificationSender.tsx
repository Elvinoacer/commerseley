// src/components/NotificationSender.tsx
"use client";

import { useState } from "react";
import { getFCMToken } from "@/lib/firebase-client";

export default function NotificationSender() {
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    messageId?: string;
  } | null>(null);

  const handleGetToken = async () => {
    const fcmToken = await getFCMToken();
    if (fcmToken) {
      setToken(fcmToken);
    }
  };

  const sendNotification = async () => {
    if (!token || !title || !body) {
      setResult({ success: false, message: "All fields are required" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          title,
          body,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      setResult({ success: false, message: "Failed to send notification" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Send FCM Notification</h2>

      <div className="mb-4">
        <label className="block mb-2">Device Token:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Device token"
          />
          <button onClick={handleGetToken} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Get Token
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Notification title"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Body:</label>
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Notification body"
        />
      </div>

      <button
        onClick={sendNotification}
        disabled={loading}
        className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}
      >
        {loading ? "Sending..." : "Send Notification"}
      </button>

      {result && (
        <div
          className={`mt-4 p-3 rounded ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          <p className="font-semibold">{result.success ? "Success!" : "Failed"}</p>
          {result.message && <p>{result.message}</p>}
          {result.messageId && <p>Message ID: {result.messageId}</p>}
        </div>
      )}
    </div>
  );
}

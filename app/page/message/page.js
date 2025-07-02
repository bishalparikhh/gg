"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export default function MessagingUI() {
  const { user, isLoading: authLoading } = useUser();
  const [buyingThreads, setBuyingThreads] = useState([]);
  const [sellingThreads, setSellingThreads] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [thread, setThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all inbox threads
  useEffect(() => {
    const fetchThreads = async () => {
      if (!user?.sub) return;
      const res = await fetch("/api/messages/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { sub: user.sub } }),
      });
      const data = await res.json();
      setBuyingThreads(data.buying || []);
      setSellingThreads(data.selling || []);
    };
    fetchThreads();
  }, [user?.sub]);

  // Fetch specific thread
  useEffect(() => {
    const fetchThread = async () => {
      if (!threadId || !user?.sub) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/messages/${threadId}`);
        const data = await res.json();
        if (res.ok) {
          setThread(data);
        } else {
          setError(data.error || "Unable to load thread");
        }
      } catch (err) {
        setError("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [threadId, user?.sub]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await fetch(`/api/messages/${threadId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { sub: user.sub }, text: newMessage }),
      });

      if (res.ok) {
        setThread((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            { senderId: user.sub, text: newMessage, timestamp: new Date() },
          ],
        }));
        setNewMessage("");
      } else {
        const errData = await res.json();
        setError(errData.error || "Failed to send message");
      }
    } catch (err) {
      setError("Network error while sending message");
    }
  };

  if (authLoading) return <p>Loading user session...</p>;
  if (!user) return <p className="text-red-500">You must be logged in to view messages.</p>;

  return (
    <div className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto p-4">
      {/* Selling Threads */}
      <div className="w-full md:w-1/4 border rounded p-2 space-y-2">
        <h2 className="text-lg font-bold">Selling</h2>
        {sellingThreads.length === 0 ? (
          <p className="text-sm text-gray-400">No messages</p>
        ) : (
          sellingThreads.map((thread) => (
            <div
              key={thread.threadId}
              onClick={() => setThreadId(thread.threadId)}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <div className="flex items-center gap-2">
                <img
                  src={thread.itemImage}
                  alt="item"
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{thread.itemTitle}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {thread.messages.at(-1)?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Buying Threads */}
      <div className="w-full md:w-1/4 border rounded p-2 space-y-2">
        <h2 className="text-lg font-bold">Buying</h2>
        {buyingThreads.length === 0 ? (
          <p className="text-sm text-gray-400">No messages</p>
        ) : (
          buyingThreads.map((thread) => (
            <div
              key={thread.threadId}
              onClick={() => setThreadId(thread.threadId)}
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <div className="flex items-center gap-2">
                <img
                  src={thread.itemImage}
                  alt="item"
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-sm font-medium">{thread.itemTitle}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {thread.messages.at(-1)?.text || "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {threadId && thread ? (
          <>
            <div className="flex items-center gap-4 border-b pb-4 mb-4">
              <img src={thread.itemImage} alt="item" className="w-16 h-16 object-cover rounded" />
              <h2 className="text-xl font-semibold">{thread.itemTitle}</h2>
            </div>

            <div className="space-y-2 mb-4 max-h-96 overflow-y-auto border p-4 rounded bg-gray-50">
              {thread.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.senderId === user.sub ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg text-sm max-w-xs break-words ${
                      msg.senderId === user.sub
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input input-bordered"
              />
              <button onClick={handleSend} className="btn btn-primary">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a thread to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";

export default function ThreadPage() {
  const { threadId } = useParams();
  const router = useRouter();

  const { user, isLoading } = useUser(); // ✅ Auth0 user
  const [messages, setMessages] = useState<any[]>([]);
  const [threadInfo, setThreadInfo] = useState<any>(null);
  const [text, setText] = useState("");

  const currentUserId = user?.sub || "";

  // ✅ Fetch messages + thread info
  useEffect(() => {
    if (!threadId) return;

    const fetchThreadData = async () => {
      const res = await fetch(`/api/messages/${threadId}`);
      if (!res.ok) return;

      const data = await res.json();

      setMessages(data.messages || []);
      setThreadInfo({
        title: data.thread.itemTitle,
        image: data.thread.itemImage,
        sellername: data.thread.sellername,
        sellerImage: data.thread.sellerImage,
      });
    };

    fetchThreadData();
  }, [threadId]);

  // ✅ Send new message
  const sendMessage = async () => {
    if (!text.trim() || !currentUserId) return;

    const res = await fetch(`/api/messages/${threadId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: currentUserId,
        text,
      }),
    });

    if (res.ok) {
      const newMsg = await res.json();
      setMessages((prev) => [...prev, newMsg]);
      setText("");
    }
  };

  // ✅ Delete chat thread
  const deleteChat = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this chat?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/messages/${threadId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Chat deleted!");
      router.push("/page/messages");
    } else {
      alert("Failed to delete chat.");
    }
  };

  if (isLoading) return <div>Loading user session...</div>;
  if (!user) return <div>Please log in to view messages.</div>;

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center min-h-screen">
      {/* ✅ Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?q=80&w=1170&auto=format&fit=crop')",
        }}
      ></div>

      {/* ✅ Chat Card */}
      <div className="w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden border bg-white/70 backdrop-blur-lg">
        {/* ✅ HEADER with seller info */}
        <div className="flex justify-between items-center p-4 border-b bg-white/80">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full border">
                <img
                  src={threadInfo?.sellerImage || "/fallback.jpg"}
                  alt="Seller"
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {threadInfo?.sellername || "Loading..."}
              </h2>
              <p className="text-sm text-gray-500">{threadInfo?.title || ""}</p>
            </div>
          </div>

          <button
            onClick={deleteChat}
            className="btn btn-sm btn-outline btn-error"
          >
            🗑 Delete
          </button>
        </div>

        {/* ✅ CHAT AREA */}
        <div className="relative h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm mt-20">
              No messages yet. Start the conversation!
            </div>
          )}

          {messages.map((m) => {
            const isMine = m.senderId === currentUserId;
            return (
              <div
                key={m._id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 max-w-xs shadow-md ${
                    isMine
                      ? "bg-blue-500 text-white rounded-2xl rounded-br-none"
                      : "bg-white/90 text-gray-900 rounded-2xl rounded-bl-none"
                  }`}
                >
                  {m.text}
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ✅ INPUT BAR */}
        <div className="p-4 bg-white/80 border-t flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

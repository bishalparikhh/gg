"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<any[]>([]);
  const segments = useSelectedLayoutSegments();
  const activeThreadId = segments[0] || null;

  useEffect(() => {
    const fetchThreads = async () => {
      const res = await fetch("/api/messages", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setThreads(data);
      } else {
        console.error("Failed to load threads");
      }
    };
    fetchThreads();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      
      {/* ✅ LEFT SIDEBAR */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">💬 Messages</h2>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              No conversations yet
            </div>
          ) : (
            threads.map((thread) => (
              <Link
                key={thread._id}
                href={`/page/messages/${thread._id}`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-md mx-2 mt-1 transition ${
                  activeThreadId === thread._id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                {/* Item Thumbnail */}
                <img
                  src={thread.itemImage || "/placeholder.jpg"}
                  alt={thread.itemTitle}
                  className="w-12 h-12 rounded-md object-cover border"
                />

                {/* Thread Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{thread.itemTitle}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {thread.lastMessage || "No messages yet"}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* ✅ RIGHT PANEL (Chat Panel) */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {children || (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            Select a conversation from the left
          </div>
        )}
      </div>
    </div>
  );
}

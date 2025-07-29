"use client";

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { user, isLoading } = useUser();
  const [listingCount, setListingCount] = useState(null);

  useEffect(() => {
    async function fetchListingCount() {
      if (!user) return;

      try {
        const res = await fetch(`/api/user-items?userId=${user.sub}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setListingCount(data.totalItems);
        }
      } catch (err) {
        console.error("failed to fetch listing count", err);
      }
    }

    fetchListingCount();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md border border-gray-200 text-center">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <img
            src={user.picture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border shadow-sm mb-3"
          />
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-xs text-gray-400">@{user.nickname}</p>
        </div>

        {/* Active Listings */}
        <div className="mt-5 p-3 rounded-md bg-gray-50 border text-sm text-gray-600 flex justify-between items-center">
          <span>📦 Active Listings</span>
          <span className="font-semibold text-gray-800">
            {listingCount !== null ? listingCount : "-"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 items-center">
          <Link href="/page/messages" className="w-full">
            <button className="w-full text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow">
              💬 View Messages
            </button>
          </Link>
          <Link href="/page/sell" className="w-full">
            <button className="w-full text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow">
              ➕ Create New Listing
            </button>
          </Link>
          <button
  onClick={() =>
    (window.location.href =
      "https://www.gamersglitch.in/auth/logout?returnTo=https://www.gamersglitch.in")
  }
  className="w-full text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow flex items-center justify-center gap-2"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
    />
  </svg>
  Logout
</button>

        </div>
      </div>
    </div>
  );
}

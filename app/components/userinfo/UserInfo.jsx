"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserProfile() {
   const [profile, setProfile] = useState(null);
  const [listingCount, setListingCount] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function fetchProfileAndListings() {
    try {
      // ✅ Fetch Auth0 user profile from API
      const profileRes = await fetch("/api/user-profile", {
        credentials: "include",
      });
      if (!profileRes.ok) throw new Error("Unauthorized");
      const userData = await profileRes.json();
      setProfile(userData);

      // ✅ Fetch listing count AFTER we have user.sub
      const listingsRes = await fetch(`/api/user-items?userId=${userData.sub}`, {
        credentials: "include",
      });
      if (listingsRes.ok) {
        const listingsData = await listingsRes.json();
        setListingCount(listingsData.totalItems);
      } else {
        console.warn("Failed to fetch listings");
      }
    } catch (err) {
      console.error("❌ Failed to fetch profile or listings:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchProfileAndListings();
}, []);

  if (loading) {
    return (
      <div className="text-center p-6 text-gray-500 animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-6 text-red-500">
        Failed to load profile. Please log in again.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-200">
      {/* ✅ Profile Header */}
      <div className="flex items-center space-x-4">
        <img
          src={profile.picture || "/default-avatar.png"}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border shadow-sm"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-xs text-gray-400">@{profile.nickname}</p>
        </div>
      </div>

      {/* ✅ Active Listings */}
      <div className="mt-5 p-3 rounded-md bg-gray-50 border text-sm text-gray-600 flex justify-between items-center">
        <span>📦 Active Listings</span>
        <span className="font-semibold text-gray-800">
          {listingCount !== null ? listingCount : "-"}
        </span>
      </div>

      {/* ✅ Action Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        <Link href="/page/messages">
          <button className="w-full flex items-center justify-center gap-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow">
            💬 View Messages
          </button>
        </Link>

        <Link href="/page/sell">
          <button className="w-full flex items-center justify-center gap-2 text-sm text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md shadow">
            ➕ Create New Listing
          </button>
        </Link>

        <Link href="/auth/logout?returnTo=https://www.gamersglitch.in">
          <button className="w-full flex items-center justify-center gap-2 text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md shadow">
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
        </Link>
      </div>
    </div>
  );
}

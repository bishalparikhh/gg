"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";
import Link from "next/link";

// Components
import UserInfo from "../userinfo/UserInfo";
import Listing from "../sold items/Listing";

// Icons
import {
  FiUser,
  FiList,
  FiPlusSquare,
  FiHeart,
  FiShoppingCart,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar() {
  const { user, isLoading } = useUser();
  const [selectedOption, setSelectedOption] = useState("userinfo");

  if (isLoading) return <div className="text-center p-10">Loading...</div>;

  const handleOptionClick = (option) => setSelectedOption(option);

  const renderMainContent = () => {
    switch (selectedOption) {
      case "userinfo":
        return <UserInfo />;
      case "listing":
        return <Listing />;
      default:
        return <UserInfo />;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col items-center py-6">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Logo"
          className="w-14 h-14 rounded-full mb-4"
        />

        {/* Welcome */}
        <div className="text-2xl text-gray-700 mb-8 text-center">
          Hello, <span className="font-medium text-2xl">{user.nickname}</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-2 w-full px-4 text-sm text-gray-600">
          <SidebarButton
            icon={<FiUser />}
            label="User Info"
            value="userinfo"
            selected={selectedOption}
            onClick={handleOptionClick}
          />
          <SidebarButton
            icon={<FiList />}
            label="My Listings"
            value="listing"
            selected={selectedOption}
            onClick={handleOptionClick}
          />
          {/* Logout Link */}
          <Link
            href="/auth/logout"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-red-500 hover:bg-red-50 transition"
          >
            <FiLogOut className="text-base" />
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {renderMainContent()}
      </main>
    </div>
  );
}

// Sidebar Button Reusable
function SidebarButton({ icon, label, value, selected, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${
        selected === value
          ? "bg-gray-100 text-black font-medium"
          : "hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

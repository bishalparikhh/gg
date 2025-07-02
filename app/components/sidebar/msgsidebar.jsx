"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";
import Link from "next/link";

// Import the components correctly (assuming they are default exports)
import UserInfo from "../userinfo/UserInfo";  // Default import
import Listing from "../sold items/Listing";  // Default import

export default function MsgSidebar() {
  const { user, isLoading } = useUser();
  // Initialize the state with a string value representing the selected option (not the component itself)
  const [selectedOption, setSelectedOption] = useState('userinfo'); // Default to 'userinfo'

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle option click to set selected option
  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  // Function to render main content based on selected option
  const renderMainContent = () => {
    switch (selectedOption) {
      case 'userinfo':
        return <UserInfo />;
      case 'listing':
        return <Listing />;
      default:
        return <UserInfo />; // Default content if no match
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="sticky top-0 left-0 h-screen w-70 bg-cyan-500 p-5">
        <h1 className="text-center text-white text-2xl pt-5 font-sans pb-4">Messages
        </h1>


        <div className="pt-6 w-full text-center shadow-cyan-700 text-2xl rounded-2xl shadow-2xl text-white pb-5">
          <Link href="/">Home</Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 border">
        {renderMainContent()} {/* Dynamically render content based on selectedOption */}
      </div>
    </div>
  );
}

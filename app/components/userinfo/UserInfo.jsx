// components/UserProfile.js
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function UserProfile() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-500">
          <img
            src={user.picture}
            alt="Profile Picture"
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Info */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-xl text-gray-500">{user.email}</p>
          <p className="text-lg text-gray-600 mt-2">{user.nickname}</p>
        </div>
      </div>

      {/* Bio Section */}
      <div className="mt-6">
      </div>

      {/* Active Items */}
      <div className="mt-6 text-center">
        <p className="font-medium text-lg text-gray-800">Active Listings: 5</p>
      </div>

      {/* Logout Button */}
      <div className="mt-8 text-center">
        <Link href="/auth/logout">
          <div className="flex justify-center items-center text-white bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-full shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="mr-2 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
            Logout
          </div>
        </Link>
      </div>
    </div>
  );
}

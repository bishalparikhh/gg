"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "../../components/sidebar/sidebar";

export default function UserProfile() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      // User not logged in, redirect to login
      router.push("/auth/login");
    }
  }, [isLoading, user]);

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sidebar />
      {/* Render user info or profile content here if needed */}
    </div>
  );
}

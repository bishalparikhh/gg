"use client";

import { useUser } from "@auth0/nextjs-auth0"

import Link from "next/link";

import Sidebar from "../../components/sidebar/sidebar"

export default function UserProfile(){ 

const { user, isLoading } = useUser();  // Fetch user data directly

  if (isLoading) {
    return <div>Loading...</div>;  // You can show a loading state while the user data is loading
  }

    return(
      <div><Sidebar/>
      </div>
       
    );

}
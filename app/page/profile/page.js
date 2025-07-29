"use client";

import Sidebar from "../../components/sidebar/sidebar"

export default function UserProfile(){ 

  if (isLoading) {
    return <div>Loading...</div>;  // You can show a loading state while the user data is loading
  }

    return(
      <div><Sidebar/>
      </div>
       
    );

}
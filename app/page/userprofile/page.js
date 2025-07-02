'use client';
import { useUser } from "@auth0/nextjs-auth0"

export default function Profile() {
  const { user, isLoading } = useUser();
  return (
    <>
      {isLoading && <p>Loading...</p>}
      {user && (
        <div style={{ textAlign: "center" }}>
           <img height="100px" src="https://lh3.googleusercontent.com/a/ACg8ocLxumJGQKayBC9RIHUTj46c8fmbH3i33D8ER7Wit3HhwWTuiRv_=s96-c"></img>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </>
  );
}


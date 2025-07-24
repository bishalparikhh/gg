"use client";
import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";

export default function Listing() {
  const { user, isLoading } = useUser();
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const fetchUserItems = async () => {
    if (!user?.sub) return; // ✅ wait for user
    const sellerId = user.sub;

    try {
      const res = await fetch(`/api/user-items?sellerId=${sellerId}&page=1&limit=10`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/user-items/delete?id=${itemId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (result.success) {
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } else {
        alert(result.message || "Failed to delete item.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  useEffect(() => {
    if (user) fetchUserItems(); // ✅ fetch only after user is ready
  }, [user]);

  if (isLoading || loadingItems) return <p className="text-center">Loading your items...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Listings</h1>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white shadow p-4 rounded-lg relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => openEditModal(item)}
                  className="text-sm px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">You haven't listed any items yet.</p>
      )}
    </div>
  );
}

"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useState, useEffect } from "react";

export default function Buy() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");

  const { user, isLoading: userLoading } = useUser(); // ✅ Logged-in user
  const itemsPerPage = 9;
  const categories = ["merch", "used", "account"];
  // ✅ Fetch items

  useEffect(() => {
  console.log("Fetched items:", items);
}, [items]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const query = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (searchQuery) query.append("search", searchQuery);
        if (sort) query.append("sort", sort);
        if (minPrice) query.append("minPrice", minPrice);
        if (maxPrice) query.append("maxPrice", maxPrice);
        if (category) query.append("category", category);

        const response = await fetch(`/api/get-items?${query.toString()}`);
        const result = await response.json();

        if (response.ok) {
          setItems(result.items);
          setTotalPages(result.totalPages || 1);
        } else {
          setError("Failed to fetch items.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching items.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [currentPage, searchQuery, sort, minPrice, maxPrice, category]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

const startChat = async (item) => {
  if (!user) {
    window.location.href = "/auth/login";
    return;
  }

  if (user.sub === item.sellerId) {
    alert("This is your own listing.");
    return;
  }

  if (!item.sellerId) {
    alert("Seller information missing. Cannot start chat.");
    return;
  } 
  console.log("➡️ DEBUG START CHAT:", {
    itemId: item.id,
    itemImage: item.image,
    itemTitle: item.title,
    buyerId: user.sub,
    sellerId: item.sellerId
  });

  const res = await fetch("/api/messages/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itemId: item.id,       // ✅ correct now
      itemImage: item.image, // ✅ correct now
      itemTitle: item.title,
      buyerId: user.sub,
      sellerId: item.sellerId,
    }),
  });

  const data = await res.json();
  console.log("➡️ RESPONSE:", data);

  if (res.ok && data.threadId) {
    window.location.href = `/page/messages/${data.threadId}`;
  } else {
    alert(data.message || "Unable to start chat");
  }
};


  return (
    <div className="w-full min-h-screen p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 space-y-6">
          {/* Category Filter */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Category</h2>
            <button
              onClick={() => {
                setCategory("");
                setCurrentPage(1);
              }}
              className={`block w-full text-left px-3 py-2 rounded ${
                category === "" ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
                className={`block w-full text-left px-3 py-2 capitalize rounded ${
                  category === cat ? "bg-blue-600 text-white" : "bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Filter */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="input input-bordered w-full"
            />
          </div>
        </aside>

        {/* Main Items Grid */}
        <main className="w-full md:w-3/4">
          {loading && <p className="text-center">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const isOwner = user?.sub === item.sellerId;

              return (
                <div
                  key={item.id}
                  className="card bg-base-100 border border-base-300 shadow-md"
                >
                  <figure className="h-40 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </figure>
                  <div className="card-body p-4">
                    <h2 className="card-title text-base">{item.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-green-600 font-semibold text-sm">
                        ₹ {item.price}
                      </span>

                      {/* ✅ Show "Your Listing" if it's your own item */}
                      {isOwner ? (
                        <span className="text-xs text-gray-400">Your Listing</span>
                      ) : (
                        <button
                          onClick={() => startChat(item)}
                          className="btn btn-sm btn-outline"
                        >
                          Message
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center mt-8 gap-2">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="btn btn-sm btn-outline"
                >
                  Prev
                </button>
              )}
              {[...Array(totalPages).keys()].map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber + 1)}
                  className={`btn btn-sm ${
                    currentPage === pageNumber + 1
                      ? "btn-primary text-white"
                      : "btn-outline"
                  }`}
                >
                  {pageNumber + 1}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="btn btn-sm btn-outline"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
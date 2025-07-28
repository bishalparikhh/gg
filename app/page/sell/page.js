"use client";
import { useState } from "react";
import Listing from "../../components/sold items/Listing";


export default function Sell() {
 
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("sell");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description || !category || !image) {
      setMessage("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/s3-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileType: image.type }),
      });

      const { uploadURL, imageUrl } = await res.json();

      await fetch(uploadURL, {
  method: "PUT",
  headers: {
    "Content-Type": image.type,
    "x-amz-acl": "public-read", // MUST match backend
  },
  body: image,
});


      const metadataRes = await fetch("/api/sell-item", {
method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title,
    price,
    description,
    category,
    imageUrl,
  }),
});


      if (metadataRes.ok) {
        setMessage("✅ Item listed successfully!");
        setTitle("");
        setPrice("");
        setDescription("");
        setCategory("");
        setImage(null);
        setPreview("");
      } else {
        const errData = await metadataRes.json();
        setMessage(errData.message || "Failed to save item.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen">

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("sell")}
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === "sell"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Sell an Item
        </button>
        <button
          onClick={() => setActiveTab("listings")}
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === "listings"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          My Listings
        </button>
      </div>

      {/* Sell Item Form */}
      {activeTab === "sell" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-lg shadow-lg p-6 space-y-6"
        >
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="e.g., Valorant Skin Bundle"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select Category</option>
              <option value="merch">Merch</option>
              <option value="used">Used Items</option>
              <option value="account">Account / Skins / Game</option>
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="e.g., 499"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
              rows={3}
              placeholder="Write about the condition, usage, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Image</label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="image"
                className="cursor-pointer bg-gray-100 border border-dashed border-gray-400 px-6 py-3 rounded-md text-gray-600 hover:bg-gray-200 transition"
              >
                Click to choose file
              </label>
              {image && (
                <span className="text-sm text-gray-700 truncate max-w-xs">
                  {image.name}
                </span>
              )}
            </div>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-32 h-20 object-cover rounded-md border"
              />
            )}
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "List Item"}
            </button>
          </div>

          {message && (
            <div className="text-center text-sm mt-2 text-green-600">
              {message}
            </div>
          )}
        </form>
      )}

      {/* Listings Section */}
      {activeTab === "listings" && <Listing />}
    </div>
  );
}

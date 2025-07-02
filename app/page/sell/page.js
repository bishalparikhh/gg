"use client";
import { useState } from "react";
import { useUser } from '@auth0/nextjs-auth0';

export default function Sell() {
  const { user, error, isLoading } = useUser();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        headers: { "Content-Type": image.type },
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
          user: {
            name: user?.name,
            email: user?.email,
            userId: user?.sub,
          },
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
    <div className="max-w-2xl mx-auto px-6 py-10 h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Sell Your Item</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg shadow-lg p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., Valorant Skin Bundle"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
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

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">Price (₹)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., 499"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            rows={3}
            placeholder="Write about the condition, usage, etc."
          />
        </div>

        {/* Image Upload */}
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
      className="mt-4 w-30 h-20 object-cover rounded-md border"
    />
  )}
</div>

        {/* Submit */}
        <div className="text-center pl-4 ">
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

        {/* Message */}
        {message && (
          <div className="text-center text-sm mt-2 text-green-600">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

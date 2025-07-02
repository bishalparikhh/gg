import { connectToDatabase } from "../../../lib/mongodb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const sort = url.searchParams.get("sort") || "date_desc";
    const category = url.searchParams.get("category") || "";

    const skip = (page - 1) * limit;
    const { db } = await connectToDatabase();

    // Build filter
    const filter: any = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    // Sorting logic
    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };

    const totalItems = await db.collection("items").countDocuments(filter);

    const items = await db
      .collection("items")
      .find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .toArray();

    const formattedItems = items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.imageUrl,
      category: item.category,
      sellerId: item.sellerId,
      user: item.user,
    }));

    return new Response(
      JSON.stringify({
        items: formattedItems,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching items:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching items." }),
      { status: 500 }
    );
  }
}

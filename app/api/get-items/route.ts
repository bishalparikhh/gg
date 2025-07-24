import dbConnect from "../../../lib/dbConnect";
import Item from "../../../models/Item";
import { rateLimit } from "../../../lib/ratelimiter";
export async function GET(req: Request) {
    // ✅ Identify client by IP (for public API)
  const clientIp =
    req.headers.get("x-forwarded-for") || // If behind a proxy/load balancer
    req.headers.get("cf-connecting-ip") || // If using Cloudflare
    "global"; // Fallback for local/dev

  // ✅ Check rate limit (max 50 req/min)
  const rate = rateLimit(clientIp, 50, 60_000);
  if (!rate.success) {
    return new Response(
      JSON.stringify({
        message: `Too many requests. Try again in ${rate.retryAfter}s.`,
      }),
      { status: 429 }
    );
  }
  try {
    await dbConnect(); // ✅ connect mongoose

    const fullUrl = req?.url || "http://localhost";
    const url = new URL(fullUrl);

    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search") || "";
    const sort = url.searchParams.get("sort") || "date_desc";
    const category = url.searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };

    const totalItems = await Item.countDocuments(filter);

   const items = await Item.find(filter)
  .sort(sortOption)
  .skip(skip)
  .limit(limit)
  .lean();


const formattedItems = items.map((item: any) => {
  return {
    id: item._id.toString(),
    title: item.title,
    price: item.price,
    description: item.description,
    image: item.imageUrl,
    category: item.category,
    sellerId: item.sellerId,  // ✅ directly from DB
  };
});



    return new Response(
      JSON.stringify({
        items: formattedItems,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("❌ Error fetching items:", err);
    return new Response(JSON.stringify({ message: "Error fetching items" }), { status: 500 });
  }
}

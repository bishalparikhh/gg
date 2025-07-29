import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Item from "../../../models/Item";
import { auth0 } from "../../../lib/auth0"; 

export async function GET(req: NextRequest) {
  try {
    // ✅ 1. Get Auth0 session → only logged-in users can fetch items
    const session = await auth0.getSession(req);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.sub; // ✅ Authenticated user's ID

    // ✅ 2. Connect DB
    await dbConnect();

    // ✅ 3. Pagination params
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // ✅ 4. Fetch only **this user’s** items
    const totalItems = await Item.countDocuments({ sellerId: userId });

    const items = await Item.find({ sellerId: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedItems = items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.imageUrl,
      category: item.category,
    }));

    return NextResponse.json({
      items: formattedItems,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error: any) {
    console.error("❌ Error fetching seller items:", error.message);
    return NextResponse.json(
      { message: "Error fetching seller items." },
      { status: 500 }
    );
  }
}

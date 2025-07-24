import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Item from "../../../models/Item";
import { rateLimit } from "../../../lib/ratelimiter";
import { auth0 } from "../../../lib/auth0"; // ✅ using your working auth instance

export async function POST(req: NextRequest) {
  try {
    // ✅ 1. Get Auth0 Session
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const sellerId = session.user.sub; // Auth0 unique user ID
    const sellerImage =session.user.picture;
    const sellername =session.user.name;

    // ✅ 2. Rate limit per user (10 sell posts in 10 mins)
    const rate = rateLimit(`SELL_${sellerId}`, 10, 10 * 60_000);
    if (!rate.success) {
      return NextResponse.json(
        { message: `Too many sell posts. Try again in ${rate.retryAfter}s.` },
        { status: 429 }
      );
    }

    // ✅ 3. Connect DB
    await dbConnect();

    // ✅ 4. Parse request body
    const { title, price, description, category, imageUrl } = await req.json();

    // ✅ 5. Validate required fields
    if (!title || !price || !description || !category || !imageUrl) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ 6. Validate category
    const allowedCategories = ["merch", "used", "account"];
    if (!allowedCategories.includes(category)) {
      return NextResponse.json({ message: "Invalid category" }, { status: 400 });
    }

    // ✅ 7. Save item in DB
    const newItem = await Item.create({
      title: title.trim(),
      price: parseFloat(price),
      description: description.trim(),
      category,
      imageUrl,
      sellerId,
      sellerImage,
      sellername,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: newItem._id.toString() });
  } catch (error: any) {
    console.error("🔥 Server error:", error.message);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

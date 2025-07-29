// app/api/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Thread from "../../../models/Thread";
import { auth0 } from "../../../lib/auth0";

// ✅ Sidebar threads list
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await auth0.getSession(req);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.sub;

    // ✅ Find all threads where current user is buyer or seller
  const threads = await Thread.find({
  $or: [{ buyerId: currentUserId }, { sellerId: currentUserId }],
})
  .populate("itemId")
  .sort({ updatedAt: -1 })
  .lean();

// ✅ Flatten the response so no nested .item
const formatted = threads.map((t: any) => ({
  _id: t._id,
  lastMessage: t.lastMessage || "No messages yet",
  itemTitle: t.itemId?.title || "Unknown Item",
  itemImage: t.itemId?.imageUrl || "",
  sellername: t.sellername,
  sellerImage: t.sellerImage,
  otherUserId: t.buyerId === currentUserId ? t.sellerId : t.buyerId,
}));

return NextResponse.json(formatted);


  } catch (err) {
    console.error("❌ Error fetching threads:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


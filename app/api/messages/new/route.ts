// app/api/messages/new/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Thread from "../../../../models/Thread";
import Message from "../../../../models/Message";
import Item from "../../../../models/Item";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { itemId, buyerId } = await req.json();

    if (!itemId || !buyerId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // ✅ Get the item to auto-fill seller info
    const item = await Item.findById(itemId).lean();
    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const { imageUrl, title, sellerId, sellerImage, sellername } = item;

    if (buyerId === sellerId) {
      return NextResponse.json({ message: "You cannot message your own listing." }, { status: 400 });
    }

    // ✅ Find or create thread
    let thread = await Thread.findOne({ itemId, buyerId, sellerId });
    if (!thread) {
      thread = await Thread.create({
        itemId,
        itemImage: imageUrl,
        itemTitle: title,
        buyerId,
        sellerId,
        sellerImage,
        sellername,
      });

      // ✅ Auto create first message
      await Message.create({
        threadId: thread._id,
        senderId: buyerId,
        text: "Hi, is this item still available?",
      });

      // ✅ Update lastMessage
      thread.lastMessage = "Hi, is this item still available?";
      await thread.save();
    }

    return NextResponse.json({ success: true, threadId: thread._id });

  } catch (error) {
    console.error("❌ Error creating thread:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

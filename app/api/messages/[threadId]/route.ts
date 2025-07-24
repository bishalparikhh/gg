import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/dbConnect";
import Message from "../../../../models/Message";
import Thread from "../../../../models/Thread";

// ✅ GET /api/messages/[threadId] → fetch thread + messages
export async function GET(req: NextRequest, context: any) {
  await dbConnect();

  const { threadId } = context.params as { threadId: string };

  const thread = await Thread.findById(threadId).lean();
  if (!thread) {
    return NextResponse.json({ thread: null, messages: [] }, { status: 404 });
  }

  const messages = await Message.find({ threadId }).sort({ createdAt: 1 }).lean();

  return NextResponse.json({
    thread: {
      _id: thread._id.toString(),
      itemTitle: thread.itemTitle,
      itemImage: thread.itemImage,
      sellername: thread.sellername,
      sellerImage: thread.sellerImage,
      buyerId: thread.buyerId,
      sellerId: thread.sellerId,
    },
    messages,
  });
}

// ✅ POST /api/messages/[threadId] → send a new message
export async function POST(req: NextRequest, context: any) {
  await dbConnect();

  const { threadId } = context.params as { threadId: string };
  const { senderId, text } = await req.json();

  if (!senderId || !text) {
    return NextResponse.json(
      { error: "Missing senderId or text" },
      { status: 400 }
    );
  }

  const msg = await Message.create({ threadId, senderId, text });

  // ✅ Update thread.lastMessage & updatedAt
  await Thread.findByIdAndUpdate(threadId, { lastMessage: text });

  return NextResponse.json(msg, { status: 201 });
}

// ✅ DELETE /api/messages/[threadId] → delete thread + messages
export async function DELETE(req: NextRequest, context: any) {
  try {
    await dbConnect();

    const { threadId } = context.params as { threadId: string };

    // ✅ Delete all messages for this thread
    await Message.deleteMany({ threadId });

    // ✅ Delete the thread itself
    await Thread.findByIdAndDelete(threadId);

    return NextResponse.json({ success: true, message: "Chat deleted" });
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

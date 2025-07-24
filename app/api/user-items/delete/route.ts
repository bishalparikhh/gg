import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "../../../../lib/dbConnect";
import Item from "../../../../models/Item";
import { auth0 } from "../../../../lib/auth0"; // ✅ Auth0 session checker

export async function DELETE(req: NextRequest) {
  try {
    // ✅ 1. Check Auth0 session
    const session = await auth0.getSession();

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.sub; // ✅ Authenticated user's ID

    // ✅ 2. Extract & validate item ID
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid or missing item ID" },
        { status: 400 }
      );
    }

    // ✅ 3. Ensure DB connection is established
    await dbConnect();

    // ✅ 4. Find item & ensure ownership
    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    if (item.sellerId !== userId) {
      return NextResponse.json(
        { success: false, message: "Forbidden: You do not own this item" },
        { status: 403 }
      );
    }

    // ✅ 5. Delete item
    await item.deleteOne();

    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error: any) {
    console.error("❌ Error deleting item:", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

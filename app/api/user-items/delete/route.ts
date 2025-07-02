// app/api/user-items/delete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ObjectId, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = "valo";

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Missing item ID" }, { status: 400 });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const result = await db.collection("items").deleteOne({ _id: new ObjectId(id) });
    await client.close();

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

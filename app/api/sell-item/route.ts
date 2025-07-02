// app/api/sell-item/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "valo"; // change to your actual DB

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, price, description, category, imageUrl, user } = body;

    if (!title || !price || !description || !category || !imageUrl || !user) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("items");

    const result = await collection.insertOne({
      title,
      price: parseFloat(price),
      description,
      category,
      imageUrl,
      user,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

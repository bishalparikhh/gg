// app/api/user-items/route.ts

import { connectToDatabase } from '../../../lib/mongodb';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (!userId) {
      return new Response(JSON.stringify({ message: "Missing userId" }), { status: 400 });
    }

    const skip = (page - 1) * limit;
    const itemsLimit = limit;

    const { db } = await connectToDatabase();

    const totalItems = await db.collection("items").countDocuments({ "user.userId": userId });

    const items = await db
      .collection("items")
      .find({ "user.userId": userId })
      .skip(skip)
      .limit(itemsLimit)
      .toArray();

    const formattedItems = items.map(item => ({
      id: item._id.toString(),
      title: item.title,
      price: item.price,
      description: item.description,
      image: item.imageUrl,
      category: item.category,
    }));

    return new Response(
      JSON.stringify({
        items: formattedItems,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsLimit),
        currentPage: page,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user items:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching user items from the database." }),
      { status: 500 }
    );
  }
}

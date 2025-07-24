import mongoose, { Document, Model } from "mongoose";

export interface IItem extends Document {
  title: string;
  price: number;
  description: string;
  category: "merch" | "used" | "account";
  imageUrl: string;
  sellerId: string;     // ✅ only store this
  createdAt: Date;
  sellerImage:string;
  sellername: string;
}

const ItemSchema = new mongoose.Schema<IItem>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["merch", "used", "account"], required: true },
  imageUrl: { type: String, required: true },
  sellerId: { type: String, required: true },
  sellerImage: { type: String, required: true },
  sellername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Remove any leftover `user` field
delete (ItemSchema as any).paths.user;

const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);

export default Item;

import mongoose, { Document, Model } from "mongoose";

export interface IThread extends Document {
  itemId: mongoose.Types.ObjectId;   // linked item
  itemImage: string;                 // preview image
  itemTitle: string;                 // title for context
  buyerId: string;                   // Auth0 user.sub
  sellerId: string;
  sellerImage: string;
  sellername: string;                  // Auth0 user.sub
  lastMessage?: string;              // last message preview
  createdAt: Date;
  updatedAt: Date;
}

const ThreadSchema = new mongoose.Schema<IThread>(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemImage: {
      type: String,
      required: true,
    },
    itemTitle: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
      index: true, // ✅ faster lookups
    },
    sellerId: {
      type: String,
      required: true,
      index: true,
    },
    sellerImage: {
      type: String,
      required: true,
      index: true,
    },
    sellername: {
      type: String,
      required: true,
      index: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Add a compound unique index so one buyer cannot create multiple threads for the same item
ThreadSchema.index(
  { itemId: 1, buyerId: 1, sellerId: 1 },
  { unique: true }
);

// ✅ Optional: Add an index for faster fetching of all threads for a user
ThreadSchema.index({ buyerId: 1, updatedAt: -1 });
ThreadSchema.index({ sellerId: 1, updatedAt: -1 });

const Thread: Model<IThread> =
  mongoose.models.Thread || mongoose.model<IThread>("Thread", ThreadSchema);

export default Thread;

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: String, // user.sub
  text: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const messageThreadSchema = new mongoose.Schema({
  participants: [String], // [buyerId, sellerId]
  messages: [messageSchema],
});

export default mongoose.models.MessageThread || mongoose.model("MessageThread", messageThreadSchema);

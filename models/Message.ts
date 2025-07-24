import mongoose, { Document, Model } from "mongoose";

export interface IMessage extends Document {
  threadId: mongoose.Types.ObjectId;
  senderId: string; // Auth0 user.sub
  text: string;
  createdAt: Date;
  read: boolean;
}

const MessageSchema = new mongoose.Schema<IMessage>(
  {
    threadId: { type: mongoose.Schema.Types.ObjectId, ref: "Thread", required: true },
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;

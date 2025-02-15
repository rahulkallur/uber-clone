import mongoose from "mongoose";

const blockListTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600,
    },
  },
  {
    timestamps: true,
  },
);
const BlockListToken = mongoose.model("BlockListToken", blockListTokenSchema);

export { BlockListToken };

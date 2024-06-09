import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    face1: String,
    face2: String,
    face3: String,
    face4: String,
    face5: String,
    face6: String,
  },
  { timestamps: false }
);

export default mongoose.models.Vinyl || mongoose.model("Vinyl", schema);

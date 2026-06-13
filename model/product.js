import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  category: String,
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
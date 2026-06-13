import connectDB from "@/lib/db";
import Product from "@/model/product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find();

    return Response.json(products);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
import OpenAI from "openai";
import connectDB from "@/lib/db"; 
import Product from "@/model/product";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
export async function POST(req) {
  try {
    const { query } = await req.json();
    const searchText = typeof query === "string" ? query.trim() : "";

    if (!searchText) {
      return Response.json([], { status: 200 });
    }

    const fallbackKeywords = searchText
      .split(/\s+/)
      .map((word) => word.replace(/[^a-zA-Z0-9]/g, "").trim())
      .filter(Boolean)
      .slice(0, 10);

    let keywords = fallbackKeywords.length ? fallbackKeywords : [searchText];

    if (process.env.OPENAI_KEY) {
      try {
        const aiResponse = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content:
                "Generate up to 10 short product keywords for this query, separated by commas. Return only the keywords, no extra text: " +
                searchText,
            },
          ],
        });

        const rawKeywords = aiResponse.choices[0]?.message?.content
          ?.split(",")
          .map((word) => word.trim())
          .filter(Boolean)
          .slice(0, 10) || [];

        if (rawKeywords.length) {
          keywords = rawKeywords;
        }
      } catch (aiError) {
        console.warn("AI keyword generation failed, using fallback keywords:", aiError);
      }
    } else {
      console.warn("OPENAI_KEY is not set, using local keyword search fallback.");
    }

    console.log("Query:", searchText);
    console.log("Keywords:", keywords);

    await connectDB();

    const searchClauses = keywords.flatMap((keyword) => [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ]);

    const products = await Product.find({
      $or: searchClauses,
    });

    return Response.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return Response.json({ error: "Failed to search products" }, { status: 500 });
  }
}


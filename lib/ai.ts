import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a structured data extraction AI for a food business SaaS. 
Analyze the image and return ONE SINGLE JSON OBJECT in one of these forms:

1) STOCK:
{
  "type": "stock",
  "items": [
    {
      "name": "Poulet",
      "quantity": 4.2,
      "unit": "kg",
      "totalPrice": 38.22,
      "currency": "EUR",
      "unitPrice": 9.1,
      "unitPricePerKg": 9.1,
      "expiryDate": "2025-11-23",
      "purchaseDate": "2025-11-18"
    }
  ]
}

2) RECIPE:
{
  "type": "recipe",
  "recipeName": "Wrap Poulet",
  "ingredients": [
    {
      "name": "Poulet",
      "quantityPerPortion": 150,
      "unit": "g",
      "costPerPortion": 1.35
    }
  ]
}

3) SALES:
{
  "type": "sales",
  "recipeName": "Wrap Poulet",
  "quantitySold": 42,
  "date": "2025-11-20",
  "unitPrice": 7.5,
  "totalRevenue": 315.0,
  "currency": "EUR"
}

RULES:
- Only these three structures.
- Normalize units (g, kg, ml, L, pcs).
- Missing data = null.
- Dates ISO (YYYY-MM-DD).
- Return ONLY the JSON, no comments, no markdown.`;

export async function analyzeImage(base64Image: string, contextHint = "auto") {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            { type: "text", text: contextHint === "auto" ? "Analyze this image and extract structured data." : contextHint },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    // Clean up markdown code blocks if present
    const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();

    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
}

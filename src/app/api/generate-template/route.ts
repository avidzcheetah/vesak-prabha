import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import * as fs from "fs";
import * as path from "path";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    // Step 1: Call Gemini to check safety/relevance and optimize the prompt
    const genAI = new GoogleGenerativeAI(apiKey);
    const safetyModel = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.2,
      },
    });

    const guardrailPrompt = `
You are a content safety and prompt optimization assistant for the "වෙසක් ප්‍රභා" (Vesak Prabha) Digital Card platform.
Your task is to analyze the user's text-to-image prompt: "${prompt}"

Strict Rules:
1. The prompt MUST be related to Vesak, Buddhism, lanterns, oil lamps, temples, Bodhi trees, lotus flowers, peace, or spiritual light.
2. If it is NOT related, or contains political, commercial, offensive, or unethical content, output exactly the word "REJECTED".
3. If it is related and safe, output an enhanced, highly detailed prompt in English suitable for generating a beautiful, artistic greeting card template background.
4. The enhanced prompt should specify:
   - A beautiful graphic design background (e.g. "A premium, artistic background...")
   - Specific details from the user's input
   - A color scheme fitting Vesak (e.g., deep navy blue night sky, warm golden light, glowing accents)
   - The style should be "beautiful digital painting or vector art, soft focus, highly detailed, template backdrop, no text, no people faces".
   - It should NOT contain any text or letters in the generated image.
5. Output ONLY the optimized prompt or the word "REJECTED". Do not include quotes, intro, or explanation.
`;

    const safetyResult = await safetyModel.generateContent(guardrailPrompt);
    const safetyResponse = safetyResult.response.text().trim();

    if (safetyResponse.toUpperCase().includes("REJECTED")) {
      return NextResponse.json(
        { error: "Prompt is not related to Vesak or is ethically unacceptable." },
        { status: 400 }
      );
    }

    const enhancedPrompt = safetyResponse.replace(/^["']|["']$/g, "");
    console.log("Enhanced prompt for image generation:", enhancedPrompt);

    let imageBuffer: Buffer | null = null;
    let methodUsed = "";

    // Step 2: Try to call Google AI Studio Imagen 3 via REST API using the user's API key
    try {
      console.log("Attempting Imagen 3 generation via Google AI Studio...");
      const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict`;
      
      const response = await fetch(imagenUrl, {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: enhancedPrompt,
            },
          ],
          parameters: {
            numberOfImages: 1,
            aspectRatio: "3:4", // Perfect for card backgrounds
            outputMimeType: "image/png",
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const base64Bytes = data?.predictions?.[0]?.bytesBase64Encoded;
        if (base64Bytes) {
          imageBuffer = Buffer.from(base64Bytes, "base64");
          methodUsed = "Google Imagen 3";
          console.log("Successfully generated image with Google Imagen 3.");
        }
      } else {
        const errorText = await response.text();
        console.warn(`Imagen 3 API failed with status ${response.status}:`, errorText);
      }
    } catch (e) {
      console.warn("Failed to call Google AI Studio Imagen API:", e);
    }

    // Step 3: Fall back to free Pollinations.ai API if Google Imagen fails/is restricted
    if (!imageBuffer) {
      try {
        console.log("Falling back to Pollinations.ai for free image generation...");
        // Add style and quality terms to Pollinations prompt
        const pollinationsPrompt = `${enhancedPrompt}, highest quality, 8k resolution, award-winning illustration`;
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
          pollinationsPrompt
        )}?width=768&height=1024&nologo=true&private=true&seed=${Math.floor(
          Math.random() * 1000000
        )}`;

        const response = await fetch(pollinationsUrl);
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
          methodUsed = "Pollinations Free AI";
          console.log("Successfully generated image with Pollinations AI.");
        } else {
          throw new Error("Pollinations API returned error status");
        }
      } catch (e) {
        console.error("Image generation fallback failed:", e);
        return NextResponse.json(
          { error: "Failed to generate image with any of the AI generators." },
          { status: 500 }
        );
      }
    }

    // Step 4: Save the image buffer to the public/templates folder
    const filename = `gen_${nanoid(10)}.png`;
    const publicDir = path.join(process.cwd(), "public", "templates");
    
    // Ensure public/templates exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, imageBuffer);

    const relativeUrl = `/templates/${filename}`;
    
    return NextResponse.json({
      image_url: relativeUrl,
      prompt: enhancedPrompt,
      method: methodUsed,
    });
  } catch (error: any) {
    console.error("Generate template error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during AI image generation." },
      { status: 500 }
    );
  }
}

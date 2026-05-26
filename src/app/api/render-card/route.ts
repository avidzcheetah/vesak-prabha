import { NextRequest, NextResponse } from "next/server";
import { getTemplate } from "@/data/templates";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template_id, language, sender, recipient, message } = body;

    // Validate
    if (!template_id || !language || !sender || !recipient) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const template = getTemplate(template_id);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Generate a unique slug
    const slug = nanoid(10);

    // For now, return the card data without actual PNG rendering
    // When Supabase is connected, this will:
    // 1. Use Satori to render the card as SVG
    // 2. Convert to PNG via @resvg/resvg-wasm
    // 3. Upload to Supabase Storage
    // 4. Insert card record into DB

    // Attempt to write card record to Supabase database if tables are migrated
    try {
      await supabase
        .from("cards")
        .insert({
          slug,
          template_id: parseInt(template_id),
          language,
          sender,
          recipient,
          message: message || "",
          image_url: template.bg_url,
        });
    } catch (err) {
      console.warn("Could not insert card in Supabase (tables may not be migrated yet):", err);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const queryParams = new URLSearchParams({
      t: template_id.toString(),
      lang: language,
      s: sender,
      r: recipient,
      m: message || "",
    }).toString();
    const card_url = `${appUrl}/c/${slug}?${queryParams}`;

    // Return the card data
    return NextResponse.json({
      slug,
      image_url: template.bg_url,
      card_url,
    });
  } catch (error) {
    console.error("Error rendering card:", error);
    return NextResponse.json(
      { error: "Failed to render card" },
      { status: 500 }
    );
  }
}

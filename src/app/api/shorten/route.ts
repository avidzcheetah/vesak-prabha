export const runtime = 'edge';

import { NextResponse } from "next/server";
import { storeUrl } from "@/lib/url-store";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Generate a short code and build a short URL using the app's own domain
    const code = storeUrl(url);

    // Build the short URL relative to the current origin
    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/api\/shorten.*$/, "") || "";
    const shortUrl = `${origin}/s/${code}`;

    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error("URL shortening failed:", error);
    return NextResponse.json({ shortUrl: null }, { status: 500 });
  }
}

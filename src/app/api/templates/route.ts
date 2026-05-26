export const runtime = 'edge';

import { NextRequest, NextResponse } from "next/server";
import { getActiveTemplates } from "@/data/templates";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang");

  let templates = getActiveTemplates();

  // Templates are the same regardless of language,
  // but we return language-appropriate names
  const result = templates.map((t) => ({
    id: t.id,
    name: lang === "si" ? t.name_si : t.name_en,
    name_en: t.name_en,
    name_si: t.name_si,
    thumbnail_url: t.thumbnail_url,
    animated: t.animated,
  }));

  return NextResponse.json(result);
}

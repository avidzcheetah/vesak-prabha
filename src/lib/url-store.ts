// Persistent URL store using Supabase.
// Replaces the previous in-memory Map that was lost on every deploy/restart.

import { supabase } from "./supabase";

// Generate a short 7-char alphanumeric code
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function storeUrl(longUrl: string): Promise<string> {
  // Check if this URL already has a short code
  const { data: existing } = await supabase
    .from("short_urls")
    .select("code")
    .eq("long_url", longUrl)
    .limit(1)
    .single();

  if (existing) {
    return existing.code;
  }

  // Generate a unique code
  let code = generateCode();
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const { error } = await supabase
      .from("short_urls")
      .insert({ code, long_url: longUrl });

    if (!error) {
      return code;
    }

    // If code already exists (unique constraint violation), try another
    if (error.code === "23505") {
      code = generateCode();
      attempts++;
      continue;
    }

    // Other errors
    throw new Error(`Failed to store short URL: ${error.message}`);
  }

  throw new Error("Failed to generate unique short code after max attempts");
}

export async function getUrl(code: string): Promise<string | undefined> {
  const { data } = await supabase
    .from("short_urls")
    .select("long_url")
    .eq("code", code)
    .limit(1)
    .single();

  return data?.long_url ?? undefined;
}

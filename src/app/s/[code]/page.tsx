import { redirect } from "next/navigation";
import { getUrl } from "@/lib/url-store";

export const runtime = 'edge';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function ShortRedirect({ params }: PageProps) {
  const { code } = await params;
  const longUrl = getUrl(code);

  if (longUrl) {
    redirect(longUrl);
  }

  // Fallback: redirect to homepage if code not found
  redirect("/");
}

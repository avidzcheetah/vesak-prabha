import { Metadata } from "next";
import SharePageClient from "./share-page-client";
import { getTemplate } from "@/data/templates";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    t?: string;
    lang?: string;
    s?: string;
    r?: string;
    m?: string;
  }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const search = await searchParams;
  
  const templateId = parseInt(search.t || "1");
  const sender = search.s || "";
  const recipient = search.r || "";
  const message = search.m || "";
  const isSinhala = search.lang === "si";

  const template = getTemplate(templateId);
  const cardImageUrl = template ? template.bg_url : "/templates/t01-golden-lotus.png";

  const displayTitle = sender && recipient
    ? `${sender} sent a Vesak Card to ${recipient} — වෙසක් ප්‍රභා`
    : isSinhala
      ? "වෙසක් සුබපැතුම් පතක් — වෙසක් ප්‍රභා"
      : "A Vesak Greeting — වෙසක් ප්‍රභා";

  const displayDesc = message 
    ? `"${message}"`
    : isSinhala 
      ? "ත්‍රිවිධ රත්නයේ ආශීර්වාදය ඔබට සාමය, සතුට හා ප්‍රඥාව ගෙන එන්නේය." 
      : "May the Triple Gem bless you with peace, happiness, and wisdom on this sacred Vesak day.";

  return {
    title: displayTitle,
    description: displayDesc,
    openGraph: {
      title: displayTitle,
      description: displayDesc,
      type: "website",
      images: [
        {
          url: cardImageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      images: [cardImageUrl],
    },
  };
}

export default async function SharePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;
  return <SharePageClient slug={slug} search={search} />;
}

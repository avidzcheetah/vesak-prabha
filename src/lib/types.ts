export type Language = "en" | "si";

export interface CardFormData {
  template_id: number;
  language: Language;
  sender: string;
  recipient: string;
  message: string;
}

export interface CardData extends CardFormData {
  id?: string;
  slug: string;
  image_url: string;
  card_url: string;
  share_count: number;
  created_at: string;
}

export interface ShareMethod {
  type: "copy" | "whatsapp" | "facebook" | "download";
  label_en: string;
  label_si: string;
  icon: string;
}

export const defaultMessages: Record<Language, string> = {
  en: "May the Triple Gem bless you with peace, happiness, and wisdom on this sacred Vesak day.",
  si: "මෙම පූජනීය වෙසක් දිනයේ ත්‍රිවිධ රත්නයේ ආශීර්වාදය ඔබට සාමය, සතුට හා ප්‍රඥාව ගෙන එන්නේය.",
};

export const placeholders: Record<Language, { sender: string; recipient: string; message: string }> = {
  en: {
    sender: "Your name",
    recipient: "Recipient's name",
    message: "Enter your Vesak wish message...",
  },
  si: {
    sender: "ඔබේ නම",
    recipient: "ලබන්නාගේ නම",
    message: "ඔබේ වෙසක් පැතුම් පණිවිඩය ලියන්න...",
  },
};

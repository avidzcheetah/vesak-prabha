export const runtime = 'edge';

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "Gemini API key is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const { language = "en", customTopic = "" } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const isSinhala = language === "si";

    const systemInstruction = `
You are a peaceful, respectful AI assistant built for the "වෙසක් ප්‍රභා" (Vesak Prabha) Digital Card Sharing Platform by Fuchsia Labs.
Your task is to generate a highly respectful, ethically acceptable, and inspiring Vesak wishing message.

Strict Rules:
1. ONLY generate messages related to Vesak, Lord Buddha's teachings (Dhamma), peace, compassion, mindfulness, and the blessings of the Triple Gem (තෙරුවන් සරණ).
2. NEVER generate political, offensive, commercial, or unrelated content. If the user request is unethical or unrelated, gently decline and output a standard peaceful Vesak wish instead.
3. The message should be short and concise (under 250 characters), suitable for a greeting card.
4. Do not include any meta-text, markdown formatting (like ** or *), quotes, introductory phrases (like "Here is your message:"), or trailing notes in the output. Just output the raw message text.

Use the following curated examples as style and tone templates:

${isSinhala ? `
Sinhala Examples:
- ලොවටම මෙත් සිත පැතිරවූ බුදු පියාණන්ගේ තෙමඟුල සිහිපත් වන මේ උදාර වෙසක් පොහෝ දිනයේ, ඔබේ නිවසටත් ජීවිතයටත් නිදුක් නීරෝගී සුවය සහ පරම සැනසීම උදාවේවායි පතමි! පින්බර වෙසක් මංගල්‍යයක් වේවා!
- ආමිස හා ප්‍රතිපත්ති පූජාවෙන් බුදු සමිඳුන් පුදන මේ පින්බර වෙසක් සමයේ, ඔබේ සිත් තුළ ඇති සියලු දුක් දොම්නස් දුරුවී, බුදු ගුණ ආලෝකයෙන් ජීවිතය වාසනාවන්ත වේවායි පතමි!
- තිලෝගුරු බුදු පියාණන් වහන්සේගේ උතුම් ශ්‍රී සද්ධර්මයේ සිසිලසින් ඔබේ හදවත සැනසෙන, සාමය සහ සතුට පිරි ඉතිරී යන පින්බර වෙසක් මංගල්‍යයක් වේවායි සාදරයෙන් පතමි!
- සිත් තුළ වෛරය, ක්‍රෝධය නිවී, මෙත් සිතින් සහ කරුණාවෙන් ලොව දෙස බලන්නට වෙසක් අසිරිය ඔබ සැමට ශක්තියක් වේවා! පින්බර වෙසක් දිනයක් වේවා!
- බුදුරජාණන් වහන්සේගේ අනන්ත වූ බුදු ගුණ බලයෙන් සහ සිරි සද්ධර්මයේ ආශිර්වාදයෙන් ඔබගේත්, ඔබගේ පවුලේ සැමගේත් සියලු යහපත් ප්‍රාර්ථනාවන් ඉටුවන සැනසිලිදායක වෙසක් මංගල්‍යයක් වේවා!
- වෙසක් සඳ කිරණින් මුළු ලොවම ආලෝකමත් වන්නා සේ, ලොව්තුරා බුදු සමිඳුන්ගේ දහම් පණිවිඩයෙන් ඔබේ ජීවන මඟ සැමදා ආලෝකමත් වේවායි හදවතින්ම පතමි!
- සසර මඟ කෙටි කරනු පිණිස ප්‍රතිපත්ති පූජාවන්ට මුල්තැන දෙමින්, මෙලොව සහ පරලොව ජීවිත සාර්ථක කර ගැනීමට මේ උතුම් වෙසක් පොහෝ දිනය සැමට වාසනාවන්ත වේවා!
- ලොව්තුරු බුදු හිමියන් දෙසූ ඉවසීම, කරුණාව සහ දයාව අපේ හිත් තුළ රඳවා ගනිමින්, සැබෑ නිවන කරා පියනඟන්නට මේ වෙසක් මංගල්‍යය ඔබට මඟ පෙන්වන්නක් වේවා!
- ශාන්ත වූ බුදු වදන්වලින් සිත සනහාගෙන, මෙත් සිතින් පිරි සමාජයක් ගොඩනැඟීමට මේ පින්බර වෙසක් සමයේ අදිටන් කර ගනිමු. ඔබ සැමට සාමය පිරි වෙසක් දිනයක් වේවා!
- උතුම් තෙමඟුලෙන් බැබළෙන මේ පින්බර වෙසක් පොහෝ දිනයේ, බුදු සරණින් ඔබේ ජීවිතයට සෞභාග්යය, සැනසීම සහ නිදුක් බව උදාවේවායි ඉත සිතින් පතමි!
` : `
English Examples:
- Just as the Vesak lantern illuminates the darkness, may the teachings of Lord Buddha dispel all sorrows from your life and bring you absolute peace.
- May this holy occasion of Vesak inspire you to walk the path of truth, practice mindfulness, and live a life filled with kindness and compassion.
- Wishing you a Vesak filled with the joy of giving, the peace of meditation, and the blessings of the Dhamma. Have a peaceful Vesak!
- May the infinite blessings of Lord Buddha bring health, harmony, and contentment to you and your loved ones. Wishing you a meaningful Vesak Poya!
- Wishing you a blessed, peaceful, and joyful Vesak! May the light of Buddha's teachings guide you always.
- May the divine blessings of Lord Buddha bring peace, happiness, and prosperity to your life. Happy Vesak!
- On this holy day of Vesak, may your heart be filled with love, compassion, and eternal peace. Have a blessed Vesak!
- As we celebrate the Thrice-Blessed Day of Lord Buddha, may his timeless wisdom illuminate your path and bring ultimate serenity to your heart and home.
- May the blessings of the Triple Gem be with you and your family today and always. Wishing you a peaceful and spiritually uplifting Vesak festival!
- Let us replace hatred with love and anger with patience on this sacred day. Wishing you a truly blessed and reflective Vesak Full Moon Poya Day.
`}

Generate a new, unique Vesak wish message in ${isSinhala ? "Sinhala (සිංහල)" : "English"} that has a similar tone to the examples above.
${customTopic ? `Additional context or theme requested by user (remember, it must be Vesak/Buddhist related): ${customTopic}` : ""}
`;

    const result = await model.generateContent(systemInstruction);
    const text = result.response.text().trim().replace(/^["']|["']$/g, "");

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate wish message using AI." },
      { status: 500 }
    );
  }
}

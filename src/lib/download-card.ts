import { type Template } from "@/data/templates";
import { type Language } from "@/lib/types";
import { DM_Sans, Playfair_Display, Noto_Serif_Sinhala, Maname } from "next/font/google";

// Instantiate the same Google Fonts to get their exact compiled font-family strings
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const notoSerifSinhala = Noto_Serif_Sinhala({
  subsets: ["sinhala", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const maname = Maname({
  subsets: ["sinhala", "latin"],
  weight: ["400"],
  display: "swap",
});

export async function downloadCard(
  template: Template,
  sender: string,
  recipient: string,
  message: string,
  language: Language
) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Load background image and watermark image in parallel
  const img = new window.Image();
  img.crossOrigin = "anonymous";
  img.src = template.bg_url;

  const watermarkImg = new window.Image();
  watermarkImg.crossOrigin = "anonymous";
  watermarkImg.src = "/watermark.png";

  await Promise.all([
    new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    }),
    new Promise((resolve) => {
      watermarkImg.onload = resolve;
      watermarkImg.onerror = resolve;
    })
  ]);

  // 1. Draw Background Image
  ctx.drawImage(img, 0, 0, 1200, 630);

  // 2. Draw black semi-transparent overlay (base shadow overlay)
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(0, 0, 1200, 630);

  // 3. Draw gradient overlay (top and bottom shadows for depth)
  const gradient = ctx.createLinearGradient(0, 630, 0, 0);
  gradient.addColorStop(0, "rgba(0, 0, 0, 0.6)");
  gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.2)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0.4)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // 4. Calculate content layout
  const isSinhala = language === "si";
  const displaySender = sender || (isSinhala ? "ඔබේ නම" : "Your Name");
  const displayRecipient = recipient || (isSinhala ? "ඔබට" : "Friend");
  
  let displayMessage = message;
  if (!displayMessage) {
    displayMessage = isSinhala
      ? "මෙම පූජනීය වෙසක් දිනයේ ත්‍රිවිධ රත්නයේ ආශීර්වාදය ඔබට සාමය, සතුට හා ප්‍රඥාව ගෙන එන්නේය."
      : "May the Triple Gem bless you with peace, happiness, and wisdom on this sacred Vesak day.";
  }

  // Get resolved Next.js font families
  const fontDmSans = dmSans.style.fontFamily;
  const fontPlayfair = playfair.style.fontFamily;
  const fontNotoSerifSinhala = notoSerifSinhala.style.fontFamily;
  const fontManame = maname.style.fontFamily;

  // Define fonts with Next.js compiled font-family strings
  const titleFont = isSinhala
    ? `bold 22px ${fontManame}, "Maname", serif`
    : `bold 20px ${fontPlayfair}, "Playfair Display", serif`;
    
  const recipientFont = isSinhala
    ? `800 48px ${fontManame}, "Maname", serif`
    : `800 52px ${fontPlayfair}, "Playfair Display", serif`;

  const messageFont = isSinhala
    ? `600 22px ${fontNotoSerifSinhala}, "Noto Serif Sinhala", serif`
    : `600 22px ${fontDmSans}, "DM Sans", sans-serif`;

  const senderFont = isSinhala
    ? `bold 28px ${fontManame}, "Maname", serif`
    : `bold 26px ${fontPlayfair}, "Playfair Display", serif`;

  // Word wrap message text first to get the height
  ctx.font = messageFont;
  const words = displayMessage.split(" ");
  let line = "";
  const lines = [];
  const maxWidth = 660; // Max text area width

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  // Spacings and heights
  const lineSpacing = 32;
  const messageLinesHeight = lines.length * lineSpacing;
  
  // Calculate relative positions inside the frosted box (Y relative to cardY = 0)
  const relativeTitleY = 56;
  const relativeTitleLineY = 82;
  const relativeRecipientY = 132;
  const relativeMessageStartY = 195;
  const relativeDividerY = relativeMessageStartY + messageLinesHeight + 12;
  const relativeSenderY = relativeDividerY + 36;
  
  // Total card box height
  const cardH = relativeSenderY + 54; // Includes bottom padding
  const cardW = 840; // Fixed width matching screen proportion
  
  const cardX = (1200 - cardW) / 2;
  const cardY = (630 - cardH) / 2;

  // Calculate absolute coordinates
  const titleY = cardY + relativeTitleY;
  const titleLineY = cardY + relativeTitleLineY;
  const recipientY = cardY + relativeRecipientY;
  const messageStartY = cardY + relativeMessageStartY;
  const dividerY = cardY + relativeDividerY;
  const senderY = cardY + relativeSenderY;

  // 4a. Draw frosted card container with shadow
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // semi-transparent dark container
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 32;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 16;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
  } else {
    ctx.rect(cardX, cardY, cardW, cardH);
  }
  ctx.fill();
  ctx.restore();

  // Draw frosted glass white border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
  } else {
    ctx.rect(cardX, cardY, cardW, cardH);
  }
  ctx.stroke();

  // 5. Draw text
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Text Shadow styling helper
  const drawShadowedText = (
    text: string,
    x: number,
    y: number,
    font: string,
    color: string,
    shadowColor = "rgba(0, 0, 0, 0.9)",
    shadowBlur = 10
  ) => {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, x, y);
    ctx.restore();
  };

  // 5a. Draw Top Title
  const titleText = isSinhala ? "සුභ වෙසක් මංගල්‍යයක්" : "HAPPY VESAK";
  drawShadowedText(titleText, 600, titleY, titleFont, template.accent_color, "rgba(0,0,0,0.85)", 6);

  // Decorative lines below title
  ctx.strokeStyle = template.accent_color;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(600 - 60, titleLineY);
  ctx.lineTo(600 - 10, titleLineY);
  ctx.moveTo(600 + 10, titleLineY);
  ctx.lineTo(600 + 60, titleLineY);
  ctx.stroke();

  ctx.globalAlpha = 0.8;
  ctx.fillStyle = template.accent_color;
  ctx.beginPath();
  ctx.arc(600, titleLineY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // 5b. Draw Recipient
  const recText = isSinhala ? `ආදරණීය ${displayRecipient},` : `Dear ${displayRecipient},`;
  drawShadowedText(recText, 600, recipientY, recipientFont, template.text_color, "rgba(0, 0, 0, 0.95)", 10);

  // 5c. Draw wrapped message text
  for (let i = 0; i < lines.length; i++) {
    drawShadowedText(
      lines[i].trim(),
      600,
      messageStartY + i * lineSpacing + lineSpacing / 2,
      messageFont,
      template.text_color,
      "rgba(0, 0, 0, 0.85)",
      8
    );
  }

  // 5d. Divider below message
  ctx.strokeStyle = template.accent_color;
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(600 - 40, dividerY);
  ctx.lineTo(600 - 5, dividerY);
  ctx.moveTo(600 + 5, dividerY);
  ctx.lineTo(600 + 40, dividerY);
  ctx.stroke();

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = template.accent_color;
  ctx.beginPath();
  ctx.arc(600, dividerY, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // 5e. Draw Sender
  const sendText = isSinhala ? `— ${displaySender}` : `— With love, ${displaySender}`;
  drawShadowedText(sendText, 600, senderY, senderFont, template.accent_color, "rgba(0, 0, 0, 0.85)", 6);

  // 6. Draw Watermark Image
  const watermarkWidth = 140;
  const watermarkHeight = Math.round(watermarkWidth * (326 / 962)); // ~47px
  const watermarkX = 1200 - 24 - watermarkWidth;
  const watermarkY = 630 - 20 - watermarkHeight;

  ctx.save();
  ctx.globalAlpha = 0.6; // High opacity watermark (more than 50%)
  ctx.drawImage(watermarkImg, watermarkX, watermarkY, watermarkWidth, watermarkHeight);
  ctx.restore();

  // Trigger Download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `Vesak_Card_${displayRecipient.replace(/\s+/g, "_")}.png`;
  link.href = dataUrl;
  link.click();
}

// Simple in-memory URL store using a Node.js global singleton.
// Attaching to `global` ensures the same Map instance is shared
// across all route handlers within the same Node.js process,
// even when Next.js loads the module in different bundle chunks.

declare global {
  // eslint-disable-next-line no-var
  var __vesakUrlMap: Map<string, string> | undefined;
}

// Lazily initialize once and reuse
if (!global.__vesakUrlMap) {
  global.__vesakUrlMap = new Map<string, string>();
}

const urlMap = global.__vesakUrlMap;

// Generate a short 7-char alphanumeric code
function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function storeUrl(longUrl: string): string {
  // Return existing code for the same URL
  for (const [code, url] of urlMap.entries()) {
    if (url === longUrl) return code;
  }

  let code = generateCode();
  while (urlMap.has(code)) {
    code = generateCode();
  }
  urlMap.set(code, longUrl);
  return code;
}

export function getUrl(code: string): string | undefined {
  return urlMap.get(code);
}

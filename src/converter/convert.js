// ================== PREPROCESS ==================
function preprocessHinglish(text) {
  let t = " " + text.toLowerCase() + " ";
  t = t.replace(/haal chall/g, "haal chaal");
  t = t.replace(/kaha ho/g, "kahaan ho");
  t = t.replace(/ mai /g, " main ");
  t = t.replace(/ hu /g, " hoon ");
  return t.trim();
}

// ================== PHONETIC ==================
const phoneticMap = {
  kitab: "किताब",
  kisan: "किसान",
  vidya: "विद्या",
  gita: "गीता",
  shiksha: "शिक्षा",
};

function phoneticTransliterate(text) {
  return text
    .split(" ")
    .map(w => (phoneticMap[w] !== undefined ? phoneticMap[w] : w))
    .join(" ");
}

// ================== OFFLINE FALLBACK ==================
const fallbackDict = {
  tum: "तुम",
  kya: "क्या",
  kar: "कर",
  rahe: "रहे",
  raha: "रहा",
  ho: "हो",
  hoon: "हूँ",
  main: "मैं",
  theek: "ठीक",
};

function offlineTranslate(text) {
  return text
    .split(" ")
    .map(w => (fallbackDict[w] !== undefined ? fallbackDict[w] : w))
    .join(" ");
}

// ================== GOOGLE TRANSLATE ==================
async function googleTranslate(text) {
  const res = await fetch("/.netlify/functions/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!res.ok) throw new Error("API fail");
  const data = await res.json();
  return data.translated;
}

// ================== NORMALIZATION ==================
function normalizeUnicodeHindi(text) {
  const chars = text.split("");
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === "\u093F" && i > 0) {
      [chars[i - 1], chars[i]] = [chars[i], chars[i - 1]];
    }
  }
  return chars.join("");
}

// ================== KRUTIDEV MAP (COMPLETE CORE) ==================
const krutiMap = {
  "\u0915": "d", "\u093F": "f", "\u0924": "r", "\u093E": "k", "\u092C": "c",
  "\u0938": "l", "\u0928": "u", "\u0936": "'k", "\u0937": "\"k",
  "\u0930": "j", "\u0939": "g", "\u092E": "e", "\u092F": ";",
  "\u094D": "~", "\u0947": "s", "\u094B": "ks",
  "\u0941": "q", "\u0942": "w", "\u0923": ".k"
};

function unicodeToKruti(text) {
  let out = "";
  for (const ch of text) {
    out += krutiMap[ch] !== undefined ? krutiMap[ch] : ch;
  }
  return out;
}

// ================== MAIN CONVERT ==================
export async function convert(text, font = "krutidev") {
  const pre = preprocessHinglish(text);
  const phonetic = phoneticTransliterate(pre);

  let hindi;
  try {
    hindi = await googleTranslate(phonetic);
  } catch {
    hindi = phonetic !== pre ? phonetic : offlineTranslate(pre);
  }

  const normalized = normalizeUnicodeHindi(hindi);
  return unicodeToKruti(normalized);
}

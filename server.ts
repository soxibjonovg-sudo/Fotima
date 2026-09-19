import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Gemini Q&A and Math Tutor API
app.post("/api/gemini/ask", async (req, res) => {
  try {
    const { question, difficulty = "hard", history = [] } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Savol kiritilmadi" });
    }

    const ai = getAIClient();
    if (!ai) {
      // Return a smart high-quality algorithmic fallback if API key is not configured yet
      return res.json({
        answer: `**Eslatma:** Gemini API kaliti sozlanmagan, lekin quyidagi asosiy qoidalar yordamida savolingizga javob topishingiz mumkin:\n\n` +
          `• **EKUB(a, b)** — ikkala sonni ham qoldiqsiz bo'ladigan eng katta natural son. Uni topish uchun sonlar tub ko'paytuvchilarga ajratiladi va umumiy tub ko'paytuvchilarning eng kichik darajalari ko'paytiriladi.\n` +
          `• **EKUK(a, b)** — ikkala songa ham qoldiqsiz bo'linadigan eng kichik natural son. Barcha qatnashgan tub sonlarning eng katta darajalari ko'paytmasiga teng.\n` +
          `• **Oltin formula:** EKUB(a, b) × EKUK(a, b) = a × b.\n` +
          `• **Evklid algoritmi:** EKUB(a, b) = EKUB(b, a mod b). Bu katta sonlar uchun eng tezkor usuldir!`,
        source: "local-fallback",
      });
    }

    const systemInstruction = `Siz matematika fanidan oliy darajadagi professor va pedagogik mutaxassissiz. Sizning asosiy ixtisosligingiz — sonlar nazariyasi, xususan:
1. EKUB (Eng Katta Umumiy Bo'luvchi - GCD)
2. EKUK (Eng Kichik Umumiy Karrali - LCM)
3. Tub sonlar, murakkab sonlar va tub ko'paytuvchilarga ajratish
4. Evklid algoritmi (ayirish va bo'lish usullari)
5. Diofant tenglamalari (ax + by = c) va EKUB
6. Matematik olimpiada va real hayotiy masalalar.

Foydalanuvchi qiyin va murakkab darajadagi tushuntirishlarni, tezkor va aniq javoblarni so'radi (${difficulty} daraja).
Javoblaringiz:
- O'zbek tilida juda chiroyli, tushunarli, matematik aniqlikda va bosqichma-bosqich bo'lsin.
- Formulalarni aniq keltiring (masalan, EKUB(a, b) · EKUK(a, b) = a · b).
- Har doim aniq sonli misollar va bosqichlarni ko'rsating.
- Agar foydalanuvchi murakkab masala so'rasa, yechimi va tahlili bilan to'liq tushuntirib bering.
- Javobni Markdown formatida (sarlavhalar, qalin shriftlar, ro'yxatlar) chiroyli tuzing.`;

    let prompt = question;
    if (history && history.length > 0) {
      const historyContext = history
        .map((h: { role: string; text: string }) => `${h.role === "user" ? "Foydalanuvchi" : "Ustoz"}: ${h.text}`)
        .join("\n");
      prompt = `Oldingi suhbat:\n${historyContext}\n\nYangi savol: ${question}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "Javob hosil qilib bo'lmadi.";
    return res.json({ answer: text, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini API xatoligi:", error);
    return res.status(500).json({
      error: "Gemini serverida xatolik yuz berdi: " + (error?.message || "Noma'lum xatolik"),
    });
  }
});

// Challenge generator
app.post("/api/gemini/challenge", async (req, res) => {
  try {
    const { topic = "ekub_ekuk", level = "olympiad" } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        problem: "Ikki sonning EKUBi 18 ga, ularning EKUKi esa 216 ga teng. Agar sonlardan biri 54 bo'lsa, ikkinchi sonni toping va yechish usulini tushuntiring.",
        hint: "EKUB(a, b) * EKUK(a, b) = a * b formulasidan foydalaning.",
        solution: "a = 54. 18 * 216 = 54 * b => b = (18 * 216) / 54 = 216 / 3 = 72. Javob: 72.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `Mavzu: EKUB va EKUK bo'yicha ${level} (murakkab/olimpiada) darajasidagi qiziqarli amaliy yoki nazariy matematik masala yaratib ber.
Javob faqat quyidagi formatdagi JSON bo'lsin:
{
  "title": "Masala nomi",
  "story": "Masala sharti (matematik yoki hayotiy qiziqarli syujet)",
  "question": "Aniq savol",
  "hint": "Yordamchi maslahat",
  "solution": "Bosqichma-bosqich batafsil yechimi va yakuniy javobi"
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Challenge error:", err);
    return res.json({
      title: "Olimpiada Masalasi: Chiroqlar sinxronligi",
      story: "Uchta svetofor mos ravishda har 24, 36 va 60 soniyada qizil chiroqni yoqadi. Agar ular soat 08:00 da bir vaqtda yongan bo'lsa...",
      question: "Keyingi safar ular qachon yana birgalikda yonadi?",
      hint: "24, 36 va 60 sonlarining EKUKini toping.",
      solution: "24 = 2^3 * 3, 36 = 2^2 * 3^2, 60 = 2^2 * 3 * 5. EKUK = 2^3 * 3^2 * 5 = 8 * 9 * 5 = 360 soniya = 6 daqiqa. Javob: 08:06 da.",
    });
  }
});

// Vite middleware in dev or static files in prod
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

start();

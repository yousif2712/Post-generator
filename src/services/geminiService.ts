import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateHooks(topic: string): Promise<string[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 scroll-stopping hook options for a LinkedIn post based on this topic: "${topic}".
    Rules for hooks:
    - Each hook must be exactly 1 sentence.
    - Hooks must be bold, surprising, thought-provoking, or slightly controversial.
    - Avoid clichés and generic statements.
    - Format: Return ONLY a JSON array of strings (no extra text or numbering).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse hooks", e);
    return [];
  }
}

export async function generateFullPost(selectedHook: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write a LinkedIn post of 120–180 words starting with this hook: "${selectedHook}".
    Structure:
      1. The selected hook (exactly as provided)
      2. Supporting data, insight, or statistic
      3. Explanation or perspective
      4. Practical takeaway / actionable advice
      5. Engagement question or thought-provoking ending
    Tone: Professional, confident, authoritative, yet approachable.
    Style:
      - Short paragraphs, line breaks for readability.
      - Add 3–5 relevant LinkedIn hashtags for visibility.
      - Minimal emojis only if they enhance engagement.
      - The post must be ready to post directly on LinkedIn.`,
  });

  return response.text || "";
}

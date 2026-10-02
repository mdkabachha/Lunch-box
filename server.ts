import { GoogleGenAI } from "@google/genai";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// In-memory cache to prevent re-calling Gemini API for already generated lines
const ttsServerCache = new Map<string, string>();

/**
 * Text-To-Speech endpoint using gemini-3.8-flash-tts
 * Supports single-speaker line generation or multi-speaker duo dialogue performance
 * with server-side caching and resilient rate-limit handling.
 */
app.post("/api/tts", async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        audioData: null,
        rateLimited: false,
        message: "GEMINI_API_KEY not configured on server",
      });
    }

    const {
      text,
      speaker = "Tillu",
      voiceName = "Kore",
      style = "Cheerful Indian school girl, crisp, sweet, friendly",
      isMultiSpeaker = false,
      dialogueParts = [],
    } = req.body;

    const cacheKey = isMultiSpeaker
      ? `multi-${JSON.stringify(dialogueParts)}`
      : `${voiceName}-${text}`;

    if (ttsServerCache.has(cacheKey)) {
      return res.json({
        audioData: ttsServerCache.get(cacheKey),
        format: "audio/wav",
        fromCache: true,
      });
    }

    if (isMultiSpeaker && Array.isArray(dialogueParts) && dialogueParts.length > 0) {
      // Dual-speaker dialogue with gemini-3.8-flash-tts
      const parts = dialogueParts.map((item: any) => ({
        text: `${item.speaker}: ${item.text}`,
        speechMetadata: {
          speaker: item.speaker,
          style: item.style || "Excited, expressive school child",
        },
      }));

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash-tts",
          contents: [
            {
              role: "user",
              parts,
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: "Tillu",
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: "Puck" },
                    },
                  },
                  {
                    speaker: "Millu",
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: "Kore" },
                    },
                  },
                ],
              },
            },
          },
        });

        const base64Audio =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const audioUri = `data:audio/wav;base64,${base64Audio}`;
          ttsServerCache.set(cacheKey, audioUri);
          return res.json({
            audioData: audioUri,
            format: "audio/wav",
          });
        }
      } catch (multiErr: any) {
        const isRateLimit =
          multiErr?.status === "RESOURCE_EXHAUSTED" ||
          multiErr?.message?.includes("429") ||
          multiErr?.message?.includes("quota");

        if (isRateLimit) {
          // Gracefully inform client to use WebSpeech fallback without crashing
          return res.json({
            audioData: null,
            rateLimited: true,
            message: "Quota limit reached on gemini-3.8-flash-tts. Switching to browser speech.",
          });
        }
        // Non-rate limit error
        return res.json({
          audioData: null,
          rateLimited: false,
          message: multiErr.message || "TTS generation failed",
        });
      }
    } else {
      // Single speaker line generation using gemini-3.8-flash-tts
      if (!text) {
        return res.status(400).json({ error: "Missing text parameter" });
      }

      // Try primary model gemini-3.8-flash-tts first
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash-tts",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: text,
                  speechMetadata: {
                    style: style || "Lively, clear Indian school student speaking",
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
              },
            },
          },
        });

        const base64Audio =
          response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const audioUri = `data:audio/wav;base64,${base64Audio}`;
          ttsServerCache.set(cacheKey, audioUri);
          return res.json({
            audioData: audioUri,
            format: "audio/wav",
          });
        }
      } catch (primaryErr: any) {
        const isRateLimit =
          primaryErr?.status === "RESOURCE_EXHAUSTED" ||
          primaryErr?.message?.includes("429") ||
          primaryErr?.message?.includes("quota");

        if (isRateLimit) {
          // Attempt fallback to gemini-3.8-flash-lite-tts which has separate quota
          try {
            const liteResponse = await ai.models.generateContent({
              model: "gemini-3.8-flash-lite-tts",
              contents: [
                {
                  role: "user",
                  parts: [{ text }],
                },
              ],
              config: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
                  },
                },
              },
            });

            const liteAudio =
              liteResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (liteAudio) {
              const audioUri = `data:audio/wav;base64,${liteAudio}`;
              ttsServerCache.set(cacheKey, audioUri);
              return res.json({
                audioData: audioUri,
                format: "audio/wav",
                model: "gemini-3.8-flash-lite-tts",
              });
            }
          } catch (liteErr) {
            // Both models reached quota limit; return graceful fallback response
          }

          return res.json({
            audioData: null,
            rateLimited: true,
            message: "Gemini 3.8 Flash TTS free-tier rate limit reached (3 RPM). Using browser speech.",
          });
        }

        return res.json({
          audioData: null,
          rateLimited: false,
          message: primaryErr.message || "Failed to generate speech",
        });
      }
    }

    return res.json({ audioData: null, rateLimited: false });
  } catch (error: any) {
    return res.json({
      audioData: null,
      rateLimited: false,
      message: error.message || "Failed to process TTS request",
    });
  }
});

/**
 * Generate extended dialogues & healthy food insights with gemini-3.8-flash
 */
app.post("/api/generate-dialogue", async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
    }

    const { topic = "fruits and vegetables", customPrompt = "" } = req.body;

    const promptText = `
You are an elementary school drama & nutrition teacher. Create a short, charming 4-line duo dialogue for two Class 4 girls named Tillu and Millu in Hindi with English translations.
Topic: "${topic}".
User note: "${customPrompt}".

Return valid JSON with format:
{
  "topic": "${topic}",
  "title": "Short title in Hindi & English",
  "lines": [
    {
      "speaker": "Tillu",
      "hindi": "Hindi dialogue text",
      "hinglish": "Hinglish transliteration",
      "english": "English translation",
      "emotion": "cheerful/curious/enthusiastic",
      "foodFact": "Short kid-friendly nutritional tip about this line"
    }
  ],
  "healthyLesson": "Key takeaway lesson for children"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error generating dialogue:", error);
    return res.status(500).json({ error: error.message || "Dialogue generation error" });
  }
});

/**
 * Nutrition inspector for lunchbox game
 */
app.post("/api/evaluate-food", async (req: Request, res: Response) => {
  try {
    const ai = getGeminiClient();
    const { foodName } = req.body;
    if (!foodName) {
      return res.status(400).json({ error: "Food name required" });
    }

    if (!ai) {
      // Fallback response if key is missing
      const isHealthy = !["burger", "chips", "cola", "candy", "pizza"].includes(
        foodName.toLowerCase()
      );
      return res.json({
        foodName,
        isHealthy,
        category: isHealthy ? "Healthy Lunch" : "Junk Food",
        tilluComment: isHealthy
          ? "अरे वाह! यह तो बहुत पौष्टिक है!"
          : "यह तो कभी-कभार खाने की चीज़ है, रोज़ नहीं!",
        milluComment: isHealthy
          ? "यह खाने से हम स्ट्रॉन्ग और फुर्तीले बनेंगे!"
          : "हाँ, हमें फल, रोटी या दाल-चावल खाना चाहिए!",
        benefits: isHealthy
          ? ["देता है भरपूर ऊर्जा", "दिमाग और हड्डियों को बनाता है मजबूत"]
          : ["ज्यादा तेल और चीनी", "कम पोषण"],
      });
    }

    const promptText = `Analyze this food for elementary school lunchbox: "${foodName}".
Provide kid-friendly Hindi and English analysis from Tillu & Millu (Class 4 schoolgirls).
Return JSON:
{
  "foodName": "${foodName}",
  "isHealthy": boolean,
  "category": "Healthy Lunch" or "Junk Food" or "Occasional Treat",
  "tilluComment": "Hindi reaction sentence by Tillu",
  "milluComment": "Hindi reaction sentence by Millu",
  "benefits": ["kid friendly benefit 1 in Hindi", "benefit 2 in Hindi"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Mount Vite or static server
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();

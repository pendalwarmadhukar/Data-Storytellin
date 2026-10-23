import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "50mb" }));

  // Initialize Gemini AI client if key exists
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  }) : null;

  // API endpoint for AI Data Story & Narrative generation
  app.post("/api/gemini/story", async (req, res) => {
    try {
      const { datasetSummary, userPrompt } = req.body;

      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key not configured. Using deterministic local fallback.",
          fallback: true
        });
      }

      const prompt = `You are a senior data scientist and expert data storyteller. 
Analyze the following dataset summary and user prompt to generate a rigorous, insightful, and comprehensive data narrative report.

Dataset Summary:
${JSON.stringify(datasetSummary, null, 2)}

User Custom Context/Prompt: ${userPrompt || "Provide a comprehensive executive data story and key findings."}

Return a valid JSON object with the following keys:
- "executiveSummary": A concise 2-3 paragraph executive summary of the dataset.
- "keyFindings": An array of 4-6 key analytical findings, each containing "title", "description", and "significance".
- "trendsAndPatterns": An array of observed trends, time-series insights, or correlations.
- "anomaliesAndOutliers": An array of flagged outliers or data anomalies with explanation.
- "limitations": An array of dataset limitations, potential biases, or missing dimensions.
- "suggestedFollowUps": An array of 3-4 recommended follow-up questions or further analytical steps.
- "insightCards": An array of 3-5 structured insight cards for the Story Builder, each containing "title", "explanation", "keyFigure", and "takeaway".

Adhere strictly to measured facts, distinguish facts from hypotheses, and do not invent causes or values. Return ONLY JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini AI");
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        // Fallback cleanup if markdown code blocks exist
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        parsed = JSON.parse(cleaned);
      }

      res.json({ success: true, story: parsed });
    } catch (error: any) {
      console.error("Gemini Story Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI story" });
    }
  });

  // Vite middleware for frontend in dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Data Storytelling Studio server running on http://localhost:${PORT}`);
  });
}

startServer();

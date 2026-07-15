import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ CRITICAL ERROR: GEMINI_API_KEY is not defined in your server/.env file!");
} else {
  console.log("🔑 API Key detected successfully.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

const STUDY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    flashcards: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "answer"]
      }
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          correct: { type: Type.STRING }
        },
        required: ["question", "options", "correct"]
      }
    }
  },
  required: ["title", "flashcards", "quiz"]
};

app.post('/api/generate', async (req, res) => {
  const { topic } = req.body;
  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Topic cannot be blank.' });
  }

  console.log(`📡 Received request to generate module for topic: "${topic}"`);

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash', // Update to the active 2026 model
        contents: `Generate an analytical study module for: "${topic}". Build rigorous flashcards for core terms and a comprehensive multiple choice quiz.`,
        config: {
            responseMimeType: 'application/json',
            responseSchema: STUDY_SCHEMA,
            systemInstruction: "You are an elite educational engineer. Build top-tier flashcards and multiple-choice questions. The string value provided in the 'correct' property must perfectly match one of the string variants present inside your 'options' list.",
        }
    });

    const rawText = response.text;
    console.log("✅ Received raw response from Gemini");
    
    let parsedData;
    try {
      const cleanJson = rawText.replace(/```json|```/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.error("❌ Fail to parse JSON payload:", rawText);
      return res.status(502).json({ error: 'AI engine generated an unparseable response payload.' });
    }

    if (!parsedData.flashcards?.length || !parsedData.quiz?.length) {
      return res.status(502).json({ error: 'AI layout engine returned an incomplete study structure.' });
    }

    res.json(parsedData);
  } catch (error) {
    // This will now print the exact underlying API error in your terminal window!
    console.error('❌ Gemini API Pipeline Error Details:', error);
    res.status(500).json({ error: error.message || 'Internal server error processing the request.' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Resilient Server deployed on port ${PORT}`));
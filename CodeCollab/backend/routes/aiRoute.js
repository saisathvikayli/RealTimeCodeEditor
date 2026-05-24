import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ask the ai a question, optionally with code context
router.post("/ask", async (req, res) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

        const { question, code, language } = req.body;

        if (!question) {
            return res.status(400).json({ message: "Question is required" });
        }

        // build prompt with code context if provided
        let prompt = question;
        if (code && code.trim().length > 0) {
            prompt = `Here is the current ${language || "code"} the user is working on:\n\n\`\`\`${language || ""}\n${code}\n\`\`\`\n\nUser's question: ${question}\n\nGive a clear, concise answer. If suggesting code changes, use markdown code blocks.`;
        }

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        res.status(200).json({ message: "AI response", answer: text });
    } catch (error) {
        console.error("AI Error:", error.message);
        res.status(500).json({ message: "AI failed to respond", error: error.message });
    }
});

export default router;
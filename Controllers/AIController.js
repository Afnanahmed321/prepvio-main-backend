import { GoogleGenAI } from "@google/genai";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("AI Error: GEMINI_API_KEY is missing in environment variables");
            return res.status(500).json({ success: false, message: "AI configuration missing" });
        }

        // Initialize Gemini Client inside the handler to ensure env is loaded
        const genAI = new GoogleGenAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log('AI Request received:', message);

        // Generate content using @google/genai
        const result = await model.generateContent(message);
        const response = await result.response;
        const reply = response.text();

        console.log('AI Response generated successfully');

        return res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error("AI Chat Error Detail:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process AI request",
            error: error.message
        });
    }
};
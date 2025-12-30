import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const ai = new GoogleGenerativeAI(config.GOOGLE_API_KEY);
const model = ai.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a creative social media assistant. Generate only one attractive and engaging half-line caption for the image with 1-2 trending hashtags and emojis.",
});


export async function generateTextResponse(prompt) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response.text(); 
    return response;
  } catch (error) {
    console.error("Text AI Error:", error);
    throw error;
  }
}


export async function generateCaptionFromImage(imageBuffer) {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg", // or "image/png"
                data: imageBuffer.toString("base64"),
              },
            },
            {
              text: "Write a short caption for this image.",
            },
          ],
        },
      ],
    });

    const response = await result.response.text();
    return response;
  } catch (error) {
    console.error("Image AI Error:", error);
    throw error;
  }
}


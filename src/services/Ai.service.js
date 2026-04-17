// import { GoogleGenerativeAI } from "@google/generative-ai";
// import config from "../config/config.js";

// const ai = new GoogleGenerativeAI(config.GOOGLE_API_KEY);
// const model = ai.getGenerativeModel({
//   model: "gemini-3-flash-preview",
//   systemInstruction:
//     "You are a creative social media assistant. Generate only one attractive and engaging half-line caption for the image with 1-2 trending hashtags and emojis.",
// });

// export async function generateTextResponse(prompt) {
//   try {
//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     });

//     const response = await result.response.text();
//     return response;
//   } catch (error) {
//     console.error("Text AI Error:", error.message);
//   }
// }

// export async function generateCaptionFromImage(imageBuffer) {
//   try {
//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               inlineData: {
//                 mimeType: "image/jpeg", // or "image/png"
//                 data: imageBuffer.toString("base64"),
//               },
//             },
//             {
//               text: "Write a short caption for this image.",
//             },
//           ],
//         },
//       ],
//     });

//     const response = await result.response.text();
//     return response;
//   } catch (error) {
//     console.error("Image AI Error:", error);
//     throw error;
//   }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";

const ai = new GoogleGenerativeAI(config.GOOGLE_API_KEY);
const model = ai.getGenerativeModel({
  model: "gemini-3-flash-preview",
  systemInstruction:
    "You are a creative social media assistant. Generate only one attractive and engaging half-line caption for the image with 1-2 trending hashtags and emojis.",
});

// Helper function to handle retries for 429
async function handleGenerateContent(requestFn) {
  try {
    const result = await requestFn();
    return await result.response.text();
  } catch (error) {
    // Retry on 429 Too Many Requests
    if (error.status === 429 && error.errorDetails?.[2]?.retryDelay) {
      const delay = parseFloat(error.errorDetails[2].retryDelay) * 1000;
      console.warn(`Quota exceeded. Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
      return handleGenerateContent(requestFn);
    }

    // Handle 404 or other errors
    if (error.status === 404) {
      console.error(
        "Model not found or unsupported for generateContent:",
        error.message,
      );
    } else {
      console.error("AI Error:", error.message);
    }
    throw error; // propagate for controller to handle
  }
}

// Text generation
export async function generateTextResponse(prompt) {
  return handleGenerateContent(() =>
    model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    }),
  );
}

// Image caption generation
export async function generateCaptionFromImage(imageBuffer) {
  return handleGenerateContent(() =>
    model.generateContent({
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
    }),
  );
}

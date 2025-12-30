// import { Router } from "express";
// import { generateTextResponse } from "../services/Ai.service.js";

// const router = Router();

// router.get("/", async (req, res) => {
//   try {
//     const prompt = req.query.prompt;
//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     const response = await generateTextResponse(prompt);
//     res.status(200).json({ response });
//   } catch (err) {
//     console.error("Error generating content:", err);
//     res.status(500).json({ error: "Failed to generate content" });
//   }
// });

// export default router;

import { Router } from "express";
import { generateTextResponse } from "../services/Ai.service.js";

const router = Router();

// Text chat with AI
router.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await generateTextResponse(prompt);
    res.status(200).json({ response });
  } catch (err) {
    console.error("Error generating content:", err);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

export default router;

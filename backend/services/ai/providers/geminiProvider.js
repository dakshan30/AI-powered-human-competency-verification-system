const { GoogleGenerativeAI } = require("@google/generative-ai");

/*
====================================
INIT
====================================
*/

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/*
====================================
HELPER - SLEEP
====================================
*/

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/*
====================================
MODELS - Fallback chain
====================================
*/

const MODELS = [
  "gemini-2.0-flash-lite",  // ✅ Add this - highest free quota
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.0-pro",         // ✅ Add this as last resort
];

/*
====================================
GENERATE CONTENT
====================================
*/

exports.generateContent = async (prompt) => {
  for (const modelName of MODELS) {
    const retries = 2; // ✅ Reduced from 3 to 2

    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Trying model: ${modelName} (Attempt ${i + 1})`);

        const model = genAI.getGenerativeModel({ model: modelName });

        const finalPrompt =
          typeof prompt === "string" ? prompt : JSON.stringify(prompt);

        /*
        ✅ TIMEOUT - 20 seconds max per attempt
        */
        const generatePromise = model.generateContent(finalPrompt);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Gemini timeout after 20s")),
            20000
          )
        );

        const result = await Promise.race([
          generatePromise,
          timeoutPromise,
        ]);

        const text = result.response.text();

        console.log(`Success with model: ${modelName}`);

        return text;

      } catch (error) {
        const status = error?.status;

        const isRetryable =
          status === 429 ||
          status === 503 ||
          error?.message?.includes("429") ||
          error?.message?.includes("503") ||
          error?.message?.includes("Too Many Requests") ||
          error?.message?.includes("Service Unavailable") ||
          error?.message?.includes("high demand") ||
          error?.message?.includes("timeout");

        if (isRetryable && i < retries - 1) {
          const waitTime = (i + 1) * 5000; // ✅ Reduced from 10s to 5s
          console.log(
            `Model ${modelName} unavailable (${status}). Retrying in ${(i + 1) * 5}s...`
          );
          await sleep(waitTime);
          continue;
        }

        console.log(
          `Model ${modelName} failed (${status}). Trying next model...`
        );
        break;
      }
    }
  }

  throw new Error("Gemini generation failed");
};
import { GoogleGenerativeAI } from "@google/generative-ai";
export async function analyzeContent(text) {
  // have made a api key from google ai stidio and i am using it here
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Check your .env file and main script."
    );
  }

  try {
    // making the instance of the gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    // specifying the model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
    // this prompt will be send to the gemini
    const prompt = `You are an AI content analyzer. Given the extracted text from a document, analyze it and return the following:

1. **Concise Summary** – 3–5 sentences capturing the core message.
2. **Tone Analysis** – identify the dominant tone (e.g., formal, persuasive, informative, emotional) and explain why.
3. **Engagement Suggestions** – provide 3 actionable improvements to increase clarity, flow, or audience engagement.
4. **Keywords** – extract 5–10 important keywords from the content.

Text to analyze:
${text}`;

    const result = await model.generateContent(prompt);
    // getting the text from the response;
    const answer = result.response.text();
    return answer;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error(
      "Failed to analyze content with Gemini. Check your API key and network connection."
    );
  }
}

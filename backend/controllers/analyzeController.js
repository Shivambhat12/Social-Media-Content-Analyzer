import { analyzeContent } from "../geminiService/geminiAi.js";

export const handleAnalyze = async (req, res) => {
  // console.log("here in handle analyze");
  // text will be the extracted text from the util folder
  const { text } = req.body;
  // console.log(text);
  if (!text) {
    return res
      .status(400)
      .json({ error: "No text content provided for analysis." });
  }

  try {
    // sending the text to the gemini service and analysis will hold the text returned by the gemini
    const analysis = await analyzeContent(text);

    if (!analysis || analysis.error) {
      return res.status(500).json({
        success: false,
        error: analysis.error || "Analysis failed.",
      });
    }

    res.status(200).json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    console.error("Error during AI analysis:", error);
    res.status(500).json({
      success: false,
      error: "A server error occurred while processing the analysis request.",
    });
  }
};

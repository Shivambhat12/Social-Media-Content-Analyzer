import Tesseract from "tesseract.js";

export default async function extractOCR(path) {
  const result = await Tesseract.recognize(path, "eng");
  return result.data.text;
}

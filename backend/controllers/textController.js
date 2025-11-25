import fs from "fs";
import parsePDF from "../utils/pdf.js";
import extractOCR from "../utils/ocr.js";

export const handleText = async (req, res) => {
  // console.log(111);
  try {
    const filePath = req.file.path;
    const type = req.file.mimetype;
    // checking the mimetype of the sent file
    let text = "";
    if (type.includes("pdf")) {
      // directing it to the pdfparse module
      text = await parsePDF(filePath);
    } else {
      // directing it to the ocr module
      text = await extractOCR(filePath);
    }

    fs.unlinkSync(filePath);
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

import fs from "fs";
import pdf from "pdf-parse";

export default async function parsePDF(path) {
  const data = await pdf(fs.readFileSync(path));
  return data.text;
}

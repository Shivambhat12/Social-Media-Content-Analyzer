import express from "express";
import cors from "cors";
import uploadRouter from "./routes/upload.js";
import dotenv from "dotenv";

const app = express();
// using this evn variables will be available throughout the backend folder
dotenv.config();
const PORT = process.env.PORT || 5001;
app.use(cors());
app.use(express.json());
// console.log(process.env.GEMINI_API_KEY);
// only router handling the calls
app.use("/api", uploadRouter);

app.listen(PORT, () => console.log("Server running on 5000"));

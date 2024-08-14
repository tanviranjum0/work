import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { appConfig } from "./config/appConfig.js";
import { aiController } from "./controllers/aiController.js";

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT;

// Get Gemini API Response
app.get("/", (req, res) => {
  res.json("Welcome to Gemini AI Server");
});
app.post("/chat-with-gemini", aiController);

// App listening
app.listen(PORT, () => {
  console.log("Gemini AI Server is listening on port number", PORT);
});

import { GoogleGenAI } from "@google/genai";
import config from "../config/index.js";

// A single, shared Gemini client — built once from your API key. Every
// AI feature in the app reuses THIS instance, rather than creating a
// new client every time. Same pattern as having one shared
// axiosInstance on the frontend instead of configuring axios fresh in
// every file that needs it.
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

export default ai;
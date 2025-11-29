import { GoogleGenAI, Chat, Content } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

let chatSession: Chat | null = null;
let ai: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is missing.");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const initializeChat = async (): Promise<string> => {
  const client = getAIClient();
  chatSession = client.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, 
    },
    history: [],
  });
  
  // Trigger the first turn manually as per instructions to "Immediately start Briefing"
  // We simulate a "System Start" signal to get the bot to output its greeting.
  try {
    const response = await chatSession.sendMessage({ message: "SYSTEM_START_SIGNAL: Initialize the session." });
    return response.text || "Architect Online. System status: Unknown.";
  } catch (error) {
    console.error("Initialization error:", error);
    return "Error initializing Architect Core. Please check API Key.";
  }
};

export const sendMessageToGemini = async (text: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Failed to initialize chat session.");
  }

  try {
    const response = await chatSession.sendMessage({ message: text });
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
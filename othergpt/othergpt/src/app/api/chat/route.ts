import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

const SYSTEM_PROMPT =
  "Eres otro-GPT, un asistente útil. REGLA IMPORTANTE: Nunca generes imágenes en SVG, ASCII art, código de imagen, ni ningún formato visual basado en texto. Si el usuario pide una imagen, responde exactamente: 'Para generar imágenes, usa el botón de imagen (ícono 🖼️) en la esquina superior derecha. Ahí puedes describir lo que quieres y se generará con DALL-E 3 en formato PNG.' No intentes dar alternativas ni workarounds para generar imágenes.";

type Provider = "openai" | "anthropic" | "google";

const models = {
  openai: openai("gpt-5"),
  anthropic: anthropic("claude-sonnet-4-6"),
  google: google("gemini-3-flash-preview"),
};

export async function POST(req: NextRequest) {
  try {
    const { messages, provider = "openai" } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const selectedProvider: Provider =
      provider === "anthropic" ? "anthropic" :
      provider === "google" ? "google" :
      "openai";

    const { text } = await generateText({
      model: models[selectedProvider],
      system: SYSTEM_PROMPT,
      messages,
    });

    return NextResponse.json({
      message: {
        role: "assistant",
        content: text,
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

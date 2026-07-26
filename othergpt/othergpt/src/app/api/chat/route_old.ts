import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

const openai = new OpenAI();
const anthropic = new Anthropic();
const google = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY ?? "",
  httpOptions: { apiVersion: "v1beta" },
});

export async function POST(request: Request) {
  try {
    const { messages, model = "gpt-5-nano", systemPrompt = "" } = await request.json();

    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage?.content) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    if (model.startsWith("claude-")) {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 1024,
        ...(systemPrompt && { system: systemPrompt }),
        messages,
      });
      const block = response.content[0];
      if (block.type !== "text") {
        return Response.json({ error: "Unexpected response type" }, { status: 500 });
      }
      return Response.json({ role: "assistant", content: block.text });

    } else if (model.startsWith("gemini-")) {
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await google.models.generateContent({
        model,
        contents,
        config: systemPrompt
          ? { systemInstruction: { parts: [{ text: systemPrompt }] } }
          : undefined,
      });

      return Response.json({ role: "assistant", content: response.text });

    } else {
      const systemMessages = systemPrompt
        ? [{ role: "system" as const, content: systemPrompt }]
        : [];

      const completion = await openai.chat.completions.create({
        model,
        messages: [...systemMessages, ...messages],
      });
      return Response.json({ role: "assistant", content: completion.choices[0].message.content });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect to the API";
    return Response.json({ error: message }, { status: 500 });
  }
}

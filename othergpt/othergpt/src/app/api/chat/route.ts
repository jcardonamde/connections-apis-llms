import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI();
const anthropic = new Anthropic();

export async function POST(request: Request) {
  try {
    const { messages, model = "gpt-5-nano" } = await request.json();

    const lastUserMessage = messages[messages.length - 1];
    if (!lastUserMessage?.content) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    if (model.startsWith("claude-")) {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 1024,
        messages,
      });
      const block = response.content[0];
      if (block.type !== "text") {
        return Response.json({ error: "Unexpected response type" }, { status: 500 });
      }
      return Response.json({ role: "assistant", content: block.text });
    } else {
      const completion = await openai.chat.completions.create({ model, messages });
      return Response.json({ role: "assistant", content: completion.choices[0].message.content });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to connect to the API";
    return Response.json({ error: message }, { status: 500 });
  }
}

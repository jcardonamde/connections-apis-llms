import OpenAI from "openai";

const client = new OpenAI();

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const lastUserMessage = messages[messages.length - 1];
    const content = lastUserMessage?.content;

    if (!content) {
      return Response.json({ error: "No message provided" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages,
    });

    const assistantMessage = completion.choices[0].message;

    return Response.json({ role: "assistant", content: assistantMessage.content });
  } catch (error) {
    return Response.json({ error: "Failed to connect to the API" }, { status: 500 });
  }
}

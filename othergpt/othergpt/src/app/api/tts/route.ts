import OpenAI from "openai";

const client = new OpenAI();

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    const mp3 = await client.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = await mp3.arrayBuffer();

    return new Response(buffer, {
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch {
    return Response.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}

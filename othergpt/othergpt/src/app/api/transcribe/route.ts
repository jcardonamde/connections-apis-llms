import OpenAI from "openai";

const client = new OpenAI();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as File;

    if (!audio) {
      return Response.json({ error: "No audio provided" }, { status: 400 });
    }

    const transcription = await client.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: "es",
    });

    return Response.json({ text: transcription.text });
  } catch {
    return Response.json({ error: "Failed to transcribe audio" }, { status: 500 });
  }
}

import OpenAI from "openai";

const client = new OpenAI();

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json({ error: "No prompt provided" }, { status: 400 });
    }

    const response = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageData = response.data?.[0];
    const imageUrl =
      imageData?.url ??
      (imageData?.b64_json ? `data:image/png;base64,${imageData.b64_json}` : null);

    if (!imageUrl) {
      return Response.json({ error: "No image generated" }, { status: 500 });
    }

    return Response.json({ url: imageUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ error: message }, { status: 500 });
  }
}

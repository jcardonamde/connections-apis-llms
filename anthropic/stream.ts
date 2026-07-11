import Anthropic from "@anthropic-ai/sdk";

async function main() {
  const client = new Anthropic();

  const stream = await client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: "Write on 100 words one history about a dog",
      },
    ],
    stream: true,
  });

  // Main response
  // console.log(message);

  // Response Context
  for await (const event of stream) {
    if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
      process.stdout.write(event.delta.text);
    }
  }
}

main().catch(console.error);

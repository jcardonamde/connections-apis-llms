import Anthropic from "@anthropic-ai/sdk";

async function main() {
  const client = new Anthropic();

  const msg = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: "What is the capital of Colombia?",
      },
      {
        role: "user",
        content: "And what are the colors of the flag?",
      },
    ],
  });

  // Main response
  // console.log(message);

  // Response Context
  const block = msg.content[0];
  if (block.type === "text") {
    console.log(block.text);
  }
}

main().catch(console.error);

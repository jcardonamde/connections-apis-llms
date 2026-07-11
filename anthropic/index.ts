import Anthropic from "@anthropic-ai/sdk";

async function main() {
  const client = new Anthropic();

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: "What is capital of Colombia? and his three principal cities?",
      },
    ],
  });

  // Main response
  // console.log(message);

  // Response Context
  for (const block of message.content) {
    if (block.type === "text") {
      console.log(block.text);
    }
  }
}

main().catch(console.error);

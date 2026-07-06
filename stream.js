import OpenAI from "openai";
const client = new OpenAI();

const stream = await client.responses.create({
  model: "gpt-5-nano",
  input: "Write a short story less of 40 words in Spanish about a child that found a dragon in the forest.",
  stream: true,
});

for await (const event of stream) {    
    if (event.type === "response.output_text.delta") {
        process.stdout.write(event.delta);
    }
}

console.log();

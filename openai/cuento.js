import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5-nano",
  input: "Write a short bedtime story about a unicorn less of 30 words.",
});

console.log(response.output_text);

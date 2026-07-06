import OpenAI from "openai";
const client = new OpenAI();

let messages = [
    { role: "system", content: "You are a helpful and kindly assistant." },
    { role: "user", content: "What is the capital of Colombia?" }
];

const response = await client.chat.completions.create({
  model: "gpt-5-nano",
  messages,
});

console.log(response.choices[0].message.content);

messages = messages.concat([response.choices[0].message]);
messages.push({ role: "user", content: "and what is his population?" });

const response2 = await client.chat.completions.create({
  model: "gpt-5-nano",
  messages,
});

console.log(response2.choices[0].message.content);

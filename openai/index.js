import OpenAI from "openai";

const client = new OpenAI({
  logLevel: "debug",
});

console.log(client);

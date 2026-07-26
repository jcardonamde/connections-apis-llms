import { generateText } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

const { text } = await generateText({
//   model: openai("gpt-5.5"),
//   model: anthropic("claude-sonnet-5"),
  model: google("gemini-3.1-pro-preview"),
  prompt: "What is the capital of Colombia?",
});

console.log(text);

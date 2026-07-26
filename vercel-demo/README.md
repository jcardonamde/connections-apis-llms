# vercel-demo

Script de Node.js + TypeScript que usa el [Vercel AI SDK](https://sdk.vercel.ai) para llamar a distintos proveedores de IA (OpenAI, Anthropic, Google) con una misma interfaz, cambiando de proveedor con solo comentar/descomentar una línea.

## Requisitos

- Node.js 20.6 o superior **o** Bun 1.0 o superior
- Una API key del proveedor que quieras usar:
  - OpenAI: https://platform.openai.com/api-keys
  - Anthropic: https://console.anthropic.com/settings/keys
  - Google AI: https://aistudio.google.com/apikey

## Configuración

Crea un archivo `.env.local` en esta carpeta con las API keys que necesites:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...
```

> ⚠️ El archivo `.env.local` nunca debe subirse al repositorio — ya está incluido en `.gitignore`.

## Instalación

```bash
npm install
```

## Ejecución

### Con Bun (recomendado)

Bun ejecuta TypeScript directamente y carga `.env.local` de forma automática:

```bash
bun index.ts
```

### Con Node

```bash
node --env-file=.env.local --experimental-strip-types index.ts
```

## Cómo cambiar de proveedor

`index.ts` usa `generateText` del paquete `ai` junto con el adaptador del proveedor activo. Para cambiar de modelo, comenta la línea `model` activa y descomenta la del proveedor que quieras usar (junto con su import):

```ts
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

const { text } = await generateText({
  model: openai("gpt-5.5"),
  // model: anthropic("claude-sonnet-5"),
  // model: google("gemini-3.1-pro-preview"),
  prompt: "What is the capital of Colombia?",
});

console.log(text);
```

## Estructura

```
vercel-demo/
├── index.ts          # Llamada básica con generateText, proveedor seleccionable
├── package.json
├── .env.local         # API keys (no se versiona)
└── node_modules/
```

## Dependencias

- `ai` — Vercel AI SDK, capa común para llamar a distintos proveedores de modelos
- `@ai-sdk/openai` — Adaptador de OpenAI para el AI SDK
- `@ai-sdk/anthropic` — Adaptador de Anthropic para el AI SDK
- `@ai-sdk/google` — Adaptador de Google (Gemini) para el AI SDK

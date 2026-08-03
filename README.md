# conexion-terminal

Repositorio de experimentos de conexión con APIs de inteligencia artificial. Cada subcarpeta es un proyecto independiente con su propio entorno y dependencias.

## Proyectos

### `openai/`
Scripts de Node.js puro para explorar la API de OpenAI desde la terminal. Incluye ejemplos de chat simple, chat interactivo, generación de contenido y streaming de respuestas.

→ Ver [openai/README.md](openai/README.md)

### `anthropic/`
Scripts de Node.js + TypeScript para explorar la API de Anthropic (Claude) desde la terminal. Incluye ejemplos de mensajes simples, conversaciones multi-turno y streaming de respuestas.

→ Ver [anthropic/README.md](anthropic/README.md)

### `othergpt/`
Interfaz web (Next.js 16) que integra chat con OpenAI, Anthropic y Google Gemini, seleccionable desde el header. Cuando el proveedor activo es OpenAI, además habilita generación de imágenes, texto a audio y dictado por voz.

→ Ver [othergpt/othergpt/README.md](othergpt/othergpt/README.md)

### `vercel-demo/`
Script de Node.js + TypeScript que usa el Vercel AI SDK (`ai` + `@ai-sdk/*`) para llamar a OpenAI, Anthropic o Google con una misma interfaz, cambiando de proveedor con solo comentar/descomentar una línea.

→ Ver [vercel-demo/README.md](vercel-demo/README.md)

### `elevenlabs/`
Script de Node.js + TypeScript que usa el SDK oficial de ElevenLabs para convertir texto a voz y reproducir el audio en la terminal (requiere ffmpeg/ffplay instalado en el sistema).

→ Ver [elevenlabs/README.md](elevenlabs/README.md)

## Estructura

```
conexion-terminal/
├── openai/          # Scripts Node.js: chat, streaming, terminal interactiva
├── anthropic/       # Scripts TypeScript: mensajes, multi-turno, streaming con Claude
├── othergpt/
│   └── othergpt/    # App Next.js: chat, imagen, audio, selector de modelos
├── vercel-demo/     # Script TypeScript: Vercel AI SDK, proveedor seleccionable (OpenAI/Anthropic/Google)
└── elevenlabs/      # Script TypeScript: texto a voz con ElevenLabs, reproducción vía ffplay
```

## API keys requeridas

Cada proyecto usa sus propias variables de entorno en un archivo `.env` o `.env.local` local. Consulta el README de cada subcarpeta para los detalles.

| Proyecto | Variable | Proveedor |
|---|---|---|
| `openai/` | `OPENAI_API_KEY` | OpenAI |
| `anthropic/` | `ANTHROPIC_API_KEY` | Anthropic |
| `othergpt/` | `OPENAI_API_KEY` + `ANTHROPIC_API_KEY` + `GEMINI_API_KEY` | OpenAI + Anthropic + Google |
| `vercel-demo/` | `OPENAI_API_KEY` + `ANTHROPIC_API_KEY` + `GOOGLE_GENERATIVE_AI_API_KEY` | OpenAI + Anthropic + Google |
| `elevenlabs/` | `ELEVENLABS_API_KEY` | ElevenLabs |

# otro-GPT

Interfaz web minimalista construida con Next.js 16 (App Router + Turbopack) que integra tres proveedores de IA — OpenAI, Anthropic y Google Gemini — para chat con contexto. Además, cuando el proveedor activo es OpenAI, habilita generación de imágenes, texto a audio y dictado por voz.

## Requisitos

- Node.js 20.6 o superior
- API keys de los proveedores que quieras usar (ver [Configuración](#configuración))

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con las API keys de los proveedores que vayas a usar:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
```

> ⚠️ El archivo `.env.local` está en `.gitignore` y nunca debe subirse al repositorio.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Proveedores y modelos

El selector del header solo elige **proveedor**; el modelo concreto está fijo en el backend (`api/chat/route.ts`):

| Proveedor | Modelo usado |
|---|---|
| OpenAI | `gpt-5` |
| Anthropic | `claude-sonnet-4-6` |
| Google Gemini | `gemini-3-flash-preview` |

Las tres llamadas de chat comparten el mismo system prompt (definido en `api/chat/route.ts`), que instruye al modelo a no generar imágenes en ASCII/SVG y redirigir al usuario al botón de generación de imágenes.

## Modos disponibles

| Modo | Proveedores | Descripción |
|---|---|---|
| Texto | OpenAI, Anthropic, Google | Chat con el historial completo de la conversación |
| Imagen | OpenAI únicamente | Generación de imágenes con `gpt-image-1` |
| Texto a Audio | OpenAI únicamente | Conversión de texto a voz con `tts-1` (voz `alloy`) |

> Los tabs de modo y el botón de dictado por voz solo se muestran cuando el proveedor activo es OpenAI. Al cambiar a Anthropic o Google, la UI vuelve automáticamente al modo Texto.

## Funcionalidades

- **Selector de proveedor** — cambia entre OpenAI / Anthropic / Google desde el header sin recargar la página
- **Markdown en las respuestas** — el texto del asistente se renderiza con `react-markdown`
- **Escuchar respuesta** — botón de texto a voz sobre cada respuesta (solo proveedor OpenAI), usa el mismo endpoint `/api/tts`
- **Dictado por voz** — graba audio con `MediaRecorder` y lo transcribe con Whisper (solo proveedor OpenAI, modo Texto)
- **Descargar** — botones de descarga para imágenes generadas (`.png`) y audio generado (`.mp3`)
- **Limpiar conversación** — botón en el header para reiniciar el chat

> El historial de conversación vive solo en el estado de React: **no** persiste en `localStorage`, se pierde al recargar la página.

## Cómo funciona

El frontend mantiene el historial de mensajes en estado local y lo envía completo con cada request de chat. `api/chat/route.ts` selecciona el SDK según el campo `provider` recibido en el body (no según el nombre del modelo):

```
provider === "anthropic" → @anthropic-ai/sdk vía @ai-sdk/anthropic
provider === "google"    → @ai-sdk/google
otro / "openai"          → @ai-sdk/openai
```

## Archivos clave

| Archivo | Descripción |
|---|---|
| `src/app/page.tsx` | Interfaz principal: modos, selector de proveedor, mensajes, mic, descargas |
| `src/app/api/chat/route.ts` | Chat multi-proveedor (OpenAI / Anthropic / Google) con `generateText` del Vercel AI SDK |
| `src/app/api/image/route.ts` | Generación de imágenes con `gpt-image-1` (OpenAI) |
| `src/app/api/tts/route.ts` | Texto a audio con `tts-1` (OpenAI) |
| `src/app/api/transcribe/route.ts` | Transcripción de audio con `whisper-1` (OpenAI) |

## Estructura

```
src/
└── app/
    ├── api/
    │   ├── chat/route.ts          # Chat multi-proveedor
    │   ├── image/route.ts         # Generación de imágenes
    │   ├── tts/route.ts           # Texto a audio
    │   └── transcribe/route.ts    # Transcripción de voz
    ├── globals.css
    ├── layout.tsx
    └── page.tsx                   # Interfaz principal
```

> Existen también `api/chat/route_old.ts` y `page_old.tsx`: versiones previas sin uso, no forman parte de las rutas activas de Next.js.

## Dependencias principales

- `next` 16 (Turbopack) — framework
- `ai` + `@ai-sdk/openai` / `@ai-sdk/anthropic` / `@ai-sdk/google` — capa común de generación de texto multi-proveedor
- `openai` — SDK oficial de OpenAI (imagen, TTS, transcripción)
- `@anthropic-ai/sdk`, `@google/genai` — SDKs oficiales usados como dependencia directa del proyecto
- `lucide-react` — iconos de la interfaz
- `react-markdown` — renderizado de markdown en las respuestas del asistente
- `tailwindcss` 4 — estilos

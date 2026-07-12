# OtherGPT

Interfaz web minimalista construida con Next.js 16 que integra tres proveedores de IA: OpenAI, Anthropic y Google Gemini. Soporta chat con contexto, generación de imágenes, texto a audio y transcripción de voz desde el micrófono.

## Requisitos

- Node.js 18 o superior
- API keys de los proveedores que quieras usar

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con las API keys de los proveedores:

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
```

Solo necesitas las keys de los proveedores que vayas a usar. El resto puede omitirse.

> ⚠️ El archivo `.env.local` está en `.gitignore` y nunca debe subirse al repositorio.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Modelos disponibles

### OpenAI
| Modelo | ID |
|---|---|
| GPT-5 Nano | `gpt-5-nano` |
| GPT-4o Mini | `gpt-4o-mini` |

### Google Gemini
| Modelo | ID |
|---|---|
| Gemini Flash | `gemini-flash-latest` |
| Gemini Flash Lite | `gemini-flash-lite-latest` |

> Los alias `*-latest` apuntan automáticamente al modelo activo más reciente disponible en tu cuenta. Para ver los modelos disponibles en tu cuenta ejecuta:
> ```powershell
> $r = Invoke-RestMethod "https://generativelanguage.googleapis.com/v1beta/models?key=TU_GEMINI_API_KEY"
> $r.models | Where-Object { $_.supportedGenerationMethods -contains "generateContent" } | Select-Object name
> ```

### Anthropic
| Modelo | ID |
|---|---|
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` |
| Claude Sonnet 5 | `claude-sonnet-5` |
| Claude Opus 4 | `claude-opus-4-8` |

## Modos disponibles

| Modo | Proveedores | Descripción |
|---|---|---|
| Texto | OpenAI, Anthropic, Google | Chat con contexto completo de la conversación |
| Imagen | OpenAI únicamente | Generación de imágenes con `gpt-image-1` |
| Texto a Audio | OpenAI únicamente | Conversión de texto a voz con `tts-1` |

> Los modos Imagen y Audio se deshabilitan automáticamente al seleccionar un modelo de Anthropic o Google.

## Funcionalidades

- **Selector de modelos** — cambia de proveedor y modelo desde el header sin reiniciar
- **System prompt** — personaliza el comportamiento del modelo antes de iniciar la conversación (botón `▸ Prompt` en el header)
- **Micrófono** — graba audio y transcribe con Whisper de OpenAI; el texto aparece en el input listo para enviar
- **Contexto persistente** — el historial de conversación de texto se guarda en `localStorage` y sobrevive recargas del navegador
- **Limpiar conversación** — botón disponible cuando hay mensajes activos

## Cómo funciona

El frontend mantiene el historial completo en estado local y lo envía con cada request. El API route detecta el proveedor por el nombre del modelo y usa el SDK correspondiente:

```
model.startsWith("claude-")  → Anthropic SDK
model.startsWith("gemini-")  → Google GenAI SDK
otro                         → OpenAI SDK
```

## Archivos clave

| Archivo | Descripción |
|---|---|
| `src/app/page.tsx` | Interfaz principal: modos, selector de modelos, system prompt, micrófono |
| `src/app/api/chat/route.ts` | Enrutador multi-proveedor (OpenAI / Anthropic / Gemini) |
| `src/app/api/image/route.ts` | Generación de imágenes con `gpt-image-1` |
| `src/app/api/tts/route.ts` | Texto a audio con `tts-1` |
| `src/app/api/transcribe/route.ts` | Transcripción de audio con Whisper |

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

## Dependencias principales

- `next` 16 — framework
- `openai` — SDK oficial de OpenAI
- `@anthropic-ai/sdk` — SDK oficial de Anthropic
- `@google/genai` — SDK unificado de Google para Gemini
- `tailwindcss` 4 — estilos

# elevenlabs

Script de Node.js + TypeScript que usa el SDK oficial de [ElevenLabs](https://elevenlabs.io) (`@elevenlabs/elevenlabs-js`) para convertir texto a voz y reproducir el audio generado directamente en la terminal.

## Requisitos

- Node.js 20.6 o superior **o** Bun 1.0 o superior
- Una API key de ElevenLabs: https://elevenlabs.io/app/settings/api-keys
- **ffmpeg** instalado y disponible en el `PATH` (el helper `play()` del SDK usa `ffplay` internamente para reproducir el audio)
  - Windows: `scoop install ffmpeg` o `winget install Gyan.FFmpeg`
  - macOS: `brew install ffmpeg`
  - Linux / otros: https://ffmpeg.org/download.html

## Configuración

Crea un archivo `.env.local` en esta carpeta con tu API key:

```
ELEVENLABS_API_KEY=sk_...
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

## Qué hace `index.ts`

1. Envía un texto a la voz `"George"` (`JBFqnCBsd6RMkjVDRZzb`) usando el modelo `eleven_v3` vía `elevenlabs.textToSpeech.convert(...)`.
2. Convierte el `ReadableStream` (Web Streams API) de la respuesta en un `Readable` de Node, leyendo chunk a chunk con `getReader()`.
3. Reproduce el audio resultante con `play()`, que internamente hace `spawn` de `ffplay` (por eso ffmpeg es un requisito del sistema, no una dependencia de npm).

Para cambiar de voz, edita el ID en la llamada a `convert(...)` (puedes explorar voces en https://elevenlabs.io/app/voice-library). Para cambiar el texto, edita el campo `text` del segundo argumento.

## Notas importantes

- **Consumo de créditos:** cada llamada a `convert` consume créditos de tu cuenta de ElevenLabs según la longitud del texto y el modelo usado. `eleven_v3` es uno de los modelos más costosos en créditos; si tu plan/API key tiene una cuota baja (por ejemplo, keys de prueba con 3 créditos), la API puede responder `401 quota_exceeded`. Para probar con poco consumo, usa un texto corto o un modelo más económico como `eleven_turbo_v2_5` o `eleven_flash_v2_5`.
- **`type: module`:** `package.json` tiene `"type": "module"` porque `tsconfig.json` usa `"module": "nodenext"` — es lo que permite el `import`/`await` de nivel superior en `index.ts`. Sin ese campo, TypeScript trata el archivo como CommonJS y esos errores fallan en compilación.
- **`types: ["node"]`:** necesario en `tsconfig.json` para que TypeScript reconozca módulos built-in de Node (como `stream`) vía `@types/node`.

## Estructura

```
elevenlabs/
├── index.ts          # Texto a voz + reproducción con ffplay
├── package.json
├── tsconfig.json
├── .env.local         # API key (no se versiona)
└── node_modules/
```

## Dependencias

- `@elevenlabs/elevenlabs-js` — SDK oficial de ElevenLabs (texto a voz, streaming, helper `play`)
- `typescript` + `ts-node` + `@types/node` — soporte de TypeScript para ejecución en Node.js

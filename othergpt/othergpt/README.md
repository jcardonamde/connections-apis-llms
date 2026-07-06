# OtherGPT

Interfaz web minimalista para probar la API de OpenAI. Construida con Next.js 16, permite enviar mensajes y recibir respuestas del modelo manteniendo el contexto de la conversación.

## Requisitos

- Node.js 18 o superior
- Una API key de OpenAI: https://platform.openai.com/api-keys

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env.local` en la raíz del proyecto con tu API key:

```
OPENAI_API_KEY=sk-...
```

> ⚠️ El archivo `.env.local` está en `.gitignore` y nunca debe subirse al repositorio.

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

## Cómo funciona

El flujo es directo: el frontend mantiene el historial completo de la conversación en estado local y lo envía con cada request. El API route lo reenvía a OpenAI con todos los mensajes anteriores, lo que le da al modelo contexto de toda la sesión.

```
Usuario escribe → page.tsx → POST /api/chat → OpenAI Completions → respuesta → UI
```

## Archivos clave

| Archivo | Descripción |
|---|---|
| `src/app/page.tsx` | Interfaz de chat (componente cliente con estado) |
| `src/app/api/chat/route.ts` | Route Handler que conecta con OpenAI |
| `src/app/layout.tsx` | Layout global y metadatos |

## Estructura

```
src/
└── app/
    ├── api/
    │   └── chat/
    │       └── route.ts      # Endpoint POST que llama a OpenAI
    ├── globals.css
    ├── layout.tsx
    └── page.tsx              # Interfaz de chat
```

## Dependencias principales

- `next` 16 — framework
- `openai` — SDK oficial de OpenAI
- `tailwindcss` 4 — estilos

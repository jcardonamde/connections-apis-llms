# anthropic

Scripts de Node.js + TypeScript para explorar la API de Anthropic (Claude) desde la terminal.

## Requisitos

- Node.js 20.6 o superior **o** Bun 1.0 o superior
- Una API key de Anthropic: https://console.anthropic.com/settings/keys

## Configuración

Crea un archivo `.env` en esta carpeta con tu API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

> ⚠️ El archivo `.env` nunca debe subirse al repositorio — agrégalo a `.gitignore`.

## Ejecución

### Con Bun (recomendado)

Bun ejecuta TypeScript directamente y carga `.env` de forma automática:

```bash
bun index.ts
```

### Con ts-node

```bash
node --env-file=.env -e "require('ts-node').register()" index.ts
```

O añade el script al `package.json` y ejecuta:

```bash
node --env-file=.env --loader ts-node/esm index.ts
```

### Con tsx (alternativa ligera a ts-node)

```bash
npx tsx --env-file=.env index.ts
```

## Estructura

```
anthropic/
├── index.ts          # Cliente base: pregunta por la capital de Colombia y sus ciudades principales
├── messages.ts       # Ejemplo de conversación multi-turno (capital + colores de la bandera)
├── stream.ts         # Respuesta con streaming (imprime el texto conforme llega)
├── package.json
├── .env              # API key (no se versiona)
└── node_modules/
```

## Ejemplos incluidos

| Archivo | Descripción |
|---|---|
| `index.ts` | Llamada básica a la API: una pregunta, una respuesta impresa en consola |
| `messages.ts` | Conversación con múltiples mensajes de usuario en una sola llamada |
| `stream.ts` | Streaming de respuesta usando `messages.stream` — imprime el texto token a token |

## Ejecución de cada archivo

### Con Bun

```bash
bun index.ts
bun messages.ts
bun stream.ts
```

### Con tsx

```bash
npx tsx --env-file=.env index.ts
npx tsx --env-file=.env messages.ts
npx tsx --env-file=.env stream.ts
```

## Dependencias

- `@anthropic-ai/sdk` — SDK oficial de Anthropic
- `typescript` + `ts-node` — ejecución de TypeScript en Node.js

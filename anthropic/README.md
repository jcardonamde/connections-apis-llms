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
├── index.ts          # Script de prueba base con la API de Anthropic
├── package.json
├── tsconfig.json
├── .env              # API key (no se versiona)
└── node_modules/
```

## Qué hace index.ts

Crea un cliente de Anthropic, envía un mensaje al modelo `claude-opus-4-8` y imprime la respuesta en consola. Sirve como punto de partida para explorar la API de mensajes.

## Dependencias

- `@anthropic-ai/sdk` — SDK oficial de Anthropic
- `typescript` + `ts-node` — ejecución de TypeScript en Node.js

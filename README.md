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
Interfaz web construida con Next.js que integra múltiples proveedores de IA. Soporta chat con contexto, generación de imágenes, texto a audio y transcripción de voz. Permite cambiar entre modelos de OpenAI y Anthropic desde la UI.

→ Ver [othergpt/othergpt/README.md](othergpt/othergpt/README.md)

## Estructura

```
conexion-terminal/
├── openai/          # Scripts Node.js: chat, streaming, terminal interactiva
├── anthropic/       # Scripts TypeScript: mensajes, multi-turno, streaming con Claude
└── othergpt/
    └── othergpt/    # App Next.js: chat, imagen, audio, selector de modelos
```

## API keys requeridas

Cada proyecto usa sus propias variables de entorno en un archivo `.env` o `.env.local` local. Consulta el README de cada subcarpeta para los detalles.

| Proyecto | Variable | Proveedor |
|---|---|---|
| `openai/` | `OPENAI_API_KEY` | OpenAI |
| `anthropic/` | `ANTHROPIC_API_KEY` | Anthropic |
| `othergpt/` | `OPENAI_API_KEY` + `ANTHROPIC_API_KEY` | OpenAI + Anthropic |

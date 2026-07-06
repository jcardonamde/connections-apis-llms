# conexion-terminal

Repositorio de experimentos de conexión con la API de OpenAI. Cada subcarpeta es un proyecto independiente con su propio entorno y dependencias.

## Proyectos

### `openai/`
Scripts de Node.js puro para explorar la API de OpenAI desde la terminal. Incluye ejemplos de chat simple, chat interactivo, generación de contenido y streaming de respuestas.

→ Ver [openai/README.md](openai/README.md)

### `othergpt/`
Interfaz web minimalista construida con Next.js para probar la API de OpenAI con UI. Soporta conversaciones con contexto completo usando el endpoint de Chat Completions.

→ Ver [othergpt/othergpt/README.md](othergpt/othergpt/README.md)

## Estructura

```
conexion-terminal/
├── openai/          # Scripts Node.js: chat, streaming, terminal interactiva
└── othergpt/
    └── othergpt/    # App Next.js con interfaz de chat web
```

## Requisitos comunes

Todos los proyectos necesitan una API key de OpenAI configurada como variable de entorno:

```
OPENAI_API_KEY=sk-...
```

Cada subcarpeta tiene su propio `.env` o `.env.local` — consulta el README de cada proyecto para los detalles de configuración.

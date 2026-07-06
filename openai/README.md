# conexion-terminal

Proyecto de prueba para conectar con la API de OpenAI desde Node.js. Incluye ejemplos de chat interactivo, streaming de respuestas y generación de contenido.

## Requisitos

- Node.js 20.6 o superior (necesario para el flag `--env-file`)
- Una API key de OpenAI: https://platform.openai.com/api-keys

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con tu API key:

```
OPENAI_API_KEY=sk-...
```

> ⚠️ El archivo `.env` está en `.gitignore` y nunca debe subirse al repositorio.

## Comandos disponibles

| Comando | Script | Descripción |
|---|---|---|
| `npm start` | `index.js` | Inicializa el cliente de OpenAI con logs en modo debug |
| `npm run cuento` | `cuento.js` | Genera un cuento corto usando la API |
| `npm run stream` | `stream.js` | Genera un cuento con streaming de respuesta |

Todos los comandos cargan automáticamente las variables de entorno desde `.env`.

## Ejecución manual

Si prefieres no usar los scripts de npm:

```bash
node --env-file=.env index.js
node --env-file=.env cuento.js
node --env-file=.env stream.js
node --env-file=.env chat.js
node --env-file=.env chat-terminal.js
```

> Ejecutar los scripts directamente **fallará** porque Node no carga `.env` por defecto sin el flag `--env-file`.

## Ejemplos incluidos

- **chat.js** - Ejemplo simple de conversación de dos turnos (pregunta sobre la capital de Colombia y luego su población)
- **chat-terminal.js** - Chat interactivo en terminal. Escribe mensajes y presiona Enter. Escribe `salir` para terminar
- **cuento.js** - Genera un cuento corto
- **stream.js** - Genera un cuento con streaming de respuesta (imprime el texto conforme llega)
- **index.js** - Cliente OpenAI base con configuración debug

## Estructura

```
.
├── index.js              # Cliente OpenAI base
├── chat.js               # Ejemplo: conversación simple
├── chat-terminal.js      # Ejemplo: chat interactivo en terminal
├── cuento.js             # Ejemplo: generación de cuento
├── stream.js             # Ejemplo: streaming de respuestas
├── .env                  # Variables de entorno (no se versiona)
├── .env.local            # Variables locales (no se versiona)
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Dependencias

- `openai` - SDK oficial de OpenAI
- `dotenv` - Gestión de variables de entorno

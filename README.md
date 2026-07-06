# conexion-terminal

Proyecto de prueba para conectar con la API de OpenAI desde Node.js.

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

## Comandos

| Comando | Descripción |
|---|---|
| `npm start` | Ejecuta `index.js` (inicializa el cliente de OpenAI con logs en modo debug) |
| `npm run cuento` | Ejecuta `cuento.js` (genera un cuento corto con `gpt-5-nano`) |

Ambos comandos cargan automáticamente las variables de entorno desde `.env`.

## Ejecución manual

Si prefieres no usar los scripts de npm:

```bash
node --env-file=.env index.js
node --env-file=.env cuento.js
```

> Ejecutar `node cuento.js` directamente **fallará** porque Node no carga `.env` por defecto.

## Estructura

```
.
├── index.js        # Cliente OpenAI base
├── cuento.js       # Ejemplo: genera un cuento con la API
├── .env            # Variables de entorno (no se versiona)
├── .gitignore
└── package.json
```

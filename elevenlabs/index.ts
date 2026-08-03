import { ElevenLabsClient, play } from "@elevenlabs/elevenlabs-js";
import { Readable } from "stream";

const elevenlabs = new ElevenLabsClient();
const audio = await elevenlabs.textToSpeech.convert(
	"JBFqnCBsd6RMkjVDRZzb", // "George" - browse voices at elevenlabs.io/app/voice-library
	{
		// text: "The first move is what sets everything in motion. Remember that you are the best",
		text: "Olá, bem-vindo sou skatista profissional e agora tem gosto de assistir ao por do sol na praia com uma cerveja gelada",
		// text: "Hola, bienvenido al experimento de configuración de APIs de Audio con LLMs",
		modelId: "eleven_v3",
		outputFormat: "mp3_44100_128",
	},
);

const reader = audio.getReader();
const stream = new Readable({
	async read() {
		const { done, value } = await reader.read();
		if (done) {
			this.push(null);
		} else {
			this.push(value);
		}
	}
});

await play(stream);

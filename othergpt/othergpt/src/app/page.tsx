"use client";

import { useState, useRef, useEffect } from "react";

type Mode = "text" | "image" | "audio";

type Message = {
  role: "user" | "assistant";
  content: string;
  type: Mode;
  mediaUrl?: string;
};

const STORAGE_KEY = "othergpt_messages";

const MODES: { id: Mode; label: string; icon: React.ReactNode }[] = [
  {
    id: "text",
    label: "Texto",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "image",
    label: "Imagen",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    id: "audio",
    label: "Texto a Audio",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
  },
];

const PLACEHOLDERS: Record<Mode, string> = {
  text: "Escribe un mensaje...",
  image: "Describe la imagen que quieres generar...",
  audio: "Escribe el texto que quieres convertir a audio...",
};

const LOADING_LABELS: Record<Mode, string> = {
  text: "...",
  image: "Generando imagen...",
  audio: "Generando audio...",
};

const MODELS = [
  { id: "gpt-5-nano",               label: "GPT-5 Nano",        provider: "OpenAI" },
  { id: "gpt-4o-mini",              label: "GPT-4o Mini",       provider: "OpenAI" },
  { id: "claude-haiku-4-5-20251001",label: "Claude Haiku 4.5",  provider: "Anthropic" },
  { id: "claude-sonnet-5",          label: "Claude Sonnet 5",   provider: "Anthropic" },
  { id: "claude-opus-4-8",          label: "Claude Opus 4",     provider: "Anthropic" },
];

export default function Home() {
  const [mode, setMode] = useState<Mode>("text");
  const [model, setModel] = useState("gpt-5-nano");
  const isAnthropic = model.startsWith("claude-");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<Mode>("text");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Cargar desde localStorage después de hidratación para evitar mismatch servidor/cliente
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);

  // Solo persistir mensajes de texto — las URLs de imágenes y audio expiran
  useEffect(() => {
    if (messages.length === 0) return;
    const persistable = messages.filter((m) => m.type === "text");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const prompt = input.trim();
    setInput("");
    setLoading(true);
    setLoadingMode(mode);

    const userMessage: Message = { role: "user", content: prompt, type: mode };
    setMessages((prev) => [...prev, userMessage]);

    if (mode === "text") {
      const history = [...messages, userMessage]
        .filter((m) => m.type === "text")
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, model }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}`, type: "text" }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.content, type: "text" }]);
      }
    } else if (mode === "image") {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      setLoading(false);
      try {
        const data = await response.json();
        if (data.error) {
          setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}`, type: "text" }]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: prompt, type: "image", mediaUrl: data.url },
          ]);
        }
      } catch {
        setMessages((prev) => [...prev, { role: "assistant", content: "Error: no se pudo conectar con el endpoint de imagen.", type: "text" }]);
      }
    } else if (mode === "audio") {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt }),
      });
      setLoading(false);
      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: prompt, type: "audio", mediaUrl: audioUrl },
        ]);
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setIsTranscribing(true);

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const form = new FormData();
        form.append("audio", blob, "recording.webm");

        const response = await fetch("/api/transcribe", { method: "POST", body: form });
        const data = await response.json();
        setIsTranscribing(false);

        if (data.text) setInput((prev) => prev + data.text);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      // El usuario denegó el permiso del micrófono
    }
  }

  function clearConversation() {
    setMessages([]);
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Scrollable message area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 pt-6 pb-4 flex flex-col min-h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <span className="text-sm font-medium text-zinc-400">OtherGPT</span>
            <div className="flex items-center gap-3">
              {mode === "text" && (
                <select
                  value={model}
                  onChange={(e) => {
                    const next = e.target.value;
                    setModel(next);
                    if (next.startsWith("claude-")) setMode("text");
                  }}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-zinc-600 transition-colors"
                >
                  <optgroup label="OpenAI">
                    {MODELS.filter((m) => m.provider === "OpenAI").map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Anthropic">
                    {MODELS.filter((m) => m.provider === "Anthropic").map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </optgroup>
                </select>
              )}
              {messages.length > 0 && (
                <button
                  onClick={clearConversation}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-24 gap-4 text-center">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <rect x="3" y="8" width="18" height="11" rx="2" />
                    <path d="M8 8V6a4 4 0 0 1 8 0v2" />
                    <circle cx="9" cy="13" r="1.5" fill="white" stroke="none" />
                    <circle cx="15" cy="13" r="1.5" fill="white" stroke="none" />
                    <path d="M9 17h6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-lg">Hola, soy otro-GPT</p>
                  <p className="text-sm text-zinc-500 mt-1">
                    Escribe un mensaje para comenzar la conversación.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.type === "image" && msg.role === "assistant" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={msg.mediaUrl}
                        alt={msg.content}
                        className="max-w-sm w-full rounded-2xl"
                      />
                    ) : msg.type === "audio" && msg.role === "assistant" ? (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 max-w-sm w-full">
                        <p className="text-xs text-zinc-500 mb-2 truncate">{msg.content}</p>
                        <audio
                          src={msg.mediaUrl}
                          controls
                          autoPlay
                          className="w-full"
                          style={{ height: "32px" }}
                        />
                      </div>
                    ) : (
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-zinc-700 text-white"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-100"
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2 text-sm text-zinc-500">
                      {LOADING_LABELS[loadingMode]}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed bottom controls */}
      <div className="flex-shrink-0 border-t border-zinc-900 bg-black">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
          {/* Mode selector */}
          <div className="flex justify-center gap-2">
            {MODES.map(({ id, label, icon }) => {
              const disabled = isAnthropic && id !== "text";
              return (
                <button
                  key={id}
                  onClick={() => !disabled && setMode(id)}
                  disabled={disabled}
                  title={disabled ? "No disponible para modelos de Anthropic" : undefined}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    disabled
                      ? "text-zinc-700 border border-zinc-900 cursor-not-allowed"
                      : mode === id
                      ? "bg-white text-black"
                      : "text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {icon}
                  {label}
                </button>
              );
            })}
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-2.5">
            <button
              onClick={toggleRecording}
              disabled={loading || isTranscribing}
              title={isRecording ? "Detener grabación" : "Grabar audio"}
              className={`flex-shrink-0 transition-colors disabled:cursor-not-allowed ${
                isRecording
                  ? "text-red-500 animate-pulse"
                  : isTranscribing
                  ? "text-zinc-500"
                  : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {isTranscribing ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              )}
            </button>
            <textarea
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none resize-none min-h-[22px] max-h-28"
              placeholder={PLACEHOLDERS[mode]}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center disabled:opacity-25 disabled:cursor-not-allowed transition-opacity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                <path d="m22 2-7 20-4-9-9-4z" />
                <path d="M22 2 11 13" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

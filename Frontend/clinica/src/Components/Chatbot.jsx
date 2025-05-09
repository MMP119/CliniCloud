// src/Components/Chatbot.jsx

import { useState, useRef } from "react";
import url_fetch from "../environment"; 

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hola 👋 Ingresa tu código único :)" },
  ]);
  // Generamos un sessionId único para esta sesión
  const sessionRef = useRef(Date.now().toString());

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    // Añadimos el mensaje del usuario
    setMessages(prev => [...prev, { from: "user", text }]);
    setInput("");

    try {
      // Llamada al backend FastAPI
      const res = await fetch(`${url_fetch}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionRef.current,
          text
        })
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const { messages: botMsgs } = await res.json();
      // Añadimos las respuestas del bot
      setMessages(prev => [
        ...prev,
        ...botMsgs.map(m => ({ from: "bot", text: m.content }))
      ]);
    } catch (err) {
      console.error("Error en /api/chat:", err);
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Lo siento, ocurrió un error. Inténtalo de nuevo más tarde." }
      ]);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-20 right-6 bg-blue-600 text-white p-6 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        💬
      </button>

      {/* Ventana de chat */}
      {open && (
        <div className="fixed bottom-32 right-6 w-[380px] h-[500px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden z-40">
          <div className="bg-blue-600 text-white p-4 font-semibold">CliniBot</div>

          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{ overflowWrap: "anywhere" }}
                className={`p-2 rounded-lg max-w-[75%] break-words ${
                  msg.from === "bot"
                    ? "bg-blue-100 text-left"
                    : "bg-gray-200 self-end ml-auto text-right"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none"
              placeholder="Escribe algo..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

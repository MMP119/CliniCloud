import { useState } from "react";

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hola 👋 ¿En qué puedo ayudarte?" },
    ]);

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { from: "user", text: input }]);
        setInput("");

        // TODO: Integrar con AWS Lex!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            { from: "bot", text: "Esto es una respuesta simulada 😄" },
        ]);
        }, 500);
    };

    return (
        <>
        {/* Botón flotante */}
        <button
            onClick={() => setOpen(!open)}
            className="fixed bottom-56 right-6 bg-blue-600 text-white p-6 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
        >
            💬
        </button>

        {/* Ventana de chat */}
        {open && (
            <div className="fixed bottom-75 right-6 w-[380px] h-[500px] bg-white shadow-xl rounded-xl flex flex-col overflow-hidden z-40">
            <div className="bg-blue-600 text-white p-4 font-semibold">
                CliniBot
            </div>

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
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
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

// src/pages/AppointmentForm.jsx

import { useState } from "react";
import Navbar from "../../Components/Navbar";
import Chatbot from "../../Components/Chatbot";
import url_fetch from "../../environment";
import emailjs from "emailjs-com";

export default function AppointmentForm() {
    const [form, setForm] = useState({
        nombre: "",
        correo: "",
        motivo: "",
        fecha: "",
        hora: "",
    });
    const [codigo, setCodigo] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // ** Tu configuración de EmailJS **
    const SERVICE_ID  = "service_qyozdem";
    const TEMPLATE_ID = "template_kszvl6r";
    const USER_ID     = "BNzaTAZ4bV3AHucZY"; 

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    // Función para enviar el email
    const sendEmail = (toEmail, code) => {
        return emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
            to_email: toEmail,
            codigo:    code
        },
        USER_ID
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setCodigo(null);

        // combinar fecha y hora en ISO 8601
        const appointment = `${form.fecha}T${form.hora}:00`;

        try {
        const res = await fetch(`${url_fetch}/api/register_patient`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            name:        form.nombre,
            email:       form.correo,
            description: form.motivo,
            appointment, // e.g. "2025-04-15T11:00:00"
            }),
        });

        const data = await res.json();

        if (res.ok && data.status === 201) {
            // backend devuelve el código único
            const code = data.unique_code;
            setCodigo(code);

            // envío del email
            try {
            await sendEmail(form.correo, code);
            console.log("Email enviado correctamente");
            } catch (err) {
            console.error("Error enviando email:", err);
            setError("Cita agendada, pero no se pudo enviar el email.");
            }
        } else {
            alert(data.message || "No se pudo registrar el paciente, verifique si ya tiene una cita agendada.");
        }
        } catch (err) {
        console.error("Error al registrar paciente:", err);
        setError("Error de conexión al servidor");
        } finally {
        setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <Chatbot />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center">
                Reserva tu cita médica
            </h2>
            <p className="text-gray-600 text-center mb-6">
                Completa el formulario y recibe tu código de confirmación.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={form.correo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <textarea
                name="motivo"
                placeholder="Motivo de la cita"
                value={form.motivo}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                type="time"
                name="hora"
                value={form.hora}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                {loading ? "Agendando..." : "Agendar cita"}
                </button>
            </form>

            {error && (
                <p className="text-red-600 text-center mt-4">{error}</p>
            )}

            {codigo && (
                <div className="mt-6 bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg text-center">
                <p className="font-semibold">¡Cita agendada exitosamente!</p>
                <p>
                    Tu código único es:{" "}
                    <span className="font-mono text-green-900">{codigo}</span>
                </p>
                </div>
            )}
            </div>
        </div>
        </>
    );
}

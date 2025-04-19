import { useState } from "react";
import Navbar from "../../Components/Navbar";

export default function AppointmentForm() {

    const [form, setForm] = useState({ nombre: "", correo: "", motivo: "", fecha: "" });
    const [codigo, setCodigo] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        //genera código único
        const codigoGenerado = Math.random().toString(36).substring(2, 10).toUpperCase();
        setCodigo(codigoGenerado);

        // TODO: Enviar a Lambda vía API Gateway!!!!!!!
        console.log("Datos enviados:", form);
        console.log("Código generado:", codigoGenerado);
    };

    return (

        <>
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center">Reserva tu cita médica</h2>
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

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Agendar cita
                    </button>
                </form>

                {codigo && (
                    <div className="mt-6 bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg text-center">
                        <p className="font-semibold">¡Cita agendada!</p>
                        <p>
                            Tu código único es: <span className="font-mono text-green-900">{codigo}</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

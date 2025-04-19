import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ correo: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {

            // TODO: Integrar con Cognito (Auth.signIn o fetch a Lambda/API Gateway)
            console.log("Datos enviados al backend:", form);


            // SIMULACION DEL FUNCIONAMIENTO

            //simulación de rol según correo
            let rol = form.correo.includes("lab") ? "lab" : "doctor";

            //redirigir según rol (simulado)
            if (rol === "doctor" && form.password === "123") navigate("/dashboard/doctor");
            else navigate("/dashboard/lab");

        } catch (err) {

            console.error("Error al iniciar sesión:", err);
            setError("Credenciales inválidas");

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">

            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=account_circle" />
                
                <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Iniciar sesión</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email"
                    name="correo"
                    placeholder="Correo electrónico"
                    value={form.correo}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                    {loading ? "Cargando..." : "Ingresar"}
                </button>

                {error && (
                    <p className="text-red-600 text-xl text-center mt-2">{error}</p>
                )}
                </form>
            </div>
        </div>
        </>
    );
}

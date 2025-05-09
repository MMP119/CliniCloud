import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import url_fetch from "../environment";

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
        //Llamada al backend
        const res = await fetch(`${url_fetch}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email: form.correo,
            password: form.password,
            }),
        });

        const data = await res.json();

        if (res.ok && data.status === 200) {
            //Guardar en localStorage para uso posterior
            localStorage.setItem("rol", data.Rol_Type);
            localStorage.setItem("loginId", data.Login_Id);

            // redirigir según Rol_Type
            if (data.Rol_Type.toLowerCase() === "doctor") {
            navigate("/dashboard/doctor");
            } else {
            navigate("/dashboard/lab");
            }
        } else {
            // Si status != 200 o res.ok es false
            setError(data.message || "Credenciales inválidas");
        }
        } catch (err) {
        console.error("Error al iniciar sesión:", err);
        setError("Error de conexión con el servidor");
        } finally {
        setLoading(false);
        }
    };

    return (
        <>
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
            <div className="flex justify-center mb-4">
                <span
                className="material-symbols-outlined mb-2 text-blue-600"
                style={{ fontSize: "150px" }}
                >
                account_circle
                </span>
            </div>

            <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
                Iniciar sesión
            </h2>

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
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                {loading ? "Cargando..." : "Ingresar"}
                </button>

                {error && (
                <p className="text-red-600 text-center mt-2">{error}</p>
                )}
            </form>
            </div>
        </div>
        </>
    );
}
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";
import nube  from "../assets/nube.svg";
import Chatbot from "../Components/Chatbot";

export default function Home() {
    return (
        
        // agregar navbar
        <>
        <Navbar />
        <Chatbot />

        <div className="flex flex-col flex-1 w-full">

            {/* HERO CENTRADO */}
            <header className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden">

                <img
                    src={nube}
                    alt="Logo de la clínica"
                    className="absolute top-1/2 left-1/2 w-[1000px] -translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none z-0"
                />

                <h2 className="relative z-10 text-4xl md:text-5xl font-bold text-blue-800 mb-4">Tu salud, en la nube</h2>
                <p className="relative z-10 text-lg md:text-xl text-blue-700 max-w-2xl mb-6">
                Agenda tus citas, accede a resultados y conecta con tu médico desde cualquier lugar.
                </p>
                <div className="space-x-4">
                <Link to="/agendar-cita">
                    <button className="relative z-10 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
                    Agendar Cita
                    </button>
                </Link>
                </div>

            </header>

            {/* FEATURES*/}
            <section className="w-full bg-white shadow-md py-12 px-6 grid md:grid-cols-3 gap-6 text-center">
                <div>
                    <h3 className="text-xl font-semibold text-blue-700">Agenda inteligente</h3>
                    <p className="text-gray-600 mt-2">Tu cita, tu horario, sin filas ni llamadas.</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-blue-700">Resultados rápidos</h3>
                    <p className="text-gray-600 mt-2">Recibe análisis directamente.</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-blue-700">Seguridad y privacidad</h3>
                    <p className="text-gray-600 mt-2">Tu información clínica, protegida en la nube.</p>
                </div>
            </section>

        </div>
        </>
    );
}

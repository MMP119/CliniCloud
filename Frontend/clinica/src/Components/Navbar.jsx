import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();
    const isLoginPage = pathname === "/login"; 
    const isAppointmentForm = pathname === "/agendar-cita";

    return (
        <nav className="bg-white shadow-md p-4 flex justify-between items-center">
            <Link to="/">
                <h1 className="text-3xl font-bold text-blue-700">CliniCloud</h1>
            </Link>
            <div className="space-x-4">
                {isLoginPage || isAppointmentForm ? (
                    <Link to="/">
                        <button className="text-blue-700 text-xl font-medium hover:underline">
                            Inicio
                        </button>
                    </Link>
                ) : (
                    <Link to="/login">
                        <button className="text-blue-700 text-xl font-medium hover:underline">
                            Iniciar sesión
                        </button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
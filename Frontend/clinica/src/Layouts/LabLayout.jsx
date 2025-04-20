import { Link, Outlet, useNavigate } from "react-router-dom";

export default function LabLayout() {
    const navigate = useNavigate();

    const handleLogout = () => {
        
        // TODO: cerrar sesión (Cognito, localStorage, etc)!!!!!!!!!!!!!!!!!!!
        console.log("Sesión cerrada");
        navigate("/");

    };

    return (
        <div className="min-h-screen flex bg-gray-100 text-gray-800 font-sans">

        {/* Sidebar del laboratorio */}
        <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
            <div>

                <h2 className="text-3xl font-bold text-blue-700 mb-6">🧪Laboratorio</h2>

                <nav className="flex flex-col gap-4">


                    <Link to="/dashboard/lab/solicitudes" className="text-left hover:bg-blue-100 p-3 rounded-md text-xl">
                    📥 Revisar solicitudes
                    </Link>

                    <Link to="/dashboard/lab/informes" className="text-left hover:bg-blue-100 p-3 rounded-md text-xl">
                    📤 Enviar informes
                    </Link>
                    
                    <Link to="/dashboard/lab/pruebas" className="text-left hover:bg-blue-100 p-3 rounded-md text-xl">
                    🔬 Pruebas realizadas
                    </Link>


                </nav>
            </div>

            <button
                onClick={handleLogout}
                className="mt-8 p-3 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
                >
                🚪 Cerrar sesión
            </button>
        </aside>

        {/* Contenido del dashboard del laboratorio */}
        <main className="flex-1 p-8">
            <Outlet />
        </main>
        </div>
    );
}

import { Link, Outlet } from "react-router-dom"

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 font-sans">

        {/* CONTENIDO */}
        <main className="flex-1 flex flex-col">
            <Outlet />
        </main>

        {/* FOOTER SIEMPRE ABAJO */}
        <footer className="bg-blue-900 text-white text-sm text-center py-4">
            CliniCloud © 2025 - Grupo 14 - USAC
        </footer>
        </div>
    )
}

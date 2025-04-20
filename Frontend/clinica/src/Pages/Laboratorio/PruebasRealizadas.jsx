import { useState, useEffect } from "react";

export default function PruebasRealizadas() {

    const [informes, setInformes] = useState([]);

    // TODO: obtener informes ya enviados (GET /api/informes-enviados)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Ejemplo de implementación:
    /*
    useEffect(() => {
        fetch("/api/informes-enviados")
        .then(res => res.json())
        .then(data => setInformes(data))
        .catch(err => console.error("Error al cargar informes enviados:", err));
    }, []);
    */

    // datos simulados por ahora
    useEffect(() => {
        setInformes([
        {
            id: 1,
            nombrePaciente: "Juan Pérez",
            motivo: "Dolor de garganta",
            diagnostico: "Infección bacteriana leve",
            estado: "enviado",
        },
        {
            id: 2,
            nombrePaciente: "Ana López",
            motivo: "Fiebre persistente",
            diagnostico: "Faringitis viral aguda",
            estado: "enviado",
        },
        ]);
    }, []);

    return (
        <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Pruebas Realizadas</h2>

        {informes.filter((i) => i.estado === "enviado").length === 0 ? (
            <p className="text-gray-600">No hay informes enviados aún.</p>
        ) : (
            <div className="grid gap-4">
            {informes
                .filter((i) => i.estado === "enviado")
                .map((inf) => (
                <div key={inf.id} className="bg-white shadow-md rounded-lg p-4">
                    <p className="text-blue-800 font-semibold">
                    <strong>Paciente:</strong> {inf.nombrePaciente}
                    </p>
                    <p className="text-gray-700">
                    <strong>Motivo:</strong> {inf.motivo}
                    </p>
                    <p className="text-sm text-gray-600 italic">
                    <strong>Diagnóstico:</strong> {inf.diagnostico}
                    </p>
                </div>
                ))}
            </div>
        )}
        </div>
    );
}

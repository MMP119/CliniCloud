import { useState, useEffect } from "react";
import url_fetch from "../../environment.js";

export default function RevisarSolicitudes() {

    const [solicitudes, setSolicitudes] = useState([]);

    // TODO: Obtener las solicitudes pendientes desde el backend (GET /api/solicitudes-lab)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    useEffect(() => {
        fetch(`${url_fetch}/api/solicitudes-lab`)
            .then(res => {
                if (res.status === 404) {
                    // no hay pendientes: treat as empty
                    return [];
                }
                if (!res.ok) {
                    throw new Error(`Error ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log("Solicitudes:", data);
                setSolicitudes(data);
            })
            .catch(err => {
                console.error("Error al cargar solicitudes:", err);
                // opcional: setSolicitudes([])  
            });
        }, []);
    

    // Datos quemados por ahora:
    // useEffect(() => {
    //     setSolicitudes([
    //     {
    //         id: 1,
    //         nombrePaciente: "Juan Pérez",
    //         motivo: "Dolor de garganta",
    //         estado: "pendiente",
    //         diagnostico: "",
    //     },
    //     {
    //         id: 2,
    //         nombrePaciente: "Ana López",
    //         motivo: "Fiebre persistente y tos",
    //         estado: "pendiente",
    //         diagnostico: "",
    //     },
    //     ]);
    // }, []);

    const [editando, setEditando] = useState(null);
    const [diagnosticoTemp, setDiagnosticoTemp] = useState("");

    const atenderSolicitud = (solicitud) => {
        setEditando(solicitud.id);
        setDiagnosticoTemp(solicitud.diagnostico || "");
    };

    const guardarDiagnostico = (id) => {
        const actualizado = solicitudes.map((sol) =>
            sol.id === id
                ? {
                    ...sol,
                    diagnostico: diagnosticoTemp,
                    estado: "terminado",
                }
                : sol
        );
        setSolicitudes(actualizado);
    
        fetch(`${url_fetch}/api/solicitudes-lab/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                diagnostico: diagnosticoTemp,
                estado: "terminado",
            }),
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error al actualizar diagnóstico");
            return res.json();
        })
        .then((data) => console.log("Diagnóstico actualizado:", data))
        .catch((err) => console.error("Error al guardar diagnóstico:", err));
    
        console.log("Diagnóstico guardado para ID", id, ":", diagnosticoTemp);
        setEditando(null);
        setDiagnosticoTemp("");
    };

    return (
        <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Solicitudes Pendientes</h2>

        {solicitudes.filter((s) => s.estado === "pendiente").length === 0 ? (
            <p className="text-gray-600">No hay solicitudes pendientes por el momento.</p>
        ) : (
            <div className="grid gap-4">
            {solicitudes
                .filter((s) => s.estado === "pendiente")
                .map((sol) => (
                <div
                    key={sol.id}
                    className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-4"
                >
                    <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-blue-800 break-words">
                        <strong>Paciente:</strong> {sol.nombrePaciente}
                        </p>
                        <p className="text-gray-700 break-words">
                        <strong>Motivo:</strong> {sol.motivo}
                        </p>
                    </div>

                    <div>
                        {editando !== sol.id && (
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
                            onClick={() => atenderSolicitud(sol)}
                        >
                            Atender
                        </button>
                        )}
                    </div>
                    </div>

                    {editando === sol.id && (
                    <>
                        <textarea
                        className="w-full border border-gray-300 rounded p-2"
                        placeholder="Escribir diagnóstico..."
                        rows={3}
                        value={diagnosticoTemp}
                        onChange={(e) => setDiagnosticoTemp(e.target.value)}
                        />
                        <div className="flex gap-2">
                        <button
                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                            onClick={() => guardarDiagnostico(sol.id)}
                        >
                            Terminar informe
                        </button>
                        <button
                            className="text-gray-600 hover:text-black"
                            onClick={() => setEditando(null)}
                        >
                            Cancelar
                        </button>
                        </div>
                    </>
                    )}
                </div>
                ))}
            </div>
        )}
        </div>
    );
}

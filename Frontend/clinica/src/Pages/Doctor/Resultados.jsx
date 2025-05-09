import { useState, useEffect } from "react";
import url_fetch from "../../environment";

export default function ResultadosDoctor() {
    const [resultados, setResultados] = useState([]);
    const [despensa, setDespensa] = useState([]);
    const [citaActual, setCitaActual] = useState(null);
    const [recetaTemp, setRecetaTemp] = useState({}); // { 'Amoxicilina': 2, ... }

    // 1) Listar diagnósticos pendientes (GET /api/diagnostico)
    useEffect(() => {
        const fetchDiagnosticos = async () => {
        try {
            const res = await fetch(`${url_fetch}/api/diagnostico`);
            if (!res.ok) throw new Error("Error al listar diagnósticos");
            const { diagnosticosPendientes } = await res.json();
            setResultados(
            diagnosticosPendientes.map((d) => ({
                id: d.id,                     // Result_Id
                patient_id: d.patient_id,     // <-- ahora viene del backend
                nombre: d.nombre,
                diagnostico: d.diagnostico,
                estado: d.estado,
                diagnostic_id: d.diagnostic_id,
                recetaAsignada: [],           // iniciamos vacío
            }))
            );
        } catch (e) {
            console.error("Error al obtener diagnósticos:", e);
        }
        };
        fetchDiagnosticos();
    }, []);

    // 2) Listar medicinas en despensa (GET /api/despensa)
    useEffect(() => {
        const fetchDespensa = async () => {
        try {
            const res = await fetch(`${url_fetch}/api/despensa`);
            if (!res.ok) throw new Error("Error al listar despensa");
            const data = await res.json();
            setDespensa(data);
        } catch (e) {
            console.error("Error al obtener despensa:", e);
        }
        };
        fetchDespensa();
    }, []);

    // 3) Enviar receta al paciente (POST /api/receta)
    const handleAsignar = async () => {
        if (!citaActual) return;
        const medicinasAsignadas = Object.entries(recetaTemp)
        .filter(([, cantidad]) => cantidad > 0)
        .map(([medicina, cantidad]) => ({ medicina, cantidad }));
        if (medicinasAsignadas.length === 0) return;

        try {
        const res = await fetch(`${url_fetch}/api/receta`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            patient_id:   citaActual.patient_id,   // <-- usamos aquí patient_id
            diagnostic_id: citaActual.diagnostic_id,
            receta: medicinasAsignadas,
            }),
        });
        if (!res.ok) throw new Error("Error en el servidor al asignar receta");
        const { message } = await res.json();
        if (message === "Receta asignada correctamente") {
            setResultados((prev) =>
            prev.map((r) =>
                r.id === citaActual.id
                ? { ...r, recetaAsignada: medicinasAsignadas }
                : r
            )
            );
            alert("Receta asignada correctamente");
        }
        } catch (e) {
        console.error("Error al asignar receta:", e);
        alert("No se pudo asignar la receta");
        } finally {
        setCitaActual(null);
        setRecetaTemp({});
        }
    };

    // 4) Enviar resultado terminado (POST /api/resultado)
    const terminarCita = async (id) => {
        const item = resultados.find((r) => r.id === id);
        if (!item) {
        console.error("No se encontró la cita para terminar:", id);
        return;
        }

        // quitamos de la UI
        setResultados((prev) => prev.filter((r) => r.id !== id));

        try {
        const res = await fetch(`${url_fetch}/api/resultado`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            paciente: item.nombre,
            diagnostico: item.diagnostico,
            receta: item.recetaAsignada,
            }),
        });
        if (!res.ok) throw new Error("Error al terminar cita");
        const { message } = await res.json();
        if (message === "Resultado enviado y actualizado correctamente") {
            alert("Cita terminada y resultado enviado correctamente");
        }
        } catch (e) {
        console.error("Error al terminar la cita:", e);
        alert("No se pudo terminar la cita");
        }
    };

    return (
        <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
            Resultados del Laboratorio
        </h2>

        <div className="grid gap-4">
            {resultados
            .filter((r) => r.estado === "pendiente")
            .map((res) => (
                <div key={res.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800">
                    {res.nombre}
                </h3>
                <p className="text-gray-700 mb-2">
                    <strong>Diagnóstico:</strong> {res.diagnostico}
                </p>

                {res.recetaAsignada.length > 0 ? (
                    <>
                    <div className="text-green-700 font-semibold">
                        <p className="mb-1">Receta asignada:</p>
                        <ul className="list-disc list-inside text-sm">
                        {res.recetaAsignada.map((r, i) => (
                            <li key={i}>
                            {r.medicina} × {r.cantidad}
                            </li>
                        ))}
                        </ul>
                    </div>
                    <button
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        onClick={() => terminarCita(res.id)}
                    >
                        Terminar cita
                    </button>
                    </>
                ) : (
                    <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    onClick={() => {
                        setCitaActual(res);
                        setRecetaTemp({});
                    }}
                    >
                    Asignar receta
                    </button>
                )}
                </div>
            ))}
        </div>

        {/* Modal de asignación */}
        {citaActual && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                onClick={() => {
                    setCitaActual(null);
                    setRecetaTemp({});
                }}
                className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
                >
                X
                </button>

                <h3 className="text-xl font-bold text-blue-700 mb-4">
                Asignar receta a {citaActual.nombre}
                </h3>
                <p className="mb-2 text-sm text-gray-600">
                Seleccioná una o más medicinas:
                </p>

                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {despensa
                    .filter((m) => m.cantidad > 0)
                    .map((med) => (
                    <div key={med.id} className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        checked={recetaTemp[med.nombre] > 0}
                        onChange={(e) =>
                            setRecetaTemp((prev) => ({
                            ...prev,
                            [med.nombre]: e.target.checked ? 1 : 0,
                            }))
                        }
                        />
                        <label className="flex-1">{med.nombre}</label>
                        {recetaTemp[med.nombre] > 0 && (
                        <input
                            type="number"
                            min={1}
                            max={med.cantidad}
                            value={recetaTemp[med.nombre]}
                            onChange={(e) =>
                            setRecetaTemp((prev) => ({
                                ...prev,
                                [med.nombre]: Number(e.target.value),
                            }))
                            }
                            className="w-20 border border-gray-300 rounded px-2 py-1"
                        />
                        )}
                    </div>
                    ))}
                </div>

                <button
                className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={handleAsignar}
                disabled={
                    Object.values(recetaTemp).filter((v) => v > 0).length === 0
                }
                >
                Confirmar receta
                </button>
            </div>
            </div>
        )}
        </div>
    );
}

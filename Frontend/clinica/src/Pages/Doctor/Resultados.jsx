import { useState } from "react";

export default function ResultadosDoctor() {

    // TODO: Reemplazar estos resultados con los recibidos desde el backend!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /*
        Ejemplo de respuesta esperada del backend:
        [
        {
            id: 1,
            nombre: "Juan Pérez",
            diagnostico: "Infección respiratoria",
            recetaAsignada: null,
            estado: "pendiente",
        },
        ...
        ]
    */


    const [resultados, setResultados] = useState([
        {
        id: 1,
        nombre: "Juan Pérez",
        diagnostico: "Infección respiratoria",
        recetaAsignada: null,
        estado: "pendiente",
        },
        {
        id: 2,
        nombre: "Ana López",
        diagnostico: "Presión arterial elevada",
        recetaAsignada: null,
        estado: "pendiente",
        },
    ]);

    
    
    // TODO: Cargar despensa del backend!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    /*
        Ejemplo de respuesta esperada:
        [
        { nombre: "Amoxicilina", descripcion:"Descripcion de la mediciona", cantidad: 10 },
        { nombre: "Ibuprofeno", descripcion:"Descripcion de la mediciona", cantidad: 5 },
        ...
        ]
    */


    const [despensa, setDespensa] = useState([
        { nombre: "Amoxicilina", cantidad: 10 },
        { nombre: "Ibuprofeno", cantidad: 5 },
        { nombre: "Paracetamol", cantidad: 0 },
    ]);

    const [citaActual, setCitaActual] = useState(null);
    const [recetaTemp, setRecetaTemp] = useState({}); // { 'Amoxicilina': 2, 'Ibuprofeno': 1 }

    const handleAsignar = () => {
        const medicinasAsignadas = Object.entries(recetaTemp)
        // eslint-disable-next-line no-unused-vars
        .filter(([nombre, cantidad]) => cantidad > 0)
        .map(([nombre, cantidad]) => ({ medicina: nombre, cantidad }));

        if (medicinasAsignadas.length === 0) return;

        // Descontar de la despensa
        const nuevaDespensa = despensa.map((med) => {
        const receta = medicinasAsignadas.find((r) => r.medicina === med.nombre);
        return receta
            ? { ...med, cantidad: med.cantidad - receta.cantidad }
            : med;
        });
        setDespensa(nuevaDespensa);

        // Asignar receta
        const nuevosResultados = resultados.map((res) =>
        res.id === citaActual.id
            ? { ...res, recetaAsignada: medicinasAsignadas }
            : res
        );
        setResultados(nuevosResultados);


        // TODO: Enviar al backend o chatbot!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        /*
        {
        paciente: citaActual.nombre,
        diagnostico: citaActual.diagnostico,
        receta: [ { medicina, cantidad }, ... ]
        }
        */
    
        console.log("Receta enviada:", {
        paciente: citaActual.nombre,
        diagnostico: citaActual.diagnostico,
        receta: medicinasAsignadas,
        });

        // Reset
        setCitaActual(null);
        setRecetaTemp({});
    };

    const terminarCita = (id) => {
        const actualizado = resultados.map((res) =>
            res.id === id ? { ...res, estado: "terminada" } : res
        );
        setResultados(actualizado);
    
        // TODO: SE TERMINA LA CITA, YA SE HA AGREGADO TODA LA INFO QUE NECESITA SABER EL PACIENTE
        console.log("Cita terminada para ID:", id);

    };

    return (
        <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Resultados del Laboratorio</h2>

        <div className="grid gap-4">
            {resultados
            .filter((res) => res.estado === "pendiente")
            .map((res) => (
                <div key={res.id} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800">{res.nombre}</h3>
                <p className="text-gray-700 mb-2">
                    <strong>Diagnóstico:</strong> {res.diagnostico}
                </p>

                {res.recetaAsignada ? (
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

        {/* MODAL para asignar receta */}
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

                <p className="mb-2 text-sm text-gray-600">Seleccioná una o más medicinas:</p>

                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {despensa
                    .filter((m) => m.cantidad > 0)
                    .map((med) => (
                    <div key={med.nombre} className="flex items-center gap-3">
                        <input
                        type="checkbox"
                        checked={recetaTemp[med.nombre] > 0}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setRecetaTemp((prev) => ({
                            ...prev,
                            [med.nombre]: checked ? 1 : 0,
                            }));
                        }}
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
                    Object.values(recetaTemp).filter((v) => v && v > 0).length === 0
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

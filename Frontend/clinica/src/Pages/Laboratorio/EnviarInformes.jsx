import { useState, useEffect } from "react";
import url_fetch from "../../environment.js";

export default function EnviarInformes() {

    const [informes, setInformes] = useState([]);

    // TODO: obtener informes terminados desde el backend (GET /api/informes-terminados)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Ejemplo de implementación:
    /*
    useEffect(() => {
        fetch("/api/informes-terminados")
        .then(res => res.json())
        .then(data => setInformes(data))
        .catch(err => console.error("Error al cargar informes:", err));
    }, []);
    */

    useEffect(() => {
        // setInformes([
        // {
        //     id: 1,
        //     nombrePaciente: "Juan Pérez",
        //     motivo: "Dolor de garganta",
        //     diagnostico: "Infección bacteriana leve",
        //     estado: "terminado",
        // },
        // {
        //     id: 2,
        //     nombrePaciente: "Ana López",
        //     motivo: "Fiebre persistente",
        //     diagnostico: "Faringitis viral aguda",
        //     estado: "terminado",
        // },
        // ]);
        fetch(`${url_fetch}/api/informes-terminados`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Informes terminados:", data);
                setInformes(data);
            }).catch((err) => {
                console.error("Error al cargar informes:", err);
            });

    }, []);

    const enviarAlDoctor = (id) => {
        const actualizado = informes.map((inf) =>
            inf.id === id ? { ...inf, estado: "enviado" } : inf
        );
        setInformes(actualizado);
    
        fetch(`${url_fetch}/api/informes/enviar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error al enviar informe");
            return res.json();
        })
        .then((data) => console.log("Informe enviado:", data))
        .catch((err) => console.error("Error al enviar informe:", err));
    
        console.log("Informe enviado al doctor (ID):", id);
    };
    
    return (
        <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Enviar Informes al Doctor</h2>

        {informes.filter((i) => i.estado === "terminado").length === 0 ? (
            <p className="text-gray-600">No hay informes listos para enviar.</p>
        ) : (
            <div className="grid gap-4">
            {informes
                .filter((i) => i.estado === "terminado")
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
                    <button
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    onClick={() => enviarAlDoctor(inf.id)}
                    >
                    Enviar al doctor
                    </button>
                </div>
                ))}
            </div>
        )}
        </div>
    );
}

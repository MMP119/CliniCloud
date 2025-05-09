import { useState, useEffect  } from "react";
import url_fetch from "../../environment";

export default function CitasListaDoctor() {
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [citas, setCitas] = useState([]);

    // TODO: Reemplazar estos datos con los que vienen del backend!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    const fetchCitas = async () => {
        try {
            const response = await fetch(`${url_fetch}/api/citas`);  // Usamos url_fetch desde el archivo de entorno
            const data = await response.json();
            setCitas(data);
        } catch (error) {
            console.error("Error al obtener citas:", error);
        }
    };

    // Llamar al backend cuando el componente se monta
    useEffect(() => {
        fetchCitas();
    }, []);

    const handleEnviarAlLab = async (cita) => {
        // Enviar la cita al laboratorio
        try {
            const response = await fetch(`${url_fetch}/api/citas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patient_id: cita.id, // Id del paciente
                }),
            });
            const result = await response.json();
            if (result.status === 200) {
                alert(`Cita enviada al laboratorio: ${cita.nombre}`);
                fetchCitas(); // Vuelve a obtener las citas después de enviar la cita
            } else {
                alert("Hubo un problema al enviar la cita al laboratorio.");
            }
        } catch (error) {
            console.error("Error al enviar la cita al laboratorio:", error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Listado de Citas</h2>

            <div className="grid gap-4">
                {citas.map((cita) => (
                <div key={cita.id} className="bg-white shadow p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-lg">{cita.nombre}</p>
                        <p className="text-sm text-gray-600">{cita.fecha} a las {cita.hora}</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                        className="text-blue-600 underline"
                        onClick={() => setCitaSeleccionada(cita)}
                        >
                        Ver detalles
                        </button>
                        <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => handleEnviarAlLab(cita)}
                        >
                        Enviar al laboratorio
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>

            {/*detalle de la cita */}
            {citaSeleccionada && (

                <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">

                    <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">

                        <button onClick={() => setCitaSeleccionada(null)} className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl">
                            X
                        </button>

                        <h3 className="text-2xl font-semibold text-blue-700 mb-4">
                            Detalles de la Cita
                        </h3>

                        <p className="text-xl"><strong>Nombre:</strong> {citaSeleccionada.nombre}</p>
                        <p className="text-xl"><strong>Correo:</strong> {citaSeleccionada.correo}</p>
                        <p className="text-xl"><strong>Motivo:</strong> {citaSeleccionada.motivo}</p>
                        <p className="text-xl"><strong>Fecha:</strong> {citaSeleccionada.fecha}</p>
                        <p className="text-xl"><strong>Hora:</strong> {citaSeleccionada.hora}</p>

                    </div>
                </div>
            )}
        </div>
    );
}

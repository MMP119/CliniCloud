import { useRef, useState } from "react";

export default function DespensaDoctor() {
    
    // TODO: Cargar inventario desde el backend (GET /api/despensa)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const [despensa, setDespensa] = useState([
        { nombre: "Amoxicilina", descripcion: "Antibiótico amplio espectro", cantidad: 10 },
        { nombre: "Ibuprofeno", descripcion: "Antiinflamatorio no esteroideo", cantidad: 5 },
        { nombre: "Paracetamol", descripcion: "Analgésico y antipirético", cantidad: 0 },
    ]);

    const [medicinaEditando, setMedicinaEditando] = useState(null);
    const [nuevaCantidad, setNuevaCantidad] = useState(0);

    const [formNueva, setFormNueva] = useState({
        nombre: "",
        descripcion: "",
        cantidad: 1,
    });

    // reconocimiento facial
    const [mostrarCamara, setMostrarCamara] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const iniciarCamara = async () => {
        setMostrarCamara(true);
        try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        } catch (error) {
        console.error("Error al acceder a la cámara:", error);
        }
    };

    const capturarFoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
        if (blob) {

            // TODO: Enviar 'blob' al backend para validación con Rekognition!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            console.log("Foto capturada:", blob);

            /*
            const formData = new FormData();
            formData.append("foto", blob, "captura.jpg");

            fetch("/api/verificar-reconocimiento", {
            method: "POST",
            body: formData,
            })
            .then(res => res.json())
            .then(data => {
            if (data.autenticado) {
                // Permitir editar/agregar medicina
            } else {
                alert("Acceso denegado");
            }
            });
            */
        }
        }, "image/jpeg");
    };

    const handleEditar = (med) => {
        setMedicinaEditando(med.nombre);
        setNuevaCantidad(med.cantidad);
    };

    const handleGuardar = () => {
        const actualizada = despensa.map((m) =>
        m.nombre === medicinaEditando ? { ...m, cantidad: nuevaCantidad } : m
        );
        setDespensa(actualizada);

        // TODO: Actualizar cantidad en backend (PATCH /api/despensa)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log("Actualizando en backend:", medicinaEditando, nuevaCantidad);

        setMedicinaEditando(null);
        setNuevaCantidad(0);
    };

    const handleAgregarNueva = () => {
        if (!formNueva.nombre || !formNueva.descripcion || formNueva.cantidad < 0) return;

        const nueva = {
        nombre: formNueva.nombre,
        descripcion: formNueva.descripcion,
        cantidad: formNueva.cantidad,
        };

        setDespensa([...despensa, nueva]);


        // TODO: Enviar nueva medicina al backend (POST /api/despensa)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        console.log("Agregando nueva medicina:", nueva);

        // Reset
        setFormNueva({ nombre: "", descripcion: "", cantidad: 1 });
    };

    return (
        <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Despensa de Medicinas</h2>

        {/* Reconocimiento facial */}
        <div className="mb-6">
            {!mostrarCamara ? (
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                onClick={iniciarCamara}
            >
                Iniciar reconocimiento facial
            </button>
            ) : (
            <div className="flex flex-col items-center gap-4">
                <video
                ref={videoRef}
                autoPlay
                className="border border-gray-400 rounded shadow max-w-full"
                style={{ width: "320px", height: "auto" }}
                />
                <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={capturarFoto}
                >
                Capturar y verificar
                </button>
                <canvas ref={canvasRef} className="hidden" />
            </div>
            )}
        </div>

        {/* Formulario para agregar nueva medicina */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Agregar nueva medicina</h3>

            <div className="grid gap-4 md:grid-cols-3">
            <input
                type="text"
                placeholder="Nombre"
                value={formNueva.nombre}
                onChange={(e) => setFormNueva({ ...formNueva, nombre: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
            />
            <input
                type="text"
                placeholder="Descripción"
                value={formNueva.descripcion}
                onChange={(e) => setFormNueva({ ...formNueva, descripcion: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2"
            />
            <input
                type="number"
                placeholder="Cantidad"
                min={0}
                value={formNueva.cantidad}
                onChange={(e) => setFormNueva({ ...formNueva, cantidad: Number(e.target.value) })}
                className="border border-gray-300 rounded px-3 py-2"
            />
            </div>

            <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleAgregarNueva}
            >
            Agregar medicina
            </button>
        </div>

        {/* Lista de medicinas */}
        <div className="grid gap-4">
            {despensa.map((med) => (
            <div key={med.nombre} className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800">{med.nombre}</h3>
                <p className="text-gray-600 mb-2">{med.descripcion}</p>

                {medicinaEditando === med.nombre ? (
                <div className="flex items-center gap-2">
                    <input
                    type="number"
                    min={0}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                    value={nuevaCantidad}
                    onChange={(e) => setNuevaCantidad(Number(e.target.value))}
                    />
                    <button
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    onClick={handleGuardar}
                    >
                    Guardar
                    </button>
                    <button
                    className="text-gray-500 hover:text-black"
                    onClick={() => setMedicinaEditando(null)}
                    >
                    Cancelar
                    </button>
                </div>
                ) : (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">Cantidad: {med.cantidad}</p>
                    <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEditar(med)}
                    >
                    Editar
                    </button>
                </div>
                )}
            </div>
            ))}
        </div>
        </div>
    );
}

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import url_fetch from "../../environment";

const locales = {
    "es-GT": es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date) => startOfWeek(date, { locale: es }),
    getDay,
    locales,
});

export default function CitasDoctor() {
    const [eventos, setEventos] = useState([]);

    useEffect(() => {
        // Función para obtener las citas
        const fetchCitas = async () => {
            try {
                const response = await fetch(`${url_fetch}/api/citas-doctor`); // Usamos la URL definida en environment.js
                const data = await response.json();

                if (Array.isArray(data)) {
                    const citas = data.map((ev) => ({
                        title: ev.title,
                        start: new Date(ev.start),
                        end: new Date(ev.end),
                    }));
                    setEventos(citas);
                } else {
                    console.error("Respuesta no es un array:", data);
                }
            } catch (error) {
                console.error("Error al obtener las citas:", error);
            }
        };

        fetchCitas();
    }, []);

    return (
        <>
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Mis Citas</h2>

            <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden" style={{ height: "calc(100vh - 115px)" }}>
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="month"
                    views={{ month: true, week: true, day: true }}
                    style={{ height: "100%" }}
                    popup
                    toolbar
                    messages={{
                        next: "→",
                        previous: "←",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                        noEventsInRange: "No hay citas en este rango.",
                    }}
                />
            </div>
        </>
    );
}
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { useEffect, useState } from "react";

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

        // TODO: Reemplazar esta parte PARA EL BACKEND, ASÍ:!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        /*
            Respuesta del backend:
            [
                {
                    "title": "Consulta",
                    "start": "2025-04-25T10:00:00",
                    "end": "2025-04-25T11:00:00"
                }
            ]

            Reemplazar las líneas de abajo por esto:
            setEventos(data.map(ev => ({
                ...ev,
                start: new Date(ev.start),
                end: new Date(ev.end)
            })));
        */

        // Simulación de eventos (mes 0-indexado)
        setEventos([
        {
            title: "Consulta con Juan Pérez",
            start: new Date(2025, 3, 25, 10, 0),
            end: new Date(2025, 3, 25, 11, 0),
        },
        {
            title: "Chequeo - Ana López",
            start: new Date(2025, 3, 28, 14, 30),
            end: new Date(2025, 3, 28, 15, 15),
        },
        ]);
    }, []);

    return (
        <>
        
        <h2 className="text-2xl font-bold text-blue-700 mb-4">Mis Citas</h2>

        <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden" style={{ height: "calc(100vh - 150px)" }}>
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

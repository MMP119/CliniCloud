import aiomysql
from fastapi import APIRouter, Request, HTTPException
from datetime import datetime, timedelta
from database import get_db_pool

router = APIRouter()

@router.get("/api/citas-doctor")
async def get_doctor_appointments(request: Request):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                # Obtener todas las citas de los pacientes
                await cursor.execute("SELECT Patient_Name, Patient_Appointment FROM PATIENT")
                appointments = await cursor.fetchall()

                # Crear una lista con los datos formateados para las citas
                result = []
                for appointment in appointments:
                    patient_name = appointment["Patient_Name"]
                    start_time = appointment["Patient_Appointment"]
                    end_time = start_time + timedelta(hours=1)  # Sumar 1 hora a la cita

                    # Formatear las fechas en el formato adecuado según el front (ISO 8601)
                    start_str = start_time.strftime("%Y-%m-%dT%H:%M:%S")
                    end_str = end_time.strftime("%Y-%m-%dT%H:%M:%S")

                    # Crear la cita con el título y los horarios
                    result.append({
                        "title": f"Consulta {patient_name}",
                        "start": start_str,
                        "end": end_str
                    })

                return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

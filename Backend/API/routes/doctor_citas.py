import aiomysql
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from database import get_db_pool

router = APIRouter()

class SolicitudRequest(BaseModel):
    patient_id: int

@router.get("/api/citas")
async def get_citas(request: Request):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                await cursor.execute("""
                    SELECT 
                        Patient_Id, 
                        Patient_Name, 
                        Patient_email, 
                        Description, 
                        Patient_Appointment
                    FROM PATIENT
                    WHERE Appointment_status = 'Pendiente'
                """)
                patients = await cursor.fetchall()

                citas = []
                for patient in patients:
                    appointment_datetime = patient["Patient_Appointment"]

                    citas.append({
                        "id": patient["Patient_Id"],
                        "nombre": patient["Patient_Name"],
                        "correo": patient["Patient_email"],
                        "motivo": patient["Description"],
                        "fecha": appointment_datetime.strftime("%Y-%m-%d"),  
                        "hora": appointment_datetime.strftime("%H:%M")    
                    })

                return citas

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/api/citas")
async def enviar_cita_al_laboratorio(request: Request, data: SolicitudRequest):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                
                # Verificar que el paciente exista
                await cursor.execute("SELECT * FROM PATIENT WHERE Patient_Id = %s", (data.patient_id,))
                paciente = await cursor.fetchone()

                if not paciente:
                    raise HTTPException(status_code=404, detail="Paciente no encontrado")

                # Insertar en la tabla de solicitudes
                await cursor.execute("""
                    INSERT INTO TESTS_PERFORMED (Patient_Id, Motive, Status, Diagnostic)
                    VALUES (%s, %s, 'pendiente', '')
                """, (paciente["Patient_Id"], paciente["Description"]))

                # Actualizar el estado de la cita a 'Realizada'
                await cursor.execute("""
                    UPDATE PATIENT
                    SET Appointment_status = 'Realizada'
                    WHERE Patient_Id = %s
                """, (data.patient_id,))

                await conn.commit()

                print(f"Solicitud enviada al laboratorio para el paciente {paciente['Patient_Name']}")
                print(f"Motivo: {paciente['Description']}") 
                return {"status": 200, "message": "Solicitud enviada al laboratorio y estado de la cita actualizado"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
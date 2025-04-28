import aiomysql
from pydantic import BaseModel
from fastapi import APIRouter, Request, HTTPException
from database import get_db_pool

router = APIRouter()

class DiagnosticoUpdate(BaseModel):
    diagnostico: str
    estado: str

@router.get("/api/solicitudes-lab")
async def get_solicitudes_lab(request: Request):
    try:
        pool = await get_db_pool(request.app)
        
        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                # Consulta para obtener las solicitudes pendientes con el nombre del paciente
                query = """
                    SELECT 
                        s.Solicitud_Id, 
                        p.Patient_Name, 
                        s.Motivo, 
                        s.Estado, 
                        s.Diagnostico
                    FROM SOLICITUDES_LAB s
                    JOIN PATIENT p ON s.Patient_Id = p.Patient_Id
                    WHERE s.Estado = 'pendiente'
                """
                await cursor.execute(query)
                solicitudes = await cursor.fetchall()

                if not solicitudes:
                    raise HTTPException(status_code=404, detail="No hay solicitudes pendientes.")

                response = [
                    {
                        "id": solicitud["Solicitud_Id"],
                        "nombrePaciente": solicitud["Patient_Name"],  
                        "motivo": solicitud["Motivo"],
                        "estado": solicitud["Estado"],
                        "diagnostico": solicitud["Diagnostico"]
                    }
                    for solicitud in solicitudes
                ]
                return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.patch("/api/solicitudes-lab/{id}")
async def actualizar_diagnostico(id: int, update_data: DiagnosticoUpdate, request: Request):
    try:
        # prints de verificación
        print(f"Recibiendo actualización para la solicitud con ID {id}")
        print(f"Diagnóstico recibido: {update_data.diagnostico}")
        print(f"Estado recibido: {update_data.estado}")

        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                print(f"Ejecutando consulta SQL para actualizar la solicitud con ID {id}")
                
                await cursor.execute(
                    """
                    UPDATE SOLICITUDES_LAB
                    SET Diagnostico = %s, Estado = %s
                    WHERE Solicitud_Id = %s
                    """,
                    (update_data.diagnostico, update_data.estado, id)
                )
                await conn.commit()

                if cursor.rowcount == 0:
                    print(f"No se encontró ninguna solicitud con ID {id}")
                    raise HTTPException(status_code=404, detail="Solicitud no encontrada")

                print(f"Diagnóstico actualizado correctamente para la solicitud con ID {id}")

                return {"message": "Diagnóstico actualizado con éxito"}

    except Exception as e:
        print(f"Error al actualizar el diagnóstico: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al actualizar el diagnóstico: {str(e)}")
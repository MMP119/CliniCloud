import aiomysql
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from database import get_db_pool

router = APIRouter()

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
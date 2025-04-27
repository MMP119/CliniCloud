import aiomysql
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from database import get_db_pool

import hashlib
import random
import string

def generate_short_code(length=6):
    characters = string.ascii_uppercase + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

router = APIRouter()

# ---------- MODELOS ----------
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterPatientRequest(BaseModel):
    name: str
    email: str
    description: str
    appointment: str  # Formato "2025-04-28T10:30:00"


# ---------- ENDPOINTS ----------

@router.post("/api/login")
async def login(request: Request, data: LoginRequest):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor: 
                await cursor.execute(
                    "SELECT Login_Id, Email, Password, Rol_Type FROM LOGIN WHERE Email = %s", 
                    (data.email,)
                )
                user = await cursor.fetchone()
                
                if not user:
                    raise HTTPException(status_code=400, detail="No se encontró el email en el sistema")

                md5_hash = hashlib.md5()
                md5_hash.update(data.password.encode('utf-8'))
                hashed_password = md5_hash.hexdigest()

                if hashed_password != user["Password"]:
                    print("Contraseña ingresada (hashed):", hashed_password)
                    raise HTTPException(status_code=400, detail="Contraseña incorrecta")
                
                return {
                    "status": 200,
                    "message": "Login exitoso",
                    "Rol_Type": user["Rol_Type"],
                    "Login_Id": user["Login_Id"]
                }

    except HTTPException:
        raise  
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.post("/api/logout")
async def logout(request: Request):
    try:
        return {"status": 200, "message": "Logout exitoso"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.post("/api/register_patient")
async def register_patient(request: Request, data: RegisterPatientRequest):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                # Generamos un código único corto
                unique_code = generate_short_code()

                # Verificamos si el código ya existe 
                await cursor.execute("SELECT * FROM PATIENT WHERE Unique_Code = %s", (unique_code,))
                existing_patient = await cursor.fetchone()

                # Si ya existe, generamos otro código
                while existing_patient:
                    unique_code = generate_short_code()
                    await cursor.execute("SELECT * FROM PATIENT WHERE Unique_Code = %s", (unique_code,))
                    existing_patient = await cursor.fetchone()

                sql = """
                INSERT INTO PATIENT (Patient_Name, Patient_email, Description, Patient_Appointment, Unique_Code)
                VALUES (%s, %s, %s, %s, %s)
                """

                await cursor.execute(sql, (
                    data.name,
                    data.email,
                    data.description,
                    data.appointment,
                    unique_code
                ))

                await conn.commit()

                return {
                    "status": 201,
                    "message": "Paciente registrado exitosamente",
                    "unique_code": unique_code
                }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

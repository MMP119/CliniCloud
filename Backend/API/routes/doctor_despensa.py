import aiomysql
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from database import get_db_pool

router = APIRouter()

# ---------- MODELOS ----------

class RegisterMedicina(BaseModel):
    nombre: str
    descripcion: str
    cantidad: int  

class UpdateCantidadMedicina(BaseModel):
    cantidad: int

# ---------- ENDPOINTS ----------

# TODO -> AWS reconocimiento facial para el doctor

@router.get("/api/despensa")
async def get_medicinas(request: Request):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                query = "SELECT * FROM MEDICINE"
                await cursor.execute(query)
                medicinas = await cursor.fetchall()

                if not medicinas:
                    raise HTTPException(status_code=404, detail="No hay medicinas registradas.")

                response = [
                    {
                        "id": medicina["Medicine_Id"],
                        "nombre": medicina["Medicine_Name"],
                        "descripcion": medicina["Description"],
                        "cantidad": medicina["Amount"]
                    }
                    for medicina in medicinas
                ]
                return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.post("/api/despensa")
async def crear_medicina(request: Request, medicina: RegisterMedicina):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                query = """
                    INSERT INTO MEDICINE (Medicine_Name, Description, Amount)
                    VALUES (%s, %s, %s)
                """
                await cursor.execute(query, (medicina.nombre, medicina.descripcion, medicina.cantidad))
                await conn.commit()

                return {"mensaje": "Medicina registrada exitosamente."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.patch("/api/despensa/{id}")
async def actualizar_cantidad_medicina(request: Request, id: int, datos: UpdateCantidadMedicina):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor() as cursor:
                query_select = """
                    SELECT * FROM MEDICINE
                    WHERE Medicine_Id = %s
                """
                await cursor.execute(query_select, (id,))
                medicina = await cursor.fetchone()

                if not medicina:
                    raise HTTPException(status_code=404, detail="Medicina no encontrada.")

                query_update = """
                    UPDATE MEDICINE
                    SET Amount = %s
                    WHERE Medicine_Id = %s
                """
                await cursor.execute(query_update, (datos.cantidad, id))
                await conn.commit()

                return {"mensaje": f"Cantidad de medicina {id} actualizada a {datos.cantidad} unidades."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
import aiomysql
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from database import get_db_pool

router = APIRouter()

class RecetaItem(BaseModel):
    medicina: str  
    cantidad: int

class EnviarResultadoRequest(BaseModel):
    paciente: str
    diagnostico: str
    receta: list[RecetaItem]

class AsignarRecetaRequest(BaseModel):
    patient_id: int
    diagnostic_id: int
    receta: list[RecetaItem]

@router.get("/api/diagnostico")
async def listar_diagnosticos_pendientes(request: Request):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                
                query = """
                    SELECT 
                        r.Result_Id,
                        p.Patient_Id,
                        p.Patient_Name,
                        t.Diagnostic AS Diagnostico_Descripcion,
                        r.Recipe,
                        r.Status,
                        t.Test_Id
                    FROM RESULT_OF_DIAGNOSTIC r
                    INNER JOIN PATIENT p ON r.Patient_Id = p.Patient_Id
                    INNER JOIN TESTS_PERFORMED t ON r.Diagnostic = t.Test_Id
                    WHERE r.Status = 'pendiente'
                """
                await cursor.execute(query)
                resultados = await cursor.fetchall()

                diagnosticos = []
                for r in resultados:
                    diagnosticos.append({
                        "id": r["Result_Id"],
                        "patient_id": r["Patient_Id"],
                        "nombre": r["Patient_Name"],
                        "diagnostico": r["Diagnostico_Descripcion"],
                        "recetaAsignada": r["Recipe"],
                        "estado": r["Status"],
                        "diagnostic_id": r["Test_Id"]
                    })

                return {"diagnosticosPendientes": diagnosticos}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/api/receta")
async def asignar_receta(request: Request, data: AsignarRecetaRequest):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:

                # Validar que el paciente exista
                await cursor.execute("SELECT * FROM PATIENT WHERE Patient_Id = %s", (data.patient_id,))
                paciente = await cursor.fetchone()
                if not paciente:
                    raise HTTPException(status_code=404, detail="Paciente no encontrado")

                # Validar que el diagnóstico exista
                await cursor.execute("SELECT * FROM TESTS_PERFORMED WHERE Test_Id = %s", (data.diagnostic_id,))
                test = await cursor.fetchone()
                if not test:
                    raise HTTPException(status_code=404, detail="Diagnóstico no encontrado")

                receta_items = []

                # Verificar stock de medicinas y preparar receta
                for item in data.receta:
                    await cursor.execute("SELECT * FROM MEDICINE WHERE Medicine_Name = %s", (item.medicina,))
                    medicina = await cursor.fetchone()
                    if not medicina:
                        raise HTTPException(status_code=404, detail=f"Medicina {item.medicina} no encontrada")
                    if medicina["Amount"] < item.cantidad:
                        raise HTTPException(status_code=400, detail=f"No hay suficiente stock de {medicina['Medicine_Name']}")

                    # Agregar al formato de receta con nombre
                    receta_items.append(f"{item.cantidad}x{medicina['Medicine_Name']}")

                # Actualizar stock de medicinas
                for item in data.receta:
                    await cursor.execute(
                        "UPDATE MEDICINE SET Amount = Amount - %s WHERE Medicine_Name = %s",
                        (item.cantidad, item.medicina)
                    )

                receta_texto = ",".join(receta_items)

                # Verificar si ya existe un RESULT_OF_DIAGNOSTIC para este paciente y diagnóstico
                await cursor.execute(
                    "SELECT Result_Id FROM RESULT_OF_DIAGNOSTIC WHERE Patient_Id = %s AND Diagnostic = %s",
                    (data.patient_id, data.diagnostic_id)
                )
                resultado_existente = await cursor.fetchone()

                if resultado_existente:
                    # Si existe, hacer UPDATE
                    await cursor.execute(
                        "UPDATE RESULT_OF_DIAGNOSTIC SET Recipe = %s WHERE Result_Id = %s",
                        (receta_texto, resultado_existente["Result_Id"])
                    )
                else:
                    # Si no existe, hacer INSERT
                    await cursor.execute(
                        "INSERT INTO RESULT_OF_DIAGNOSTIC (Patient_Id, Diagnostic, Recipe, Status) VALUES (%s, %s, %s, %s)",
                        (data.patient_id, data.diagnostic_id, receta_texto, "pendiente")
                    )

                await conn.commit()

                return {"message": "Receta asignada correctamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.post("/api/resultado")
async def enviar_resultado(request: Request, data: EnviarResultadoRequest):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                
                # Buscar el paciente
                await cursor.execute(
                    "SELECT Patient_Id FROM PATIENT WHERE Patient_Name = %s",
                    (data.paciente,)
                )
                paciente = await cursor.fetchone()
                if not paciente:
                    raise HTTPException(status_code=404, detail="Paciente no encontrado")

                # Buscar el diagnóstico
                await cursor.execute(
                    """
                    SELECT t.Test_Id
                    FROM TESTS_PERFORMED t
                    INNER JOIN PATIENT p ON t.Patient_Id = p.Patient_Id
                    WHERE t.Diagnostic = %s AND p.Patient_Name = %s
                    """,
                    (data.diagnostico, data.paciente)
                )
                diagnostico = await cursor.fetchone()
                if not diagnostico:
                    raise HTTPException(status_code=404, detail="Diagnóstico no encontrado para el paciente")

                # Formatear la receta como texto: 2xParacetamol,1xIbuprofeno
                receta_texto = ",".join([f"{item.cantidad}x{item.medicina}" for item in data.receta])

                # Actualizar RESULT_OF_DIAGNOSTIC
                await cursor.execute(
                    """
                    UPDATE RESULT_OF_DIAGNOSTIC
                    SET Recipe = %s, Status = 'terminada'
                    WHERE Patient_Id = %s AND Diagnostic = %s
                    """,
                    (receta_texto, paciente["Patient_Id"], diagnostico["Test_Id"])
                )

                await conn.commit()
                # print("Receta actualizada:", receta_texto) 
                # print("Estado actualizado a 'terminada'")
                # print("Resultado enviado:", receta_texto)
                # print("Paciente:", data.paciente)
                return {"message": "Resultado enviado y actualizado correctamente"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

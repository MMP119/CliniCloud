import aiomysql
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel
from database import get_db_pool

router = APIRouter()

@router.get("/api/diagnostico")
async def listar_diagnosticos_pendientes(request: Request):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                
                query = """
                    SELECT 
                        r.Result_Id,
                        p.Patient_Name,
                        t.Diagnostic AS Diagnostico_Descripcion,
                        r.Recipe,
                        r.Status
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
                        "nombre": r["Patient_Name"],
                        "diagnostico": r["Diagnostico_Descripcion"],
                        "recetaAsignada": r["Recipe"],
                        "estado": r["Status"]
                    })

                return {"diagnosticosPendientes": diagnosticos}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
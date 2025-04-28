import aiomysql
from pydantic import BaseModel
from fastapi import APIRouter, Request, HTTPException
from database import get_db_pool

router = APIRouter()

class InformeEnviarRequest(BaseModel):
    id: int

@router.get("/api/informes-terminados")
async def get_solicitudes_lab(request: Request):
    try:
        pool = await get_db_pool(request.app)
        
        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                # Consulta para obtener las solicitudes terminadas con el nombre del paciente
                query = """
                    SELECT 
                        s.Test_Id, 
                        p.Patient_Name, 
                        s.Motive, 
                        s.Status, 
                        s.Diagnostic
                    FROM TESTS_PERFORMED s
                    JOIN PATIENT p ON s.Patient_Id = p.Patient_Id
                    WHERE s.Status = 'terminado'
                """
                await cursor.execute(query)
                informes = await cursor.fetchall()

                if not informes:
                    raise HTTPException(status_code=404, detail="No hay informes terminados a enviar.")

                response = [
                    {
                        "id": informe["Test_Id"],
                        "nombrePaciente": informe["Patient_Name"],  
                        "motivo": informe["Motive"],
                        "estado": informe["Status"],
                        "diagnostico": informe["Diagnostic"]
                    }
                    for informe in informes
                ]
                return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")


@router.post("/api/informes/enviar")
async def enviar_informe(request: Request, datos: InformeEnviarRequest):
    try:
        pool = await get_db_pool(request.app)

        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:

                query_select = """
                    SELECT Status
                    FROM TESTS_PERFORMED
                    WHERE Test_Id = %s
                """
                await cursor.execute(query_select, (datos.id,))
                informe = await cursor.fetchone()

                if not informe:
                    raise HTTPException(status_code=404, detail="Informe no encontrado.")

                if informe["Status"] != "terminado":
                    raise HTTPException(status_code=400, detail="El informe no está en estado 'terminado'.")

                print(f"Enviando informe {datos.id} al doctor...")

                query_update = """
                    UPDATE TESTS_PERFORMED
                    SET Status = 'enviado'
                    WHERE Test_Id = %s
                """
                await cursor.execute(query_update, (datos.id,))
                await conn.commit()

                return {"mensaje": f"Informe {datos.id} enviado correctamente y actualizado a 'enviado'."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

@router.get("/api/informes-enviados")
async def get_informes_enviados(request: Request):
    try:
        pool = await get_db_pool(request.app)
        
        async with pool.acquire() as conn:
            async with conn.cursor(aiomysql.DictCursor) as cursor:
                # Consulta para obtener los informes enviados con el nombre del paciente
                query = """
                    SELECT 
                        s.Test_Id, 
                        p.Patient_Name, 
                        s.Motive, 
                        s.Status, 
                        s.Diagnostic
                    FROM TESTS_PERFORMED s
                    JOIN PATIENT p ON s.Patient_Id = p.Patient_Id
                    WHERE s.Status = 'enviado'
                """
                await cursor.execute(query)
                informes = await cursor.fetchall()

                if not informes:
                    raise HTTPException(status_code=404, detail="No hay informes enviados.")

                response = [
                    {
                        "id": informe["Test_Id"],
                        "nombrePaciente": informe["Patient_Name"],  
                        "motivo": informe["Motive"],
                        "estado": informe["Status"],
                        "diagnostico": informe["Diagnostic"]
                    }
                    for informe in informes
                ]
                return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")
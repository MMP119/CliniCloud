from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_pool
from routes.autenticacion import router as login_router
from routes.doctor_calendar import router as doctor_calendar_router
from routes.doctor_citas import router as doctor_citas_router
from routes.lab_solicitudes import router as lab_solicitudes_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

app.include_router(login_router)
app.include_router(doctor_calendar_router)
app.include_router(doctor_citas_router)
app.include_router(lab_solicitudes_router)

@app.on_event("startup")
async def startup_event():
    try:
        await get_db_pool(app)
        print("Conexión a la base de datos establecida")
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    if hasattr(app.state, "db_pool"):
        app.state.db_pool.close()
        await app.state.db_pool.wait_closed()

@app.get("/")
def read_root():
    return {"message": "Bienvenid@ a CliniCloud"}

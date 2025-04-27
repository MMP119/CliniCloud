## Pasos para ejecutar la API

### Crear y activar un entorno virtual

Crear el entorno virtual

``` bash
python -m venv .venv
``` 

### Activar el entorno virtual

para Windows
``` bash
.venv/Scripts/activate
``` 

para Linux/macOS
``` bash
source .venv/bin/activate
``` 

### Instalar las dependencias del Proyecto

``` bash
pip install -r requirements.txt
``` 

### Ejecutar el servidor de la API

``` bash
uvicorn main:app --reload
``` 

### Acceder a la documentación automática

- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

### Desactivar el entorno virtual

``` bash
deactivate
``` 

### Posibles fallas y sus soluciones

1. Si PowerShell te da un error sobre la ejecución de scripts

``` bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
``` 

2.  Si obtienes un error relacionado con el puerto 8000, probablemente otro proceso ya lo esté usando. Puedes cambiar el puerto con el siguiente comando:

``` bash
uvicorn main:app --reload --port 8001
``` 
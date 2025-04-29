# Manual para utilizar la API

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
## Guía del flujo de la API

### 1. POST Inicio de sesión

POST http://localhost:8000/api/login

json de entrada

```json
{
    "email": "doc@doc.com",
    "password": "doc"
}
```

respuesta esperada

```json
{
    "status": 200,
    "message": "Login exitoso",
    "Rol_Type": "Doctor",
    "Login_Id": 1
}
```
---

### 2. GET Logout

GET http://localhost:8000/api/logout

json de entrada

```json
{}
```

respuesta esperada

```json
{
    "status": 200,
    "message": "Logout exitoso"
}
```
---
### 3. POST Registrar paciente

POST http://localhost:8000/api/register-patient

json de entrada

```json
{
    "name": "Ana Pinzón",
    "email": "ana@example.com",
    "description": "fatiga, debilidad, falta de aire.",
    "appointment": "2025-04-15T11:00:00"
}
```

respuesta esperada

```json
{
    "status": 201,
    "message": "Paciente registrado exitosamente",
    "unique_code": "U8GA43"
}
```
---
### 4. GET Calendario citas del doctor

GET http://localhost:8000/api/citas-doctor

respuesta esperada
```json
[
    {
        "title": "Consulta Juan Perez",
        "start": "2025-02-13T08:00:00",
        "end": "2025-02-13T09:00:00"
    },
    {
        "title": "Consulta Ana Pinzón",
        "start": "2025-04-15T11:00:00",
        "end": "2025-04-15T12:00:00"
    }
]
```
---  
### 5. GET Detalles citas

GET http://localhost:8000/api/citas

nota: Aquí solo se listan citas pendientes

respuesta esperada

```json
[
    {
        "id": 2,
        "nombre": "Ana Pinzón",
        "correo": "ana@example.com",
        "motivo": "fatiga, debilidad, falta de aire.",
        "fecha": "2025-04-15",
        "hora": "11:00"
    }
]
```
---
### 6. POST Enviar citas al laboratorio

POST http://localhost:8000/api/citas

json de entrada (id -> del paciente)
```json
{
  "patient_id": 2
}
```

respuesta esperada
```json
{
    "status": 200,
    "message": "Solicitud enviada al laboratorio y estado de la cita actualizado"
}
```
---
### 7. GET Revisar solicitudes 

GET http://localhost:8000/api/solicitudes-lab

nota: aquí se listan todas las solicitudes enviadas por el doctor que no han sido atendidas por el laboratorio

respuesta esperada

```json
[
    {
        "id": 1,
        "nombrePaciente": "Juan Perez",
        "motivo": "dolores musculares o corporales.",
        "estado": "pendiente",
        "diagnostico": ""
    },
    {
        "id": 2,
        "nombrePaciente": "Ana Pinzón",
        "motivo": "fatiga, debilidad, falta de aire.",
        "estado": "pendiente",
        "diagnostico": ""
    }
]
```
---
### 8. PATCH Atender solicitudes

PATCH http://localhost:8000/api/solicitudes-lab/{id}

json de entrada

```json
{
  "diagnostico": "anemia",
  "estado": "terminado"
}
```

salida esperada

```json
{
    "message": "Diagnóstico actualizado con éxito"
}
```

---
### 9. GET Listar informes de solicitudes ya atendidas

GET http://localhost:8000/api/informes-terminados

nota: aquí se listan los informes terminados pero que **aún no han sido enviados al doctor**

salida esperada

```json
[
    {
        "id": 1,
        "nombrePaciente": "Juan Perez",
        "motivo": "dolores musculares o corporales.",
        "estado": "terminado",
        "diagnostico": "dengue"
    },
    {
        "id": 2,
        "nombrePaciente": "Ana Pinzón",
        "motivo": "fatiga, debilidad, falta de aire.",
        "estado": "terminado",
        "diagnostico": "anemia"
    }
]
```
---
### 10. POST Enviar informes al doctor

POST http://localhost:8000/api/informes/enviar

nota: id se refiere al id del informe/test

json de entrada

```json
{
  "id": 2
}
```

salida esperada
```json
{
    "mensaje": "Informe 2 enviado correctamente y actualizado a 'enviado'."
}
```
---
### 11. GET Ver historial de informes enviados al doctor

nota: aquí se listan los informes que **ya han sido enviados al doctor**

GET http://localhost:8000/api/informes-enviados

salida esperada: 
```json
[
    {
        "id": 2,
        "nombrePaciente": "Ana Pinzón",
        "motivo": "fatiga, debilidad, falta de aire.",
        "estado": "enviado",
        "diagnostico": "anemia"
    }
]
```
---
### 12. POST Crear medicina

POST http://localhost:8000/api/despensa

json de entrada

```json
{
  "nombre": "Eritropoyetina",
  "descripcion": "Medicina para la anemia",
  "cantidad": 20
}
```

salida esperada

```json
{
    "mensaje": "Medicina registrada exitosamente."
}
```

---
### 13. Listar medicina en despensa

GET http://localhost:8000/api/despensa

salida esperada

```json
[
    {
        "id": 1,
        "nombre": "nauseol",
        "descripcion": "Medicina para el estomago",
        "cantidad": 30
    },
    {
        "id": 2,
        "nombre": "Eritropoyetina",
        "descripcion": "Medicina para la anemia",
        "cantidad": 20
    }
]
```
---
### 14. PATCH Editar medicina

PATCH http://localhost:8000/api/despensa/{id}

nota: por medio del id de la medicina se edita la cantida en despensa

entrada esperada
```json
{
  "cantidad": 25
}
```
salida esperada

```json
{
    "mensaje": "Cantidad de medicina 2 actualizada a 25 unidades."
}
```
---
### 15. GET Listar diagnósticos pendientes

GET http://localhost:8000/api/diagnostico

Aquí se listan diagnosticos los cuales no tienen receta médica

```json
{
    "diagnosticosPendientes": [
        {
            "id": 1,
            "nombre": "Juan Perez",
            "diagnostico": "dengue",
            "recetaAsignada": "",
            "estado": "pendiente"
        },
        {
            "id": 2,
            "nombre": "Ana Pinzón",
            "diagnostico": "anemia",
            "recetaAsignada": "",
            "estado": "pendiente"
        }
    ]
}
```
---
### 16. POST Recetar al paciente

POST http://localhost:8000/api/receta

entrada esperada

```json
{
  "patient_id": 2,
  "diagnostic_id": 2,
  "receta": [
    {
      "medicina": "nauseol",
      "cantidad": 3
    },
    {
      "medicina": "Eritropoyetina",
      "cantidad": 3
    }
  ]
}
```

salida esperada

```json
{
    "message": "Receta asignada correctamente"
}
```

---
### 17. POST Enviar resultados 

POST http://localhost:8000/api/resultado

cuando el doctor ya recetó la medicina se hace un post de los resultados para cuando se implemente lo del chatbot 

entrada esperada
```json
{
  "paciente": "Ana Pinzón",
  "diagnostico": "Anemia",
  "receta": [
    {
      "medicina": "nauseol",
      "cantidad": 3
    },
    {
      "medicina": "Eritropoyetina",
      "cantidad": 3
    }
  ]
}
```

salida
```json
{
    "message": "Resultado enviado y actualizado correctamente"
}
```

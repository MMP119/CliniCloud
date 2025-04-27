# Endpoints

## Autenticación Inicio

1. POST /api/login -> Iniciar sesión (correo, password)
2. POST /api/register_patient -> Reservar cita médica (nombre, correo, motivo, fecha) y generar id único 
3. POST /api/logout -> Cerrar sesión


## Página doctor

### Calendario

1. GET api/citas-doctor -> Obtener detalles de las citas del doctor (title, start, end)

### Citas

1. GET api/citas -> Ver detalles de las citas (id, nombre, correo, motivo, fecha, hora)
2. POST api/citas -> Enviar cita al laboratorio 

### Resultados

1. GET api/diagnostico -> listar diagnósticos de los pacientes (id, nombre, diagnostico)
2. POST api/receta -> asignar receta al paciente (nombre, cantidad)
3. POSR api/resultado -> enviar resultado al chatbot (paciente, diagnostico, receta)

### Despensa

1. GET  /api/despensa -> listar despensa (nombre, descripción, cantidad)
2. POST /api/verificar-reconocimiento -> reconocimiento facial
3. PATCH /api/despensa -> actualizar cantidad de medicina en despensa
4. POST /api/despensa -> agregar nueva medicina (nombre, descripción, cantidad)

------

## Laboratorio 

### Enviar informes

1. GET /api/informes-terminados -> obtener informes terminados
2. POST /api/informes/enviar -> Enviar informe a el doctor 

### Pruebas realizadas

1. GET /api/informes-terminados -> obtener informes terminados

### Revisar solicitudes

1. GET /api/solicitudes-lab -> obtener las solicitudes pendientes
2. PATCH /api/solicitudes-lab/:id enviar el diagnóstico
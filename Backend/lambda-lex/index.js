// index.js
const mysql = require("mysql2/promise");

exports.handler = async (event) => {
  try {
    // 1) Extraer el código único del slot
    const codigo = event.sessionState.intent.slots.codigo.value.interpretedValue;

    // 2) Conectar a RDS MySQL
    const connection = await mysql.createConnection({
      host:     process.env.DB_HOST,
      user:     process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,  // "CLINICLOUD"
    });

    // 3) Consultar nombre, diagnóstico y receta
    const [rows] = await connection.execute(
      `SELECT 
         p.Patient_Name       AS nombre,
         tp.Diagnostic        AS diagnostico,
         rd.Recipe            AS receta
       FROM PATIENT p
       LEFT JOIN TESTS_PERFORMED tp 
         ON tp.Patient_Id = p.Patient_Id
       LEFT JOIN RESULT_OF_DIAGNOSTIC rd 
         ON rd.Patient_Id = p.Patient_Id
       WHERE p.Unique_Code = ?
       LIMIT 1`,
      [codigo]
    );
    await connection.end();

    // 4) Formatear respuesta
    let mensaje;
    if (rows.length === 0 || !rows[0].nombre) {
      mensaje = `❌ No encontré ningún paciente con el código ${codigo}.`;
    } else {
      const { nombre, diagnostico, receta } = rows[0];
      mensaje =
        `👤 Paciente: ${nombre}\n` +
        `🩺 Diagnóstico: ${diagnostico || "–"}\n` +
        `💊 Receta: ${receta     || "–"}`;
    }

    // 5) Devolver a Lex V2
    return {
      sessionState: {
        dialogAction: { type: "Close" },
        intent: {
          name:  event.sessionState.intent.name,
          state: "Fulfilled",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content:     mensaje,
        },
      ],
    };

  } catch (error) {
    console.error("Error en Lambda al consultar RDS:", error);
    return {
      sessionState: {
        dialogAction: { type: "Close" },
        intent: {
          name:  event.sessionState.intent.name,
          state: "Failed",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content:     "Lo siento, ocurrió un error al consultar la base de datos.",
        },
      ],
    };
  }
};
